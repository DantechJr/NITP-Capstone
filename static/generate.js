document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.querySelector(".btn.btn-outline-success.me-md-2");
  const weekPlanBtn = document.querySelector(".btn.btn-outline-success:nth-child(2)");
  const resetBtn = document.querySelector(".btn.btn-outline-success:nth-child(3)");
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
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      outputArea.value = data.result;
    } catch (error) {
      outputArea.value = "❌ Error generating recipe. Please try again.";
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
        body: JSON.stringify({ ingredients })
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
