const visualizationsGrid = document.getElementById("visualizationsGrid");
const userId = localStorage.getItem("wedding_user_id");

if (!userId) {
  window.location.href = "login.html";
}

async function loadVisualizations() {
  try {
    const response = await fetch("../backend/php/get_visualizations.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });

    const data = await response.json();

    if (!data.success) {
      visualizationsGrid.innerHTML = `<p>${data.message}</p>`;
      return;
    }

    if (data.visualizations.length === 0) {
      visualizationsGrid.innerHTML =
        "<p>Все още нямате запазени AI визуализации.</p>";
      return;
    }

    visualizationsGrid.innerHTML = "";

    data.visualizations.forEach((item) => {
      const card = document.createElement("div");
      card.className = "visualization-card";

      card.innerHTML = `
        <img
          src="data:image/png;base64,${item.image_base64}"
          alt="AI Wedding Visualization"
        >
        <div class="visualization-card-body">
          <p class="visualization-date">${item.created_at}</p>
          <p class="visualization-prompt">${item.prompt}</p>
        </div>
      `;

      visualizationsGrid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    visualizationsGrid.innerHTML =
      "<p>Възникна проблем при зареждане на визуализациите.</p>";
  }
}

loadVisualizations();