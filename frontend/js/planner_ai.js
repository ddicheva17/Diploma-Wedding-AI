// AI Hall Analyzer and automatic layout generation

const analyzeLayoutBtn = document.getElementById("analyzeLayoutBtn");
const analysisModal = document.getElementById("layoutAnalysisModal");
const closeAnalysisModal = document.getElementById("closeAnalysisModal");
const analysisResult = document.getElementById("layoutAnalysisResult");

const generateAutoLayoutBtn = document.getElementById("generateAutoLayoutBtn");
const autoLayoutDescription = document.getElementById(
  "autoLayoutDescription"
);

if (closeAnalysisModal) {
  closeAnalysisModal.addEventListener("click", () => {
    analysisModal.classList.remove("active");
  });
}

async function analyzeHallLayout() {
  try {
    const stage = window.plannerStage;

    if (!stage) {
      alert("Planner модулът не е зареден.");
      return;
    }

    analysisResult.innerHTML =
      "AI анализира разположението на залата...";
    analysisModal.classList.add("active");

    const layoutJSON = stage.toJSON();

    const response = await fetch("http://127.0.0.1:5000/analyze-layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layout: layoutJSON })
    });

    const data = await response.json();
    const analysisText = data.analysis || "Няма върнат анализ.";

    analysisResult.innerHTML = analysisText;

    const userId = localStorage.getItem("wedding_user_id");

    if (userId && data.analysis) {
      try {
        const saveResponse = await fetch(
          "../backend/php/save_layout_analysis.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              analysis: data.analysis
            })
          }
        );

        const saveData = await saveResponse.json();

        if (!saveData.success) {
          console.warn("AI анализът не беше записан:", saveData.message);
        }
      } catch (saveError) {
        console.error(
          "Проблем при записване на AI анализа:",
          saveError
        );
      }
    }
  } catch (error) {
    console.error(error);
    analysisResult.innerHTML = "Възникна проблем при AI анализа.";
  }
}

function generateAutoHallLayout() {
  if (!autoLayoutDescription || !autoLayoutDescription.value.trim()) {
    alert("Моля, опишете желаното разпределение на залата.");
    return;
  }

  if (typeof window.generateAutoLayoutFromDescription !== "function") {
    alert("Layout Engine модулът не е зареден.");
    return;
  }

  generateAutoLayoutBtn.textContent = "Генериране...";
  generateAutoLayoutBtn.disabled = true;

  const layout = window.generateAutoLayoutFromDescription(
    autoLayoutDescription.value
  );

  console.log("Generated layout:", layout);

  generateAutoLayoutBtn.textContent = "🤖 AI Генерирай зала";
  generateAutoLayoutBtn.disabled = false;
}

if (analyzeLayoutBtn) {
  analyzeLayoutBtn.addEventListener("click", analyzeHallLayout);
}

if (generateAutoLayoutBtn) {
  generateAutoLayoutBtn.addEventListener("click", generateAutoHallLayout);
}