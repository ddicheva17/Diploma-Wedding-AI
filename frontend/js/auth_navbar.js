// Auth navbar and profile dropdown

document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.getElementById("authButton");
  const authMenu = document.getElementById("authMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const userName = localStorage.getItem("wedding_user_name");

  if (!authButton) return;

  if (userName) {
    authButton.textContent = `👤 ${userName}`;
    authButton.href = "#";

    authButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (authMenu) {
        authMenu.classList.toggle("active");
      }
    });

    document.addEventListener("click", (event) => {
      if (
        authMenu &&
        !authMenu.contains(event.target) &&
        event.target !== authButton
      ) {
        authMenu.classList.remove("active");
      }
    });
  } else {
    authButton.textContent = "Вход";
    authButton.href = "login.html";

    if (authMenu) {
      authMenu.style.display = "none";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("wedding_user_id");
      localStorage.removeItem("wedding_user_name");
      localStorage.removeItem("wedding_user_email");
      localStorage.removeItem("wedding_chat_session_id");
      window.location.href = "index.html";
    });
  }
});