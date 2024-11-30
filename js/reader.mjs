import shoot from "./confetti.mjs";

const template = document.getElementById("read-aloud-template").content;
const form = document.getElementById("read-aloud-form");

const langMap = new Map([
  ["en", "en-US"],
  ["es", "es-ES"],
  ["ja", "ja-JP"],
]);

function read(event) {
  event.preventDefault();
  const textArea = document.getElementById("textarea");
  const text = textArea.value;
  form.style.display = "none";
  const clone = document.importNode(template, true);
  clone.querySelector("p").textContent = text;
  clone
    .querySelector("read-aloud-component")
    .setAttribute("lang", langMap.get(textArea.dataset.language));
  document.body.appendChild(clone);
  const readAloudComponent = document.querySelector("read-aloud-component");
  readAloudComponent.addEventListener("reading-complete", (event) => {
    document.querySelector("dialog").showModal();

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  });
}

export default read;
