// Validate regex pattern
const validate = (element, value) => {
  if (element == "firstName" || element == "lastName") {
    // console.log(value.length > 1);
    return value.length > 1;
  } else if (element == "email") {
    return String(value)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  } else if (element == "password") {
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

// When onclick submit register
const submitFormRegister = () => {
  document
    .getElementById("form-register")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const phoneNumber = document.getElementById("phoneNumber").value;
      if (
        !validate("firstName", firstName) ||
        !validate("lastName", lastName) ||
        !validate("email", email) ||
        !validate("password", password) ||
        !validate("phoneNumber", phoneNumber)
      ) {
        return;
      }

      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          password,
          email,
          password,
          phoneNumber,
        }),
      });

      const result = await response.json();
      console.log(response);
      if (response.status == 201) {
        window.location.href = "/auth/login";
        return;
      }
      alert("Lỗi server");
    });
};

window.addEventListener("load", (event) => {
  validateFormRegister("firstName");
  validateFormRegister("lastName");
  validateFormRegister("email");
  validateFormRegister("password");
  validateFormRegister("phoneNumber");
  submitFormRegister();
});
