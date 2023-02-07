class NotificationHelper {
  htmlNotifications(notification, sender) {
    let content = "";
    if (notification.type == "like") {
      content = "Đã like bài viết của bạn";
    }
    return `
              <li>
                <a href="/post/${notification.post}" title="">
                    <figure>
                        <img style="width: 40px; height: 40px;" src="${
                          sender.avatar
                        }" alt="">
                    </figure>
                    <div class="mesg-meta">
                        <h6>${sender.firstName.concat(
                          " " + sender.lastName
                        )}</h6>
                        <span>${content}</span>
                        <i>${moment(notification.createdAt).from()}</i>
                    </div>
                </a>
            </li>
            `;
  }
}
