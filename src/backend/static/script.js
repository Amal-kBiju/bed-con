// -------- Register --------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = registerForm.username.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const confirmPassword = registerForm.confirm_password.value;
    const role = registerForm.role.value;
    const captcha = grecaptcha.getResponse();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!captcha) {
      alert("Please complete CAPTCHA!");
      return;
    }

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role, captcha })
      });

      const data = await res.json();
      alert(data.message || data.error);

      if (res.status === 201) {
        window.location.href = "/"; // go to login page
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Error connecting to server");
    }
  });
}

// -------- Login --------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;
    const captcha = grecaptcha.getResponse();

    if (!captcha) {
      alert("Please complete CAPTCHA!");
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });


      const data = await res.json();
      alert(data.message || data.error);

      if (res.status === 200) {
        // Save user info
        sessionStorage.setItem("username", data.user.username);
        sessionStorage.setItem("role", data.user.role);
        sessionStorage.setItem("token", data.token);

        // Redirect based on role
        if (data.user.role === "admin") {
          window.location.href = "/admin_dashboard_page";
        } else {
          window.location.href = "/dashboard_page";
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error connecting to server");
    }
  });
}
// ================= CHATBOT LOGIC =================
document.addEventListener("DOMContentLoaded", () => {
  const chatBtn = document.getElementById("chatbot-button");
  const chatWin = document.getElementById("chatbot-window");
  const chatInput = document.getElementById("chatbot-input");
  const chatMessages = document.getElementById("chatbot-messages");

  if (!chatBtn || !chatInput || !chatMessages) return;

  chatBtn.onclick = () => {
    chatWin.style.display =
      chatWin.style.display === "flex" ? "none" : "flex";
  };

  chatInput.addEventListener("keypress", async (e) => {
    if (e.key !== "Enter") return;

    const msg = chatInput.value.trim();
    if (!msg) return;

    chatInput.value = "";
    chatMessages.innerHTML += `<div><b>You:</b> ${msg}</div>`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });

      const data = await res.json();

      chatMessages.innerHTML +=
        `<div><b>AI:</b> ${data.reply || "No response"}</div>`;

      chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (err) {
      console.error("Chatbot error:", err);
      chatMessages.innerHTML +=
        `<div style="color:red;">Chatbot unavailable</div>`;
    }
  });
});
