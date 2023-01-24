class MessageHelper {
  htmlUserChatList(message) {
    let messenger =
      message.sender[0]._id == user.id
        ? message.receiver[0]
        : message.sender[0];
    let messageContent;
    if (message.text) {
      messageContent =
        message.sender[0]._id == user.id
          ? "Bạn: ".concat(message.text)
          : message.sender[0].firstName.concat(": " + message.text);
    }
    if (message.photo) {
      messageContent =
        message.sender[0]._id == user.id
          ? "Bạn đã gửi 1 hình ảnh "
          : message.sender[0].firstName.concat("đã gửi 1 hình ảnh");
    }
    if (message.video) {
      messageContent =
        message.sender[0]._id == user.id
          ? "Bạn đã gửi 1 video "
          : message.sender[0].firstName.concat("đã gửi 1 video");
    }
    if (message.document.length > 0) {
      messageContent =
        message.sender[0]._id == user.id
          ? "Bạn đã gửi 1 file đính kèm "
          : message.sender[0].firstName.concat("đã gửi 1 file đính kèm");
    }
    return `
        <li class="nav-item unread">
            <a class="${messenger.slug}" href="/chat-messenger/${
      messenger.slug
    }">
                <figure><img src="${messenger.avatar}"
                        alt="">
                    <span class="status f-online"></span>
                </figure>
                <div class="user-name">
                    <h6 class="">${messenger.firstName.concat(
                      " " + messenger.lastName
                    )}</h6>
                    <span>${
                      messageContent.length > 33
                        ? messageContent.slice(0, 30) + "..."
                        : messageContent
                    } - ${moment(message.updatedAt).from()}</span>
                </div>
                <div class="more">
                    <div class="more-post-optns"><i class="ti-more-alt"></i>
                        <ul>
                            <li><i class="fa fa-bell-slash-o"></i>Mute</li>
                            <li><i class="ti-trash"></i>Delete</li>
                            <li><i class="fa fa-folder-open-o"></i>Archive
                            </li>
                            <li><i class="fa fa-ban"></i>Block</li>
                            <li><i class="fa fa-eye-slash"></i>Ignore
                                Message
                            </li>
                            <li><i class="fa fa-envelope"></i>Mark Unread
                            </li>
                        </ul>
                    </div>
                </div>
            </a>
        </li>
        `;
  }
  htmlContentElement(message) {
    let contentElement;
    // Text
    if (message.text) {
      contentElement = `<p>${message.text}</p>`;
    }
    // Photo
    if (message.photo) {
      contentElement = `<a href="${message.photo}"><img style="max-width: 100%;" src="${message.photo}"/></a>`;
    }
    // Video
    if (message.video) {
      contentElement = `<video controls>
        <source src="${message.video}" type="video/mp4">
      </video>`;
    }
    // Document
    if (message.document?.length > 0) {
      let size;
      if (message.document[0].size > 10000000000) {
        size = Math.round(message.document[0].size / Math.pow(1024, 2)) + "MB";
      } else {
        size = Math.round(message.document[0].size / Math.pow(1024, 1)) + "KB";
      }
      contentElement = `<a href="${message.document[0].path}">
        <div style="border-radius: 8px; margin-left: 30px; position: relative; width: 128px; height: 48px; background-color: #F2F3F5;"
          class="message-content-document">
          <div style="display: flex; align-items: center; width: 100%; height: 100%; padding: 14px;"
            class="message-content-document-content">
            <div style="background-color: white; color: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center;"
              class="message-content-document-content__left">
              <i class="ti-clip"></i>
            </div>
            <div
              class="message-content-document-content__right" style="margin-left: 4px; display: flex; flex-direction: column; align-items: start;">
              ${
                message.document[0].originalName.length > 9
                  ? message.document[0].originalName.slice(0, 6) + "..."
                  : message.document[0].originalName
              }
              <div>${size}</div>
            </div>
          </div>
        </div>
      </a>`;
    }
    return contentElement;
  }
  htmlMessengerMessage(message) {
    const messageHelper = new MessageHelper();

    let senderClass = message.sender[0]._id == user.id ? "me" : "you";
    const contentElement = messageHelper.htmlContentElement(message);
    return `
        <li class="${senderClass}">
            <figure>
            <a href="/user/${message.sender[0].slug}">
            <img style="width: 25px; height: 25px;"
            src="${message.sender[0].avatar}"
            alt="">
            </a>

            </figure>
            <div class="text-box">
                ${contentElement}
                <span><i class="ti-check"></i><i
                        class="ti-check"></i>
                    ${moment(message.updatedAt).from()}</span>
            </div>
        </li>
        `;
  }
}
