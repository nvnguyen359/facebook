window.addEventListener("DOMContentLoaded", createElements);

function createElements() {
  // console.log("createElements");
  const inputs = document.querySelectorAll(".ad-input");

  if (inputs) {
    inputs.forEach((input) => {
      const id = !input.getAttribute("id")
        ? "id-" + Math.floor(Math.random() * 10000) + 1
        : input.getAttribute("id");
      input.setAttribute("id", id);
      input.setAttribute("name", id);
      let item = document.getElementById(id).previousElementSibling;
      let main = document.createElement("div");
      main.className = "main";
      if (item) {
        item.after(main);
      } else {
        item = document.getElementById(id).parentElement;
        item.append(main);
      }
      main.appendChild(input);
      main.append(input);
      if (input.value != "") main.classList.add("ac");
      const text = input.getAttribute("label") || input.getAttribute("[label]");
      const label = document.createElement("label");
      label.textContent = text;
      if (input.hasAttribute("required")) {
        label.innerHTML += `<span >*</span>`;
      }
      label.setAttribute("for", id);
      if (text != "") {
        main.append(label);
      }

      //if (input.tagName.includes("SELECT")) return;
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
      let arr = input.getAttribute("data");

      if (Array.isArray(arr)) {
        const datalist = document.createElement("datalist");
        input.setAttribute("list", id);
        datalist.setAttribute("id", id);
        main.append(datalist);
        let arr1 = Array.from(arr);
        arr1.forEach((e) => {
          const option = document.createElement("option");
          option.value = e;
          option.text = e;
          datalist.appendChild(option);
        });
      }
      const placeholder = input.getAttribute("placeholder");
      const isplaceholder = input.hasAttribute("placeholder");
      input.setAttribute("placeholder", "");
      const events = "focusout keyup paste";

      events.split(" ").forEach((event) => {
        input.addEventListener(event.trim(), () => {
          input.value == ""
            ? main.classList.remove("ac")
            : main.classList.add("ac");
          chh(input, icon);
          if (isplaceholder != null && input.value == "") {
            input.setAttribute("placeholder", "");
          }
        });
      });

      input.addEventListener("click", (event) => {
        input.focus();
        main.classList.add("ac");
        if (input.value != "") {
          chh(input, icon);
        } else {
          if (isplaceholder) input.setAttribute("placeholder", placeholder);
        }
        event.preventDefault();
      });
    });
  }

  // document.querySelectorAll("[type=reset]").forEach((item) => {
  //   item.addEventListener('click',focuses);
  // });

  document.addEventListener("click", (event) => {
    if (event.target.tagName != "INPUT") {
      focuses();
    }
    if (event.target.tagName == "LABEL") {
      const main = event.target.parentElement;
      if (main.classList.contains("main")) {
        main.querySelector("input").click();
        event.preventDefault();
      }
    }
    
  });
}
function focuses() {
  const mains = document.querySelectorAll(".main>.ad-input");
  mains.forEach((input, index) => {
    //console.log('index', mains[index].closest(".main").children[1])
    if (input.value != "") {
      mains[index].closest(".main").classList.add("ac");
    }
  });
}

function chh(input, icon) {
  if (!icon) return;
  const height = input.clientHeight - 6;
  const h = `${height}px`;
  icon.style.width = h;
  icon.style.height = h;
  icon.innerHTML = "&#x2715";
}
function createRadio() {}
