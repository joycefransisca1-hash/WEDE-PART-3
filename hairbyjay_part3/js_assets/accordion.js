/* =========================================================
   accordion.js
   2.1 Interactive Elements - a simple FAQ
   accordion for about.html. Click a question, its answer
   slides open; clicking it again (or another question)
   closes it.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".accordion-item");
   // not on about.html
   if (items.length === 0) return;

  items.forEach(item => {
    const trigger = item.querySelector(".accordion-trigger");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // close every item first (so only one is open at a time)
      items.forEach(i => {
        i.classList.remove("open");
        i.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });

      // then re-open the one that was clicked, unless it was already open
      if (!isOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
});
