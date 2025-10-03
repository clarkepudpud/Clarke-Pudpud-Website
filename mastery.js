document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelectorAll(".skill");
  skills.forEach(skill => {
    const progress = skill.querySelector(".progress");
    const percentSpan = skill.querySelector(".percent");
    const percent = skill.getAttribute("data-percent");
    let current = 0;

    const interval = setInterval(() => {
      if (current >= percent) {
        clearInterval(interval);
      } else {
        current++;
        progress.style.width = current + "%";
        percentSpan.textContent = current + "%";
      }
    }, 15);
  });
});
