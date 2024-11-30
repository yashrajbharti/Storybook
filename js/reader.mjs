import shoot from "./confetti.mjs";

const template = document.getElementById("read-aloud-template").content;
const form = document.getElementById("read-aloud-form");

const langMap = new Map([
  ["en", "en-US"],
  ["es", "es-ES"],
  ["ja", "ja-JP"],
]);
const voiceMap = new Map([
  ["en", "Google UK English Male"],
  ["es", "Google Español"],
  ["ja", "Google 日本語"],
]);

function read(event) {
  event.preventDefault();
  const textArea = document.getElementById("textarea");
  const text = textArea.value;
  form.style.display = "none";
  const clone = document.importNode(template, true);
  const readAloudComponent = clone.querySelector("read-aloud-component");
  clone.querySelector("p").textContent = text;
  readAloudComponent.setAttribute(
    "lang",
    langMap.get(textArea.dataset.language)
  );
  readAloudComponent.setAttribute(
    "voice",
    voiceMap.get(textArea.dataset.language)
  );
  document.body.appendChild(clone);
  readAloudComponent.addEventListener("reading-complete", (event) => {
    document.querySelector("dialog").showModal();

    [0, 100, 200].forEach((delay) => setTimeout(shoot, delay));
  });
}

export default read;
