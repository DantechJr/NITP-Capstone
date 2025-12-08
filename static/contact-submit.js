document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const from_name = document.getElementById("from_name")?.value || "";
    const email_id = document.getElementById("email_id")?.value || "";
    const message = document.getElementById("message")?.value || "";

    if (!from_name.trim() || !email_id.trim() || !message.trim()) {
      showTempMessage("⚠️ Please fill in all fields.", "danger");
      return;
    }

    try {
      const resp = await fetch("/submit_contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ from_name, email_id, message })
      });

      const data = await resp.json();
      if (resp.ok && data.status === "ok") {
        showTempMessage("✅ " + (data.message || "Message sent."), "success");
        form.reset();
      } else {
        showTempMessage("❌ " + (data.message || "There was an error sending your message."), "danger");
      }
    } catch (err) {
      console.error(err);
      showTempMessage("🚫 Network error. Please try again later.", "danger");
    }
  });

  function showTempMessage(text, type) {
  const container = document.createElement("div");
  container.className = `alert alert-${type}`;
  container.role = "alert";
  container.textContent = text;

  const parent = document.querySelector(".contactForm") || document.body;
  parent.insertBefore(container, parent.firstChild);

  // Trigger fade-in
  requestAnimationFrame(() => {
    container.classList.add("show");
  });

  // Fade-out before removal
  setTimeout(() => {
    container.classList.remove("show");
    setTimeout(() => container.remove(), 500); // wait for transition
  }, 6000);
    }
});
