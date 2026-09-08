const dashboardWelcome = document.getElementById("dashboardWelcome");
const logoutBtn = document.getElementById("logoutBtn");

const userId = localStorage.getItem("wedding_user_id");
const userName = localStorage.getItem("wedding_user_name");
const userEmail = localStorage.getItem("wedding_user_email");

if (!userId) {
  window.location.href = "login.html";
}

if (dashboardWelcome && userName) {
  dashboardWelcome.textContent =
    `Добре дошли, ${userName}! Тук можете да проследите цялостната организация на вашата сватба.`;
}

loadWeddingEngine();

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("wedding_user_id");
    localStorage.removeItem("wedding_user_name");
    localStorage.removeItem("wedding_user_email");
    localStorage.removeItem("wedding_chat_session_id");
    window.location.href = "login.html";
  });
}

async function loadWeddingEngine() {
  try {
    const response = await fetch("http://127.0.0.1:5000/wedding-engine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });

    const result = await response.json();

    if (!result.success) return;

    const engine = result.data;
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const reservationInfo = document.getElementById("reservationInfo");
    const servicesInfo = document.getElementById("servicesInfo");
    const nextStepsInfo = document.getElementById("nextStepsInfo");
    const modulesInfo = document.getElementById("modulesInfo");

    progressBar.style.width = `${engine.progress}%`;
    progressText.textContent =
      `${engine.progress}% завършена организация`;

    const reservation = engine.reservation;

    if (reservation) {
      reservationInfo.innerHTML = `
        <p><strong>Дата:</strong> ${formatDate(reservation.wedding_date)}</p>
        <p><strong>Гости:</strong> ${reservation.guest_count ?? "-"}</p>
        <p><strong>Стил:</strong> ${translateStyle(reservation.wedding_style)}</p>
        <p><strong>Сезон:</strong> ${translateSeason(reservation.wedding_season)}</p>
        <p><strong>Бюджет:</strong> ${reservation.budget ?? "-"} €</p>
      `;
    } else {
      reservationInfo.innerHTML = "Все още няма създадена резервация.";
    }

    if (engine.selected_services?.length > 0) {
      servicesInfo.innerHTML =
        `<ul><li>${engine.selected_services.join("</li><li>")}</li></ul>`;
    } else {
      servicesInfo.innerHTML = "Все още няма избрани услуги.";
    }

    if (engine.actions?.length > 0) {
      nextStepsInfo.innerHTML = "";

      engine.actions.forEach((action) => {
        const actionItem = document.createElement("div");
        actionItem.className = "dashboard-action-item";

        const actionText = document.createElement("p");
        actionText.textContent = action.label;

        const actionButton = document.createElement("a");
        actionButton.href = action.url;
        actionButton.className = "dashboard-mini-btn";
        actionButton.textContent = getActionButtonText(action.type);

        actionItem.appendChild(actionText);
        actionItem.appendChild(actionButton);
        nextStepsInfo.appendChild(actionItem);
      });
    } else if (engine.next_steps?.length > 0) {
      nextStepsInfo.innerHTML =
        `<ul><li>${engine.next_steps.join("</li><li>")}</li></ul>`;
    } else {
      nextStepsInfo.innerHTML =
        "Няма критични липсващи стъпки към момента.";
    }

    let modules = "";

    modules += engine.visualization
      ? "✅ AI визуална концепция<br>"
      : "❌ AI визуална концепция<br>";

    modules += engine.wedding_context?.latest_layout_json
      ? "✅ Планер на залата<br>"
      : "❌ Планер на залата<br>";

    modules += engine.wedding_context?.latest_layout_analysis
      ? "✅ AI анализ на залата"
      : "❌ AI анализ на залата";

    modulesInfo.innerHTML = modules;
  } catch (error) {
    console.error(error);
  }
}

function formatDate(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("bg-BG");
}

function translateSeason(season) {
  const seasons = {
    spring: "Пролет",
    summer: "Лято",
    autumn: "Есен",
    winter: "Зима"
  };

  return seasons[season] || season || "-";
}

function translateStyle(style) {
  const styles = {
    classic: "Класически",
    luxury: "Луксозен",
    boho: "Бохо",
    minimal: "Минималистичен",
    romantic: "Романтичен"
  };

  return styles[style] || style || "-";
}

function translateStatus(status) {
  const statuses = {
    pending: "В процес на обработка",
    approved: "Одобрена",
    rejected: "Отхвърлена"
  };

  return statuses[status] || status || "-";
}

function getActionButtonText(type) {
  const labels = {
    services: "Към услугите",
    visualization: "Генерирай визия",
    planner: "Към планера",
    reservation: "Към резервации",
    offer: "Генерирай оферта",
    general: "Отвори"
  };

  return labels[type] || "Отвори";
}