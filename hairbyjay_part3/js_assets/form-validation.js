/* =========================================================
   form-validation.js
   Part 3, item 4 "Form Functionality and Validation".
   Handles BOTH contact.html and enquiries.html forms:
   - client-side validation (required fields, email format,
     phone format, minimum message length)
   - inline error messages under each field
   - "AJAX" submission: sends the form with fetch() instead
     of a full page reload, then shows a success message.

   IMPORTANT — read this:
   This is a static site with no backend/server of its own,
   so there is nowhere on your own site to "receive" the
   email. The code below posts to FormSubmit
   (https://formsubmit.co), a free service built exactly for
   this: it emails the form data to an address you control,
   no backend code required. You MUST replace
   "YOUR_EMAIL_HERE" below with your real email address
   before this will work. The first submission to a new
   address triggers a one-time confirmation email from
   FormSubmit that you have to click to activate it.
   ========================================================= */

const FORM_RECIPIENT_EMAIL = "YOUR_EMAIL_HERE@example.com"; // <-- change this

/* ---- validation rules ---- */

function showError(input, message) {
  const errorEl = document.getElementById(input.id + "-error");
  if (errorEl) errorEl.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(input) {
  const value = input.value.trim();

  if (input.hasAttribute("required") && value === "") {
    showError(input, "This field is required.");
    return false;
  }

  if (input.type === "email" && value !== "") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      showError(input, "Please enter a valid email address.");
      return false;
    }
  }

  if (input.type === "tel" && value !== "") {
    const phonePattern = /^[0-9+\s()-]{7,15}$/;
    if (!phonePattern.test(value)) {
      showError(input, "Please enter a valid phone number.");
      return false;
    }
  }

  if (input.tagName === "TEXTAREA" && value !== "" && value.length < 10) {
    showError(input, "Please enter at least 10 characters.");
    return false;
  }

  showError(input, "");
  return true;
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll("input, textarea, select").forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

/* ---- submission ---- */

async function submitFormAjax(form, statusEl) {
  const formData = new FormData(form);

  try {
    statusEl.textContent = "Sending...";
    statusEl.className = "form-status sending";

    const response = await fetch(`https://formsubmit.co/ajax/${FORM_RECIPIENT_EMAIL}`, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: formData
    });

    if (!response.ok) throw new Error("Network response was not ok");

    statusEl.textContent = "Thank you! Your message has been sent — we'll be in touch soon.";
    statusEl.className = "form-status success";
    form.reset();
  } catch (err) {
    statusEl.textContent = "Something went wrong sending your message. Please try again, or email us directly.";
    statusEl.className = "form-status error";
  }
}

/* ---- enquiries.html only: populate the product dropdown from
   products-data.js, and show a live price when one is chosen.
   This satisfies the brief's "present the user with a response
   related to cost/availability" requirement, right in the form. ---- */

function initEnquiryProductPreview() {
  const select = document.getElementById("enquiry-product");
  const preview = document.getElementById("enquiry-price-preview");
  if (!select || typeof PRODUCTS === "undefined") return;

  PRODUCTS.forEach(product => {
    const option = document.createElement("option");
    option.value = product.name;
    option.textContent = `${product.name} — R${product.price}`;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const chosen = PRODUCTS.find(p => p.name === select.value);
    preview.style.color = "var(--gold, #a9834f)";
    preview.textContent = chosen
      ? `${chosen.name} is R${chosen.price} and currently in stock.`
      : "";
  });
}

/* ---- wire up any form with class "validated-form" ---- */

document.addEventListener("DOMContentLoaded", () => {
  initEnquiryProductPreview();

  const forms = document.querySelectorAll(".validated-form");

  forms.forEach(form => {
    // live validation as the user types/leaves a field
    form.querySelectorAll("input, textarea, select").forEach(field => {
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault(); // stop normal page reload — we handle submission ourselves

      const statusEl = form.querySelector(".form-status");

      if (!validateForm(form)) {
        statusEl.textContent = "Please fix the errors above before submitting.";
        statusEl.className = "form-status error";
        return;
      }

      submitFormAjax(form, statusEl);
    });
  });
});
