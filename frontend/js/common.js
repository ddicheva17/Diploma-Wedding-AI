const API_BASE_URL = "http://127.0.0.1:5000";

function getCurrentUserId() {
  return localStorage.getItem("wedding_user_id");
}

function getCurrentUserName() {
  return localStorage.getItem("wedding_user_name");
}

function getCurrentUserEmail() {
  return localStorage.getItem("wedding_user_email");
}

function isUserLoggedIn() {
  return Boolean(getCurrentUserId());
}

function redirectToLogin() {
  window.location.href = "login.html";
}

async function postJSON(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return response.json();
}