// ------------------------------------- Generator Form Script Start -----------------------------------//
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.querySelector(
    ".btn.btn-outline-success.me-md-2"
  );
  const weekPlanBtn = document.querySelector(
    ".btn.btn-outline-success:nth-child(2)"
  );
  const resetBtn = document.querySelector(
    ".btn.btn-outline-success:nth-child(3)"
  );
  const inputBox = document.getElementById("generateBox");
  const outputArea = document.getElementById("FormControlTextarea1");

  // Generate Recipe
 generateBtn.addEventListener("click", async () => {
      const query = inputBox.value.trim();
      if (!query) {
        outputArea.value = "⚠️ Please type an ingredient or dish first!";
        return;
      }

      try {
        const response = await fetch("/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        outputArea.value = data.result;
      } catch (error) {
        outputArea.value = "❌ Error generating recipe. Please try again.";
      }
    });

    // Trigger on Enter key
    inputBox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();   // stop page refresh
        generateBtn.click();      // reuse the button logic
      }
    });


  // Week Plan (ingredient-based)
  weekPlanBtn.addEventListener("click", async () => {
    const ingredients = inputBox.value.trim();
    if (!ingredients) {
      outputArea.value = "⚠️ Please type some ingredients for the weekly plan!";
      return;
    }

    try {
      const response = await fetch("/weekplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      outputArea.value = data.plan;
    } catch (error) {
      outputArea.value = "❌ Error generating week plan. Please try again.";
    }
  });

  // Reset
  resetBtn.addEventListener("click", () => {
    inputBox.value = "";
    outputArea.value = "";
  });
});

// -------------------------------- Generator Form Script End -------------------------------------------//

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
      alert("Your message has been sent successfully!");
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
