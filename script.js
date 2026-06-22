const currentYearSpan = document.getElementById("current-year");
const currentYear = new Date().getFullYear();
if (currentYearSpan) {
  currentYearSpan.textContent = currentYear;
}

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const waitlistModal = document.getElementById("waitlist-modal");
const waitlistTriggers = document.querySelectorAll(".js-waitlist-trigger");
const waitlistCloseControls = document.querySelectorAll(
  "[data-close-waitlist]",
);
const waitlistForm = document.querySelector(".waitlist-form");
const waitlistMessage = document.querySelector(".waitlist-message");
const waitlistEndpoint = "https://api.washub.ng/api/waitlist";
let lastFocusedElement = null;

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  navMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

function setWaitlistModal(open) {
  if (!waitlistModal) return;

  waitlistModal.hidden = !open;
  document.body.classList.toggle("modal-open", open);

  if (open) {
    lastFocusedElement = document.activeElement;
    const firstField = waitlistModal.querySelector(".waitlist-form input");
    firstField?.focus();
  } else {
    if (waitlistMessage) {
      waitlistMessage.textContent = "";
    }
    lastFocusedElement?.focus();
  }
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

waitlistTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    setMenu(false);
    setWaitlistModal(true);
  });
});

waitlistCloseControls.forEach((control) => {
  control.addEventListener("click", () => setWaitlistModal(false));
});

waitlistForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const invalidField = waitlistForm.querySelector(":invalid");
  if (invalidField) {
    waitlistMessage.textContent =
      "Please complete all fields before joining the waitlist.";
    invalidField.focus();
    return;
  }

  const formData = new FormData(waitlistForm);
  const submitButton = waitlistForm.querySelector(".waitlist-submit");
  const payload = {
    email: formData.get("email").trim(),
    fullnames: formData.get("fullnames").trim(),
    phoneNumber: formData.get("phoneNumber").trim(),
    isVendor: formData.get("isVendor") === "true",
  };

  waitlistMessage.textContent = "Joining the waitlist...";
  submitButton.disabled = true;

  try {
    const response = await fetch(waitlistEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
 
    if (!response.ok) {
      throw new Error(res.error);
    }

    waitlistMessage.textContent = res.message || "Successfully joined the waitlist!";
    waitlistForm.reset();
  } catch (error) {
    console.log("Waitlist submission error:", error);
    waitlistMessage.textContent = error || "Something went wrong. Please try again.";
  } finally {
    submitButton.disabled = false;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (waitlistModal && !waitlistModal.hidden) {
      setWaitlistModal(false);
    } else {
      setMenu(false);
    }
  }

  if (event.key === "Tab" && waitlistModal && !waitlistModal.hidden) {
    const focusable = waitlistModal.querySelectorAll(
      'button, input, a[href], select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
