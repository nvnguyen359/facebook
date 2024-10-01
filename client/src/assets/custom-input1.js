
window.addEventListener('DOMContentLoaded',createElements)
function createElements() {
  const inputs = document.querySelectorAll(".ad-input");
  if (inputs) {
    inputs.forEach((input) => {
      const id = "id-" + Math.floor(Math.random() * 10000) + 1;
      input.setAttribute("id", id);
      input.setAttribute("name", id);
      const main = document.createElement('div');
      main.className = "main";
      main.append(input);
      if (input.value != "") main.classList.add("ac");
      // const data = input.getAttribute("data") || input.getAttribute("[data]");
      const text = input.getAttribute("label") || input.getAttribute("[label]");
      const label = document.createElement("label");
      label.textContent = text;
      if (input.hasAttribute("required")) {
        label.innerHTML += `<span >*</span>`;
      }
      label.setAttribute("for", id);
      const events = "focusout keyup";

      if (input.tagName.includes("SELECT")) return;
      const icon = document.createElement("span");
      icon.setAttribute("matRipple", "");
      icon.classList.add("icon");
      icon.addEventListener("click", () => {
        input.value = "";
        main.classList.remove("ac");
        icon.style.transform = "";
        chh(input, icon);
      });
      main.append(icon);
      events.split(" ").forEach((event) => {
        input.addEventListener(event.trim(), () => {
          input.value == ""
            ? main.classList.remove("ac")
            : main.classList.add("ac");
          chh(input, icon);
        });
      });

      main.append(label);
      input.addEventListener("click", () => {
        main.classList.add("ac");
        chh(input, icon);
      });
   
    });
  document.body.appendChild(main);

  }
}
function chh(input, icon) {
  const height = input.clientHeight - 6;
  const h = `${height}px`;
  icon.style.width = h;
  icon.style.height = h;
  icon.innerHTML = "&#x2715";
}
