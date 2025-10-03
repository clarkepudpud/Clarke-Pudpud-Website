// Smooth scroll for navigation
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function(e) {
    if (this.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

console.log("Personal website loaded successfully!");

// Mastery
const nameHeader = document.querySelector(".text-info h1");
nameHeader.style.cursor = "pointer";
nameHeader.addEventListener("click", () => {
  window.location.href = "mastery.html";
});