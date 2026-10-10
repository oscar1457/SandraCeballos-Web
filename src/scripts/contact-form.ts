const forms = Array.from(document.querySelectorAll<HTMLFormElement>("[data-contact-form]"));

forms.forEach((form) => {
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea"));
  const errors = new Map(
    Array.from(form.querySelectorAll<HTMLElement>("[data-error-for]")).map((node) => [
      node.dataset.errorFor ?? "",
      node
    ])
  );

  const currentLanguage = () =>
    document.documentElement.dataset.currentLang === "en" ? "en" : "es";

  const messages = {
    success: {
      es: status?.dataset.successMessage ?? "Mensaje enviado.",
      en: status?.dataset.successMessageEn ?? "Message sent."
    },
    endpointMissing: {
      es: status?.dataset.endpointMissing ?? "Falta configurar el endpoint.",
      en: status?.dataset.endpointMissingEn ?? "The endpoint is not configured."
    },
    genericError: {
      es: status?.dataset.errorMessage ?? "No se pudo enviar el mensaje.",
      en: status?.dataset.errorMessageEn ?? "The message could not be sent."
    },
    required: {
      es: status?.dataset.requiredMessage ?? "Este campo es obligatorio.",
      en: status?.dataset.requiredMessageEn ?? "This field is required."
    },
    email: {
      es: status?.dataset.emailMessage ?? "Introduce un correo válido.",
      en: status?.dataset.emailMessageEn ?? "Enter a valid email."
    }
  };

  const message = (key: keyof typeof messages) => messages[key][currentLanguage()];

  const setStatus = (message: string) => {
    if (status) {
      status.textContent = message;
    }
  };

  const setFieldError = (name: string, message: string) => {
    const error = errors.get(name);
    const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
    if (error) {
      error.textContent = message;
    }
    field?.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const clearFeedback = () => {
    setStatus("");
    errors.forEach((error) => {
      error.textContent = "";
    });
    fields.forEach((field) => {
      field.removeAttribute("aria-invalid");
    });
  };

  const validate = () => {
    let valid = true;
    fields.forEach((field) => {
      if (field.name === "_gotcha") {
        return;
      }
      if (field.validity.valueMissing) {
        setFieldError(field.name, message("required"));
        valid = false;
      } else if (field.validity.typeMismatch) {
        setFieldError(field.name, message("email"));
        valid = false;
      }
    });
    return valid;
  };

  let invalidBatchQueued = false;

  form.addEventListener(
    "invalid",
    (event) => {
      event.preventDefault();
      const field = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (!invalidBatchQueued) {
        clearFeedback();
        invalidBatchQueued = true;
        queueMicrotask(() => {
          invalidBatchQueued = false;
          setStatus(message("genericError"));
        });
      }
      if (field.validity.valueMissing) {
        setFieldError(field.name, message("required"));
      } else if (field.validity.typeMismatch) {
        setFieldError(field.name, message("email"));
      }
    },
    true
  );

  const setSubmitting = (isSubmitting: boolean) => {
    form.dataset.submitting = String(isSubmitting);
    if (submitButton) {
      submitButton.disabled = isSubmitting;
      submitButton.textContent = isSubmitting
        ? currentLanguage() === "en"
          ? (submitButton.dataset.sendingLabelEn ?? "Sending...")
          : (submitButton.dataset.sendingLabel ?? "Enviando...")
        : currentLanguage() === "en"
          ? (submitButton.dataset.submitLabelEn ?? "Send message")
          : (submitButton.dataset.submitLabel ?? "Enviar mensaje");
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.submitting === "true") {
      return;
    }

    clearFeedback();

    if (!validate()) {
      setStatus(message("genericError"));
      return;
    }

    const endpoint = form.dataset.endpoint?.trim();
    if (!endpoint) {
      setStatus(message("endpointMissing"));
      return;
    }

    const formData = new FormData(form);
    if (String(formData.get("_gotcha") ?? "").trim()) {
      setStatus(message("genericError"));
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { errors?: Array<{ field?: string; message?: string }> }
          | null;
        payload?.errors?.forEach((error) => {
          if (error.field && error.message) {
            setFieldError(error.field, error.message);
          }
        });
        setStatus(message("genericError"));
        return;
      }

      form.reset();
      setStatus(message("success"));
    } catch {
      setStatus(message("genericError"));
    } finally {
      setSubmitting(false);
    }
  });
});
