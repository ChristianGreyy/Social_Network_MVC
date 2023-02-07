const handleRenderData = async () => {
  const notificationEvent = new NotificationEvent();
  notificationEvent.handleNotificationsDetail(notifications);
};

window.addEventListener("load", (event) => {
  handleRenderData();
});
