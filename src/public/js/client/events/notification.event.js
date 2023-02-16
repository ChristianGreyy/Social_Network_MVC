class NotificationEvent {
  async handleNotificationsDetail(notifications) {
    const notificationHelper = new NotificationHelper();
    const html = notifications.map((noti) => {
      return notificationHelper.htmlNotifications(noti, noti.sender);
    });
    $(".notification-box-list").html(html.join(""));
  }

  async handleUpdateNotifications(notifications) {
    $(".top-area > .setting-area > li > div > ul > li").on(
      "click",
      async function (e) {
        // e.preventDefault();
        let aElement = $(e.currentTarget).find("a");
        const notiId = aElement.attr("id");
        const cookieHelper = new CookieHelper();
        const token = cookieHelper.getCookie("jwt");
        try {
          const response = await await fetch(
            `/api/v1/notifications/${notiId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              body: JSON.stringify({
                read: true,
              }),
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    );

    // $(".notification-item")
    //   .$("#notification-item-info")
    //   .find("a")
    //   .on("click", function (e) {
    //     e.preventDefault();
    //     alert("ok");
    //   });
  }
}
