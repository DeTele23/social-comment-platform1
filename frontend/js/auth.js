// js/auth.js
import { apiRequest } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const logoutLink = document.getElementById("logoutLink");

  // REGISTER
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirm = document.getElementById("confirm-password").value;
      const message = document.getElementById("register-message");

      if (password !== confirm) {
        message.textContent = "Passwords do not match.";
        message.style.color = "red";
        return;
      }

      try {
        await apiRequest("register", "POST", { username, email, password });
        message.textContent = "Registration successful!";
        message.style.color = "green";
        registerForm.reset();
      } catch (err) {
        message.textContent = err.message;
        message.style.color = "red";
      }
    });
  }

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const message = document.getElementById("login-message");

      try {
        await apiRequest("login", "POST", { username, password });
        window.location.href = "dashboard.html";
      } catch (err) {
        message.textContent = err.message;
        message.style.color = "red";
      }
    });
  }

  // LOGOUT
  if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await apiRequest("logout", "POST");
        window.location.href = "index.html";
      } catch (err) {
        alert("Logout failed: " + err.message);
      }
    });
  }
});