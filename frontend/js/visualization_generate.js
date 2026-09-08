// AI wedding visualization

const visualizeBtn = document.getElementById("visualizeWeddingBtn");
const visualizationContainer = document.getElementById("weddingVisualization");
const visualizationModal = document.getElementById("visualizationModal");
const closeVisualizationModal = document.getElementById(
  "closeVisualizationModal"
);

async function generateWeddingVisualization(description) {
  const response = await fetch("http://127.0.0.1:5000/visualize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description })
  });

  return response.json();
}

async function saveWeddingVisualization(prompt, imageBase64) {
  const userId = localStorage.getItem("wedding_user_id");
  const sessionId = localStorage.getItem("wedding_chat_session_id");

  if (!userId) return;

  await fetch("../backend/php/save_visualization.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
      prompt,
      image_base64: imageBase64
    })
  });
}

if (visualizeBtn) {
  visualizeBtn.addEventListener("click", async () => {
    const visualizationInput = document.getElementById("userQuestion");
    const question = visualizationInput.value.trim();

    if (question === "") {
      alert("Моля, опишете как си представяте сватбата.");
      return;
    }

    visualizationContainer.innerHTML =
      "<p>Генерирам визуална концепция...</p>";

    try {
      const result = await generateWeddingVisualization(question);

      if (result.error) {
        visualizationContainer.innerHTML = `<p>${result.error}</p>`;
        return;
      }

      const modalImage = document.getElementById("visualizationImage");
      modalImage.src = `data:image/png;base64,${result.image}`;
      visualizationModal.classList.add("active");

      // Clear the input after successful generation
      visualizationInput.value = "";
      visualizationInput.focus();
      visualizationContainer.innerHTML = "";

      await saveWeddingVisualization(result.prompt, result.image);
    } catch (error) {
      console.error(error);
      visualizationContainer.innerHTML =
        "<p>Възникна проблем при визуализацията.</p>";
    }
  });
}

if (closeVisualizationModal) {
  closeVisualizationModal.addEventListener("click", () => {
    visualizationModal.classList.remove("active");
  });
}

if (visualizationModal) {
  visualizationModal.addEventListener("click", (event) => {
    if (event.target === visualizationModal) {
      visualizationModal.classList.remove("active");
    }
  });
}