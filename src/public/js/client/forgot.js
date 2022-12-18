// Validate regex pattern
const validate = (element, value) => {
  if (element == "email") {
    return String(value)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }
};

// When all field is invalid
const validateFormForgot = (element) => {
  document.getElementById(element).onchange = (e) => {
    const value = document.getElementById(element).value;
    if (!validate(element, value)) {
      document.getElementById(element.concat("-error")).style.display = "block";
    } else {
      document.getElementById(element.concat("-error")).style.display = "none";
    }
  };
};

// When onclick submit forgot
const submitFormForgot = () => {
  document
    .getElementById("form-forgot")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      if (!validate("email", email)) {
        return;
      }
      const response = await fetch(`/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      console.log(response);

      if (response.status == 204) {
        alert("Đã gửi email");
        return;
      }
      alert("Lỗi server");
    });
};

window.addEventListener("load", (event) => {
  validateFormForgot("email");
  submitFormForgot();
});
