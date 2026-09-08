const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    registerMessage.textContent = "Регистрацията се обработва...";

    try {
      const response = await fetch("../backend/php/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password
        })
      });

      const data = await response.json();
      registerMessage.textContent = data.message;

      if (data.success) {
        localStorage.setItem("wedding_user_id", data.user.id);
        localStorage.setItem("wedding_user_name", data.user.full_name);
        localStorage.setItem("wedding_user_email", data.user.email);
        window.location.href = "index.html";
      }
    } catch (error) {
      registerMessage.textContent = "Възникна проблем при регистрацията.";
    }
  });
}