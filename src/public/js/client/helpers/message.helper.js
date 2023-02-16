class MessageHelper {
  htmlUserChatList(message, userOnline) {
    let messenger =
      message.sender[0]._id == user.id
        ? message.receiver[0]
        : message.sender[0];

    userOnline = userOnline.map((user) => user.id);
    // MESSAGE STATUS
    let messageStatus;
    let messageStatusRemote = {
      status: "seen",
      src: undefined,
    };
    if (message.read == false) {
      messageStatus = message.sender[0]._id == user.id ? "" : "unread";
    } else {
      messageStatus = "";
      messageStatusRemote =
        message.sender[0]._id == user.id
          ? {
              status: "seen active",
              src: message.receiver[0].avatar,
            }
          : messageStatusRemote;
    }

    // USER STATUS
    let userStatus;
    if (userOnline.includes(messenger._id)) {
      userStatus = "status f-online";
    } else {
      userStatus = "status f-off";
    }

    // CONTENT MESSAGE
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
          : message.sender[0].firstName.concat(" đã gửi 1 hình ảnh");
    }
    if (message.video) {
      messageContent =
        message.sender[0]._id == user.id
          ? "Bạn đã gửi 1 video "
          : message.sender[0].firstName.concat(" đã gửi 1 video");
    }
    if (message.document.length > 0) {
      messageContent =
        message.sender[0]._id == user.id
          ? "Bạn đã gửi 1 file đính kèm "
          : message.sender[0].firstName.concat(" đã gửi 1 file đính kèm");
    }
    return `
        <li class="nav-item ${messageStatus}">
            <a id="nav-item-messenger" style="display: flex; align-items: center;" class="${
              messenger.slug
            }" href="/chat-messenger/${messenger.slug}">
                <figure><img style="width: 40px;" src="${messenger.avatar}"
                        alt="">
                    <span class="${userStatus}"></span>
                </figure>
                <div style="padding-left: 12px;" class="user-name">
                    <h6 class="">${messenger.firstName.concat(
                      " " + messenger.lastName
                    )}</h6>
                    <span>${
                      messageContent.length > 33
                        ? messageContent.slice(0, 30) + "..."
                        : messageContent
                    } - ${moment(message.updatedAt).from()}</span>
                </div>
                <div style="position: absolute; right: 12px;" class="more">
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
                <div class="${messageStatusRemote.status}">
                    <img src="${messageStatusRemote.src}" />
                </div>
            </a>
        </li>
        `;
  }
  htmlContentElement(message, page) {
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
      let width;
      if (page == "index") width = "140px";
      contentElement = `<video controls style="width: ${width}">
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
  htmlMessengerMessage(message, page) {
    const messageHelper = new MessageHelper();

    let senderClass = message.sender[0]._id == user.id ? "me" : "you";
    let contentElement = messageHelper.htmlContentElement(message, page);
    if (page == "messenger") {
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
    } else {
      return `
        <li class="${senderClass}">
          <div style="float: right; ${
            senderClass == "me" ? "margin-left: 4px;" : "margin-right: 4px;"
          }" class="chat-thumb"><img style="width: 25px; height: 25px;" src="${
        message.sender[0].avatar
      }" alt="">
          </div>
          <div class="notification-event">
            <span class="chat-message-item">
              ${contentElement}
            </span>
            <span class="notification-date">${moment(
              message.updatedAt
            ).from()}</span>
          </div>
        </li>
      `;
    }
  }
}
