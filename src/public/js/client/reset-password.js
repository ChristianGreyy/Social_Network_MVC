// Validate regex pattern
const validate = (element, value) => {
  if (element == "password") {
    // Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters
    return String(value).match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
  } else if (element == "phoneNumber") {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value);
  }
};

// When all field is invalid
const validateFormRegister = (element) => {
  document.getElementById(element).onchange = (e) => {
    const value = document.getElementById(element).value;
    if (!validate(element, value)) {
      document.getElementById(element.concat("-error")).style.display = "block";
    } else {
      document.getElementById(element.concat("-error")).style.display = "none";
    }
  };
};

// When onclick submit reset
const submitFormResetPassword = () => {
  document
    .getElementById("form-reset")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const password = document.getElementById("password").value;
      if (!validate("password", password)) {
        return;
      }
      const token = document.location.href.split("?token=")[1];
      const response = await fetch(
        `/api/v1/auth/reset-password?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      if (response.status == 204) {
        alert("Cập nhật mật khẩu thành công");
        window.location.href = "/auth/login";
        return;
      }
      alert("Lỗi server");
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
  validateFormRegister("password");
  submitFormResetPassword();
  solveHiddenPassword();
});
