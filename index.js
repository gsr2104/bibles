const textareaInput = document.getElementById("input");
const divLogin = document.getElementById("logo");

textareaInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});

divLogin.addEventListener("click", function () {
    location.reload(true);
});
