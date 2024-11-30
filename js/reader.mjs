const template = document.getElementById("read-aloud-template").content;
const form = document.getElementById("read-aloud-form");

function read(event) {
  event.preventDefault();
  const text = document.getElementById("textarea").value;
  form.style.display = "none";
  const clone = document.importNode(template, true);
  clone.querySelector("p").textContent = text;
  document.body.appendChild(clone);
  const readAloudComponent = document.querySelector("read-aloud-component");
  readAloudComponent.addEventListener("reading-complete", (event) => {
    console.log(event.detail.message);
    alert("Reading completed!");
  });
}

export default read;
