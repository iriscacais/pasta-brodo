const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("open");
    menuToggle.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  });
}
