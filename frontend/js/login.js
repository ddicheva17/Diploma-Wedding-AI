const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    loginMessage.textContent = "Входът се обработва...";

    try {
      const response = await fetch("../backend/php/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      loginMessage.textContent = data.message;

      if (data.success) {
        localStorage.setItem("wedding_user_id", data.user.id);
        localStorage.setItem("wedding_user_name", data.user.full_name);
        localStorage.setItem("wedding_user_email", data.user.email);
        window.location.href = "index.html";
      }
    } catch (error) {
      loginMessage.textContent = "Възникна проблем при входа.";
    }
  });
}