import ReadAloudComponent from "./read-aloud.mjs";
import write from "./writer.mjs";
import read from "./reader.mjs";

customElements.define("read-aloud-component", ReadAloudComponent);

const form = document.getElementById("read-aloud-form");

form.addEventListener("submit", read);

const generateButton = document.querySelector("button.secondary");

generateButton.addEventListener("click", write);
