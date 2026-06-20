const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function animateCount(element) {
  const target = Number(element.dataset.count || 0);
  const prefix = element.dataset.prefix || "";
  const start = performance.now();
  const duration = 800;

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = `${prefix}${formatter.format(value)}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

document.querySelectorAll("[data-count]").forEach((element) => {
  animateCount(element);
});

document.querySelectorAll(".tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    const tabs = button.closest(".tabs");
    tabs.querySelectorAll("button").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
  });
});
