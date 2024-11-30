class ReadAloudComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const container = document.createElement("div");

    container.innerHTML = `
        <slot name="paragraph"></slot>
        <slot name="start-btn"></slot>
      `;

    shadow.appendChild(container);

    this.highlight = true;
    this.speechRate = 1;
    this.selectedVoice = "default";
  }

  static get observedAttributes() {
    return ["lang", "highlight", "voice", "rate"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "highlight" && newValue === "false") {
      this.highlight = false;
    }
    if (name === "rate") {
      this.speechRate = parseFloat(newValue);
    }
    if (name === "voice") {
      this.selectedVoice = newValue;
    }
  }

  connectedCallback() {
    const paragraphSlot = this.shadowRoot.querySelector(
      'slot[name="paragraph"]'
    );
    paragraphSlot.addEventListener("slotchange", () => {
      this.initSpeechRecognition();
    });

    const startBtn = this.shadowRoot.querySelector('slot[name="start-btn"]');
    startBtn.addEventListener("slotchange", () => {
      this.attachStartButton();
    });
  }

  attachStartButton() {
    const startBtn = this.querySelector('[slot="start-btn"]');
    if (!startBtn) {
      console.error("No start button found!");
      return;
    }

    startBtn.addEventListener("click", () => {
      if (this.recognition) {
        this.recognition.start();
      }
    });
  }

  initSpeechRecognition() {
    const paragraphElement = this.querySelector('[slot="paragraph"]');
    if (!paragraphElement) {
      console.error("No paragraph found!");
      return;
    }

    const paragraphText = paragraphElement.textContent.trim().split(" ");
    let currentWordIndex = 0;

    const language = this.getAttribute("lang") || "en-US";
    const highlight = this.highlight;
    const voice = this.selectedVoice;
    const rate = this.speechRate;

    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if ("SpeechRecognition" in window) {
      console.log("Web Speech API is supported");

      this.recognition = new SpeechRecognition();
      this.recognition.lang = language;
      this.recognition.interimResults = true;
      this.recognition.continuous = true;

      this.highlightCurrentWord = (
        paragraphElement,
        paragraphText,
        index,
        highlight
      ) => {
        if (highlight) {
          const words = paragraphText
            .map((word, idx) => {
              return idx === index
                ? `<span class="highlighted-read-out">${word}</span>`
                : word;
            })
            .join(" ");
          paragraphElement.innerHTML = words;
        } else {
          paragraphElement.innerHTML = paragraphText.join(" ");
        }
      };

      this.highlightCurrentWord(
        paragraphElement,
        paragraphText,
        currentWordIndex,
        highlight
      );

      this.stripPunctuation = (word) => {
        return word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      };

      this.recognition.onresult = (event) => {
        let transcript = event.results[event.resultIndex][0].transcript
          .trim()
          .toLowerCase();

        let currentWord = this.stripPunctuation(
          paragraphText[currentWordIndex].toLowerCase()
        );

        if (transcript.includes(currentWord)) {
          currentWordIndex++;
          this.highlightCurrentWord(
            paragraphElement,
            paragraphText,
            currentWordIndex,
            highlight
          );

          if (currentWordIndex >= paragraphText.length) {
            this.recognition.stop();

            this.dispatchEvent(
              new CustomEvent("reading-complete", {
                detail: { message: "Reading completed" },
              })
            );
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.error(`Error occurred: ${event.error}`);
      };

      this.recognition.onend = () => {
        if (currentWordIndex < paragraphText.length) {
          this.recognition.start();
        }
      };
    } else {
      console.log("Web Speech API is not supported in this browser.");
      paragraphElement.textContent =
        "Web Speech API is not supported in this browser.";
    }
  }
}

export default ReadAloudComponent;
