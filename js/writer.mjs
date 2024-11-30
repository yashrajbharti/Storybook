import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

const write = async () => {
  const textArea = document.getElementById("textarea");
  const prompt = textArea.value.trim();
  textArea.value = "Generating...";
  if (!prompt) {
    return;
  }
  const writer = await ai.writer.create();
  const stream = await writer.writeStreaming(prompt, {
    context:
      "The request comes from someone who wants to hear a story and has given a prompt.",
  });
  textArea.value = "";
  let fullResponse = "";
  for await (const chunk of stream) {
    fullResponse = chunk.trim();
    textArea.value = DOMPurify.sanitize(fullResponse);
  }
};

export default write;
