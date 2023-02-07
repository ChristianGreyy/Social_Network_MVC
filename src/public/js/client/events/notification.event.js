class NotificationEvent {
  async handleNotificationsDetail(notifications) {
    const notificationHelper = new NotificationHelper();
    const html = notifications.map((noti) => {
      return notificationHelper.htmlNotifications(noti, noti.sender);
    });
    $(".notification-box-list").html(html.join(""));
  }
}
