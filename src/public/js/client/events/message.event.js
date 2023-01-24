class MessageEvent {
  async handleRenderMessage() {
    const cookieHelper = new CookieHelper();
    const messageHelper = new MessageHelper();
    const token = cookieHelper.getCookie("jwt");
    // &populateFk=users.sender,users.receiver
    const response = await fetch(
      `/api/v1/messages?sortBy=createdAt:desc&populatePk=users.sender,users.receiver,documents.document`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.status == 200) {
      const data = await response.json();
      const messagesData = data.results;
      const userMessages = [];
      const messages = messagesData.filter((message) => {
        if (
          !userMessages.find((userMessage) => {
            return (
              userMessage.includes(message.sender[0]._id) &&
              userMessage.includes(message.receiver[0]._id)
            );
          })
        ) {
          userMessages.push([message.sender[0]._id, message.receiver[0]._id]);
          return message;
        }
      });
      let html = messages.map((msg) => {
        return messageHelper.htmlUserChatList(msg);
      });
      $(".msg-pepl-list").html(html.join(""));

      const messageEvent = new MessageEvent();
      messageEvent.handleActiveMessage();
    }
  }

  async handleActiveMessage() {
    const userSlug =
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];

    // const navItem = $(".mesg-peple").find(".nav-item");
    const navItem = document.querySelectorAll(".nav-item");
    for (let i in navItem) {
      if (isElement(navItem[i])) {
        const aElement = navItem[i].querySelector("a");
        let slugElement = aElement.className;
        if (slugElement == userSlug) {
          aElement.classList.add("active");
        }
      }
    }
  }

  async handleRenderMessagerMessage(user) {
    const cookieHelper = new CookieHelper();
    const messageHelper = new MessageHelper();
    const token = cookieHelper.getCookie("jwt");
    const userSlug =
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];
    let url;
    if (window.location.href.split("/").length == 5) {
      const response = await fetch(
        `/api/v1/messages?sortBy=createdAt:asc&populatePk=users.sender,users.receiver,documents.document&friend=${userSlug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();
      if (response.status == 200) {
        const messages = data.results;
        let html = messages.map((msg) => {
          return messageHelper.htmlMessengerMessage(msg);
        });
        $(".conversations").html(html.join(""));
        // set scroll bar is bottom
        let messageBody = document.querySelector(".conversations");
        messageBody.scrollTop =
          messageBody.scrollHeight - messageBody.clientHeight;
      }
    }
  }

  async handleSubmitMessage() {
    // use emojies
    $(".emojies-list")
      .find("li")
      .on("click", function (e) {
        let currentText = $(".text-area").find("input")[0].value;
        $(".text-area").find("input")[0].value =
          currentText + e.target.innerText;
        $(".submit-message").css("display", "block");
      });

    // use attachment file
    $(".fileContainer")
      .find("input")
      .on("change", function (e) {
        $(".submit-message").css("display", "block");
        let file = e.target.files[0];
        // Photo
        if (file) {
          if (
            file.type == "image/png" ||
            file.type == "image/jpeg" ||
            file.type == "image/jpg" ||
            file.type == "image/webp"
          ) {
            $(".message-content").html(
              `
              <div style="position: relative; width: 50px; height: 50px;"
                class="message-content-photo">
                <img style="width: 100%; height: 100%; border-radius: 8px;"
                  src="${URL.createObjectURL(e.target.files[0])}" />
                <a class="message-conten-close"
                  style="width:24px; height: 24px; border-radius: 50%; display: flex; align-items: center;justify-content: center; position: absolute; right: -4px; top: -4px; background-color: white; z-index: 1; box-shadow: 0 0 10px #888; cursor: pointer;"
                  class="" title=""><i
                    class="fa fa-close"></i></a>
              </div>
              `
            );
          }
          // Document
          else if (
            file.type.includes(".document") ||
            file.type.includes(".sheet")
          ) {
            $(".message-content").html(`
            <div style="border-radius: 8px; margin-left: 30px; position: relative; width: 128px; height: 48px; background-color: #CCCCCC;"
              class="message-content-document">
              <div style="display: flex; align-items: center; width: 100%; height: 100%; padding: 14px;"
                class="message-content-document-content">
                <div style="background-color: white; color: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center;"
                  class="message-content-document-content__left">
                  <i class="ti-clip"></i>
                </div>
                <div
                  class="message-content-document-content__right" style="margin-left: 4px;">
                  ${
                    file.name.length > 9
                      ? file.name.slice(0, 6) + "..."
                      : file.name
                  }
                </div>
              </div>
              <a class="message-conten-close"
                style="width:24px; height: 24px; border-radius: 50%; display: flex; align-items: center;justify-content: center; position: absolute; right: -8px; top: -8px; background-color: white; z-index: 1; box-shadow: 0 0 10px #888; cursor: pointer;"
                class="" title=""><i
                  class="fa fa-close"></i></a>
            </div>
            `);
          }
          // Video
          else if (file.type == "video/mp4") {
            $(".message-content").html(
              `
              <div style="position: relative; width: 50px; height: 50px;"
                class="message-content-photo">
                <video style="width: 100%; height: 100%; border-radius: 8px;"
                  <source src="${URL.createObjectURL(
                    e.target.files[0]
                  )}"  type="video/mp4">
                </video>
                <a class="message-conten-close"
                  style="width:24px; height: 24px; border-radius: 50%; display: flex; align-items: center;justify-content: center; position: absolute; right: -4px; top: -4px; background-color: white; z-index: 1; box-shadow: 0 0 10px #888; cursor: pointer;"
                  class="" title=""><i
                    class="fa fa-close"></i></a>
              </div>
              `
            );
          }

          // Click close file
          $(".message-conten-close").on("click", function () {
            $(".submit-message").css("display", "none");

            $(".message-content").html(`
                <input type="text" placeholder="write your message here..">
              `);
            e.target.value = "";
            // set typing
            $(".text-area")
              .find("input")
              .on("keyup", async function (e) {
                if (e.target.value.length > 0) {
                  $(".submit-message").css("display", "block");
                } else {
                  $(".submit-message").css("display", "none");
                }
                console.log("typing...");
              });
          });
        } else {
          $(".submit-message").css("display", "none");

          $(".message-content").html(`
            <input type="text" placeholder="write your message here..">
          `);
          e.target.value = "";
          // set typing
          $(".text-area")
            .find("input")
            .on("keyup", async function (e) {
              if (e.target.value.length > 0) {
                $(".submit-message").css("display", "block");
              } else {
                $(".submit-message").css("display", "none");
              }
              console.log("typing...");
            });
        }
      });

    // typing
    $(".text-area")
      .find("input")
      .on("keyup", async function (e) {
        if (e.target.value.length > 0) {
          $(".submit-message").css("display", "block");
        } else {
          $(".submit-message").css("display", "none");
        }
        console.log("typing...");
      });

    // submit message
    $(".message-writing-box")
      .find("form")
      .on("submit", async function (e) {
        e.preventDefault();
        const cookieHelper = new CookieHelper();
        const token = cookieHelper.getCookie("jwt");
        const text = $(".text-area")?.find("input")?.[0]?.value;
        const receiverId = messenger.id;
        const senderId = user.id;
        const file = $(".fileContainer")?.find("input")?.[0]?.files?.[0];

        let createdMessage = new FormData();
        if (text) {
          createdMessage.append("text", text);
        }
        if (file) {
          createdMessage.append("file", file);
        }
        createdMessage.append("receiver", receiverId);
        createdMessage.append("sender", senderId);

        // return;

        const response = await fetch(`/api/v1/messages`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: createdMessage,
        });
        if (response.status == 201) {
          const data = await response.json();
          const message = data.results[0];
          const messageHelper = new MessageHelper();

          let contentElement = messageHelper.htmlContentElement(message);
          // Text
          if (message.text) {
            $(".text-area").find("input")[0].value = "";
          }
          // Photo
          if (message.photo) {
            $(".submit-message").css("display", "none");

            $(".message-content").html(`
            <input type="text" placeholder="write your message here..">
          `);
            e.target.value = "";
          }
          // Video
          if (message.video) {
            $(".submit-message").css("display", "none");

            $(".message-content").html(`
            <input type="text" placeholder="write your message here..">
          `);
            e.target.value = "";
          }

          // Document
          if (message.document) {
            $(".submit-message").css("display", "none");

            $(".message-content").html(`
            <input type="text" placeholder="write your message here..">
          `);
            e.target.value = "";
          }
          let bonusHtml = `
            <li class="me">
              <figure>
              <a href="/user/${user.slug}">
              <img style="width: 25px; height: 25px;" src="${
                user.avatar
              }" alt="">
              </a>

              </figure>
              <div class="text-box">
                  ${contentElement}
                  <span><i class="ti-check"></i><i class="ti-check"></i>
                      ${moment(message.updatedAt).from()}</span>
              </div>
          </li>
          `;
          $(".conversations").html($(".conversations").html() + bonusHtml);

          // set typing
          $(".text-area")
            .find("input")
            .on("keyup", async function (e) {
              if (e.target.value.length > 0) {
                $(".submit-message").css("display", "block");
              } else {
                $(".submit-message").css("display", "none");
              }
              console.log("typing...");
            });

          // set scroll bar is bottom
          var messageBody = document.querySelector(".conversations");
          messageBody.scrollTop =
            messageBody.scrollHeight - messageBody.clientHeight;

          const messageEvent = new MessageEvent();
          messageEvent.handleActiveMessage();
        }
      });
  }
}
