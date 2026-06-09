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
const waitlistCloseControls = document.querySelectorAll("[data-close-waitlist]");
const waitlistForm = document.querySelector(".waitlist-form");
const waitlistMessage = document.querySelector(".waitlist-message");
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

waitlistForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const invalidField = waitlistForm.querySelector(":invalid");
  if (invalidField) {
    waitlistMessage.textContent = "Please complete all fields before joining the waitlist.";
    invalidField.focus();
    return;
  }

  waitlistMessage.textContent = "Thanks, you are on the WashHub waitlist.";
  waitlistForm.reset();
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
