// ---------------- Contact Form Script Start -------------------//
const btn = document.getElementById("button");

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  btn.value = "Sending...";

  const serviceID = "default_service";
  const templateID = "template_7qw7ghh";

  emailjs.sendForm(serviceID, templateID, this).then(
    () => {
      btn.value = "Send Email";
      alert("Sent!");
    },
    (err) => {
      btn.value = "Send Email";
      alert(JSON.stringify(err));
    }
  );
});

// ---------------- Contact Form Script End -------------------//

// ----------------- Calculator Script Start -----------------------//

// Run only when modal is opened
document
  .getElementById("staticBackdrop2")
  .addEventListener("shown.bs.modal", () => {
    display = document.getElementById("display");
    display.value = "";
  });

// Calculator Functions
function press(char) {
  display.value += char;
}

function clearDisplay() {
  display.value = "";
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    display.value = eval(display.value);
  } catch {
    display.value = "Error";
  }
}

// ---------------- Calculator Script End -------------------//

// ---------------- Notepad Script Start -------------------//

function saveFile() {
  // Get the content from the text area
  const content = document.getElementById("text-editor").value;

  // Create a Blob (Binary Large Object) containing the text data
  const blob = new Blob([content], { type: "text/plain" });

  // Create a temporary link element
  const a = document.createElement("a");

  // Set the download filename and link the blob to the download URL
  a.download = "notes.txt";
  a.href = URL.createObjectURL(blob);

  // Append the link to the body (required for Firefox)
  document.body.appendChild(a);

  // Programmatically click the link to trigger the download
  a.click();

  // Clean up by removing the temporary link and revoking the object URL
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);

  alert("File saved as notes.txt");
}

function newFile() {
  // Clear the text area
  document.getElementById("text-editor").value = "";
  alert("New document created.");
}

// ---------------- Notepad Script End -------------------//
