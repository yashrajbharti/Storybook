import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

const textArea = document.getElementById("textarea");
const translationWrapper = document.querySelector(".translation");

let prompt = "";

const write = async () => {
  textArea.value = "Generating...";
  if (!prompt) {
    textArea.value = "Add a few lines here...";
    return;
  }
  try {
    const writer = await ai.writer.create();
    const stream = await writer.writeStreaming(prompt, {
      context:
        "The request comes from someone who wants to hear a story and has given a prompt.",
    });
    let fullResponse = "";
    for await (const chunk of stream) {
      fullResponse = chunk.trim();
      textArea.value = DOMPurify.sanitize(fullResponse);
    }
    translationWrapper.removeAttribute("hidden");
  } catch {
    textArea.value =
      "Uh Oh!, Seems the AI has some hiccup while creating the story, just click the button again or try a different prompt to generate.";
    translationWrapper.setAttribute("hidden", "");
  }
};

textArea.addEventListener("input", () => {
  prompt = textArea.value.trim();
});

textArea.addEventListener(`focus`, () => textArea.select());

export default write;
