import ReadAloudComponent from "./read-aloud.mjs";
import write from "./writer.mjs";
import read from "./reader.mjs";
import startTranslation from "./translation.mjs";

const form = document.getElementById("read-aloud-form");
const textArea = document.getElementById("textarea");
const generateButton = document.querySelector("button.secondary.generate");
const translationWrapper = document.querySelector(".translation");

form.addEventListener("submit", read);
customElements.define("read-aloud-component", ReadAloudComponent);
generateButton.addEventListener("click", write);

translationWrapper.addEventListener("click", (e) => {
  if (e.target.type === "button")
    startTranslation(textArea.dataset.language, e.target.title);
});
