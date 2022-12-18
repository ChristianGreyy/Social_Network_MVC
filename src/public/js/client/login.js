const submitFormLogin = () => {
  console.log(document.getElementById("button").value);
  document
    .getElementById("form-login")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      console.log(email, password);
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log(response);
      if (response.status == 200) {
        window.location.href = "/";
        return;
      }

      const result = await response.json();
      alert("Sai email hoặc tài khoản");
    });
};

const solveHiddenPassword = () => {
  // Onlick the unhide password
  document.querySelector(".icon-open").onclick = (e) => {
    document.querySelector(".icon-close").style.display = "block";
    document.querySelector(".icon-open").style.display = "none";
    document.getElementById("password").type = "text";
  };

  // Onlick the hide password
  document.querySelector(".icon-close").onclick = (e) => {
    document.querySelector(".icon-open").style.display = "block";
    document.querySelector(".icon-close").style.display = "none";
    document.getElementById("password").type = "password";
  };
};

window.addEventListener("load", (event) => {
  submitFormLogin();
  solveHiddenPassword();
});
