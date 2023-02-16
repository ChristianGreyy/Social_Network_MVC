class NotificationHelper {
  htmlNotifications(notification, sender) {
    console.log(sender);
    let content = "";
    let href = "";
    if (notification.type == "like") {
      content = "Đã thích bài viết của bạn";
      href = `/post/${notification.post}`;
    }
    if (notification.type == "comment") {
      content = "Đã bình luận bài viết của bạn";
      href = `/post/${notification.post}`;
    }
    if (notification.type == "friend") {
      content = "Đã chấp nhận lời mời kết bạn của bạn";
      href = `/user/${sender.slug}`;
    }
    let html = `
      <li id="notification-item-info" class="notification-item-info">
        <a href="${href}" id="${notification._id}" title="">
            <figure>
                <img style="width: 40px; height: 40px;" src="${
                  sender.avatar
                }" alt="">
            </figure>
            <div class="mesg-meta">
                <h6>${sender.firstName.concat(" " + sender.lastName)}</h6>
                <span>${content}</span>
                <i>${moment(notification.createdAt).from()}</i>
            </div>
          
   
    `;

    if (notification.read == false) {
      html += `
        <div style="background-color: #FA6342; width: 12px; height: 12px; border-radius: 50px; position: absolute; right: 12px;
        top: 50%;">
        </div>
      `;
    }

    html += `
      </a>
      </li>
    `;

    return html;
  }
}
