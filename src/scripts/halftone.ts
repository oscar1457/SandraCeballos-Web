// Trama de imprenta en WebGL: convierte una imagen o un vídeo en puntos de
// semitono que se dibujan a la resolución de la pantalla, así una fuente de
// baja calidad se ve nítida a cualquier tamaño. La usan «En el taller» y el
// vídeo de proceso de la ficha de obra.

type RGB = [number, number, number];

export type HalftoneOptions = {
  paper: RGB; // color del fondo (0–255)
  ink: RGB; // color de los puntos (0–255)
  cell: (cssWidth: number) => number; // tamaño de la celda en px CSS
  dotScale?: number; // radio máximo del punto respecto a la celda (más bajo = más suave)
  minDot?: number; // 0–1: cuánto punto queda en los blancos
  contrast?: number;
};

export type Halftone = {
  upload: (source: TexImageSource, width: number, height: number) => void;
  draw: () => void;
  resize: () => void;
  setPan: (value: number) => void;
};

const VERTEX = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAGMENT = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif
  uniform sampler2D u_tex;
  uniform vec2 u_res;
  uniform vec2 u_src;
  uniform float u_cell;
  uniform float u_pan;
  uniform float u_dot;
  uniform float u_min;
  uniform float u_contrast;
  uniform vec3 u_paper;
  uniform vec3 u_ink;

  // Encaja la fuente como "object-fit: cover"; u_pan (-1…1) elige qué parte vertical se ve.
  vec2 coverUV(vec2 p) {
    float scale = max(u_res.x / u_src.x, u_res.y / u_src.y);
    vec2 size = u_src * scale;
    vec2 offset = vec2((u_res.x - size.x) * 0.5, (u_res.y - size.y) * (0.5 + 0.5 * u_pan));
    return (p - offset) / size;
  }

  void main() {
    vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
    const float c = 0.70710678;
    mat2 rot = mat2(c, -c, c, c);
    vec2 q = rot * p;
    vec2 center = (floor(q / u_cell) + 0.5) * u_cell;
    vec2 sampleAt = center * rot;
    vec3 color = texture2D(u_tex, clamp(coverUV(sampleAt), 0.0, 1.0)).rgb;
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    lum = clamp((lum - 0.5) * u_contrast + 0.5, 0.0, 1.0);
    float radius = u_cell * u_dot * sqrt(1.0 - lum * (1.0 - u_min));
    float dist = length(q - center);
    float ink = 1.0 - smoothstep(radius - 0.8, radius + 0.8, dist);
    gl_FragColor = vec4(mix(u_paper, u_ink, ink), 1.0);
  }
`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

export const createHalftone = (canvas: HTMLCanvasElement, options: HalftoneOptions): Halftone | null => {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uRes = uniform("u_res");
  const uSrc = uniform("u_src");
  const uCell = uniform("u_cell");
  const uPan = uniform("u_pan");
  const toUnit = (rgb: RGB) => rgb.map((value) => value / 255) as RGB;
  gl.uniform3f(uniform("u_paper"), ...toUnit(options.paper));
  gl.uniform3f(uniform("u_ink"), ...toUnit(options.ink));
  gl.uniform1f(uniform("u_dot"), options.dotScale ?? 0.62);
  gl.uniform1f(uniform("u_min"), options.minDot ?? 0.12);
  gl.uniform1f(uniform("u_contrast"), options.contrast ?? 1.3);

  let hasFrame = false;
  let sourceSize: [number, number] = [1, 1];
  let pan = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    gl.uniform1f(uCell, options.cell(canvas.clientWidth) * ratio);
  };

  const draw = () => {
    if (!hasFrame) return;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uSrc, sourceSize[0], sourceSize[1]);
    gl.uniform1f(uPan, pan);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const upload = (source: TexImageSource, width: number, height: number) => {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    sourceSize = [width, height];
    hasFrame = true;
  };

  resize();
  return {
    upload,
    draw,
    resize,
    setPan: (value: number) => {
      pan = value;
    }
  };
};

// Añade las fuentes WebM y MP4 a un <video> (solo la primera vez).
export const attachSources = (video: HTMLVideoElement, base: string) => {
  if (video.dataset.loadedBase === base) return;
  video.dataset.loadedBase = base;
  video.querySelectorAll("source").forEach((source) => source.remove());
  [
    { src: `${base}.webm`, type: "video/webm" },
    { src: `${base}.mp4`, type: "video/mp4" }
  ].forEach(({ src, type }) => {
    const source = document.createElement("source");
    source.src = src;
    source.type = type;
    video.append(source);
  });
  video.load();
};
