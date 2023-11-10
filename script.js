const start = document.getElementById("start");
const intro = document.getElementById("intro");
const username = document.getElementById("username");
const invalid = document.getElementById("invalid");

start.addEventListener("click", (event) => {
  if (username.value) {
    username.classList.remove("invalid");
    invalid.style.display = "none";
    document.body.classList.add("gameon");
    intro.style.display = "none";
  } else {
    username.classList.add("invalid");
    invalid.style.display = "block";
    event.preventDefault();
  }
});
