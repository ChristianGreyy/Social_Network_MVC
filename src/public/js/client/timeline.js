const handleCreatePost = () => {
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

      if (response.status == 200) {
        window.location.href = "/";
        return;
      }

      const result = await response.json();
      alert("Sai email hoặc tài khoản");
    });
};

const handleRenderData = async () => {
  const slug = "<%= user.id %>";
  console.log(slug);
  const response = await fetch("/api/v1/auth/login", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.status == 200) {
    window.location.href = "/";
    return;
  }

  const result = await response.json();
  alert("Sai email hoặc tài khoản");
};

window.addEventListener("load", (event) => {
  // handleRenderData();
  // const user = <%= user %>;
  // console.log(user)
});
