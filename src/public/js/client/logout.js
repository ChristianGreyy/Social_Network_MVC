const solveLogout = () => {
  $("#logout").on("click", async function (e) {
    const cookieHelper = new CookieHelper();
    const token = cookieHelper.getCookie("jwt");
    e.preventDefault();
    const response = await fetch("/api/v1/auth/logout", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token,
      }),
    });
    if (response.status == 204) {
      window.location.href = "/auth/logout";
      const cookieHelper = new CookieHelper();
      cookieHelper.deleteCookie("jwt");
    }
  });
};

window.addEventListener("load", (event) => {
  solveLogout();
});
