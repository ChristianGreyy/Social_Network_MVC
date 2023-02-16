class UserEvent {
  handleAddFriend() {
    let userEvent = new UserEvent();
    let userHelper = new UserHelper();
    $(".add-tofrndlist").on("click", async function (e) {
      let userCl;
      // console.log($(this).closest(".drops-menu").is(':empty'));

      e.preventDefault();
      const cookieHelper = new CookieHelper();
      const token = cookieHelper.getCookie("jwt");

      try {
        const response = await fetch(`/api/v1/users/${user.id}`, {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        });

        if (response.status == 200) {
          userCl = await response.json();
        } else {
          userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
        }
      } catch (err) {
        console.log(err);
        userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
      }

      // Accept/Remove another request add friend to user
      if ($(this).hasClass("add-tofrndlist-add-remove")) {
        let remoteUserCl;
        let remoteUserid;
        // In userRemote's timline
        if (
          typeof remoteUser !== "undefined" &&
          remoteUser.id.toString() != user.id.toString()
        ) {
          remoteUserid = remoteUser.id;
          try {
            const response = await fetch(`/api/v1/users/${remoteUserid}`, {
              method: "GET",
              headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              }),
            });

            if (response.status == 200) {
              remoteUserCl = await response.json();
            } else {
              userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
            }
          } catch (err) {
            console.log(err);
            userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
          }
        }
        // In user's friend request
        else {
          remoteUserid = $(this)
            .closest("#stranger-item")
            .find("img")
            .attr("id");
          try {
            const response = await fetch(`/api/v1/users/${remoteUserid}`, {
              method: "GET",
              headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              }),
            });

            if (response.status == 200) {
              remoteUserCl = await response.json();
            } else {
              userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
            }
          } catch (err) {
            console.log(err);
            userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
          }
        }

        // Accept
        if ($(this).hasClass("add-tofrndlist-add")) {
          // In remote's timeline
          remoteUserCl.friends.push({
            user: user.id,
            status: "friend",
          });

          userCl.friends = userCl.friends.map((friend) => {
            if (friend.user == remoteUserid && friend.status == "stranger") {
              friend.status = "friend";
            }
            return friend;
          });

          // console.log("user", user.friends);
          // console.log("remoteUser", remoteUserCl.friends);

          try {
            const res = await Promise.all([
              fetch(`/api/v1/users/${user.id}`, {
                method: "PATCH",
                headers: new Headers({
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                }),
                body: JSON.stringify({
                  friends: userCl.friends,
                }),
              }),
              fetch(`/api/v1/users/${remoteUserid}`, {
                method: "PATCH",
                headers: new Headers({
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                }),
                body: JSON.stringify({
                  friends: remoteUserCl.friends,
                }),
              }),
            ]);

            // In remoteUser's timeline
            if (
              typeof remoteUser !== "undefined" &&
              remoteUser.id.toString() != user.id.toString()
            ) {
              let html = userHelper.htmlFriendProfileControl();
              $(".profile-controls").html(html);

              // Refresh tooltip
              $(".tooltip").removeClass("show");
              $('[data-toggle="tooltip"]').tooltip();
              $('[data-toggle="popover"]').popover();

              // Refresh event
              userEvent.handleAddFriend();
            }
            userHelper.handleSuccessToast(
              `Bạn và ${remoteUserCl.firstName.concat(
                " " + remoteUserCl.lastName
              )} đã trở thành bạn bè`
            );

            $(".friend-requests-item")
              .find(".bg-red")
              .text($(".friend-requests-item").find(".bg-red").text() - 1);
          } catch (err) {
            userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
          }
        }
        // Remove
        else if ($(this).hasClass("add-tofrndlist-remove")) {
          const index = userCl.friends.findIndex(
            (friend) => friend.user == remoteUserCl.id
          );
          userCl.friends.splice(index, 1);
          try {
            const response = await fetch(`/api/v1/users/${userCl.id}`, {
              method: "PATCH",
              headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              }),
              body: JSON.stringify({
                friends: userCl.friends,
              }),
            });

            if (response.status == 200) {
              if (
                remoteUser &&
                remoteUser.id.toString() != user.id.toString()
              ) {
                let html = userHelper.htmlNotFriendProfileControl();
                $(".profile-controls").html(html);
                // Refresh event
                userEvent.handleAddFriend();

                $(".tooltip").removeClass("show");
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover();
              }
              userHelper.handleSuccessToast(
                `Đã hủy lời mời kết bạn của ${remoteUserCl.firstName.concat(
                  " " + remoteUserCl.lastName
                )}`
              );
              $(".friend-requests-item")
                .find(".bg-red")
                .text($(".friend-requests-item").find(".bg-red").text() - 1);
            } else {
              userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
            }
          } catch (err) {
            userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
          }
        }
      }
      // Create/Remove user's request add friend to remoteUser || Remove friend
      else {
        let remoteUserCl;
        let remoteUserid = remoteUser.id;
        try {
          const response = await fetch(`/api/v1/users/${remoteUserid}`, {
            method: "GET",
            headers: new Headers({
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            }),
          });

          if (response.status == 200) {
            remoteUserCl = await response.json();
          } else {
            userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
          }
        } catch (err) {
          console.log(err);
          userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
        }

        const index = remoteUserCl.friends.findIndex(
          (friend) => friend.user == user.id
        );
        // Create request friend
        if (index == -1) {
          remoteUserCl.friends.push({
            user: user.id,
            status: "stranger",
          });
        }
        // Remove request friend
        else {
          remoteUserCl.friends.splice(index, 1);
          // Remove friend
          if ($(this).hasClass("add-tofrndlist-remove-friend")) {
            const index = userCl.friends.findIndex(
              (friend) => friend.user == user.id
            );
            userCl.friends.splice(index, 1);

            try {
              const response = await fetch(`/api/v1/users/${userCl.id}`, {
                method: "PATCH",
                headers: new Headers({
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                }),
                body: JSON.stringify({
                  friends: userCl.friends,
                }),
              });

              if (response.status == 200) {
                console.log(response);
                $(this).closest(".profile-controls").find(".friend").remove();
                $(this).removeClass("add-tofrndlist-remove-friend");
                // Add friend request appear
                $(this).html(`
                  <a href="#" title="Gủi lời mời kết bạn" data-toggle="tooltip">
                    <i class="fa fa-user-plus"></i>
                  </a>
                `);

                $(".tooltip").removeClass("show");
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover();
              } else {
                userHelper.handleErrorToast(
                  "Lỗi server",
                  "Xin vui lòng thử lại"
                );
              }
            } catch (err) {
              userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
            }
          }
        }

        try {
          const response = await fetch(`/api/v1/users/${remoteUserCl.id}`, {
            method: "PATCH",
            headers: new Headers({
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            }),
            body: JSON.stringify({
              friends: remoteUserCl.friends,
            }),
          });

          if (response.status == 200) {
            if (index == -1) {
              // Remove friend request appear
              $(".add-tofrndlist").html(`
                    <a href="#" title="Hủy lời mời kết bạn" data-toggle="tooltip">
                        <i class="fa fa-trash"></i>
                    </a>
                `);
              userHelper.handleSuccessToast(
                `Đã gửi lời mời kết bạn đến ${remoteUser.firstName.concat(
                  " " + remoteUser.lastName
                )}`
              );
            } else {
              // Add friend request appear
              $(".add-tofrndlist").html(`
                    <a href="#" title="Gủi lời mời kết bạn" data-toggle="tooltip">
                        <i class="fa fa-user-plus"></i>
                    </a>
                `);

              userHelper.handleSuccessToast("Hủy lời mời kết bạn thành công");
            }
            $(".tooltip").removeClass("show");

            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
          } else {
            userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
          }
        } catch (err) {
          userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
        }
      }
    });
  }
  handleRenderNotifications() {
    $(".top-area > .setting-area > li > a").on("click", async function (e) {
      e.preventDefault();
      const userEvent = new UserEvent();
      const cookieHelper = new CookieHelper();
      const messageHelper = new MessageHelper();
      const token = cookieHelper.getCookie("jwt");
      var $parent = $(this).parent("li");
      var dropdown = $(this).siblings("div");
      // Friend request notifications
      if ($parent.hasClass("friend-requests-item")) {
        if (!dropdown.hasClass("active")) {
          let userHelper = new UserHelper();

          const response = await fetch(`/api/v1/users?status=request`, {
            method: "GET",
            headers: new Headers({
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            }),
          });
          if (response.status == 200) {
            const data = await response.json();
            const users = data.results;
            $(dropdown)
              .find(".friend-requests-item-number")
              .text(`${users.length} New Requests`);
            console.log("request", users);
            let html = users.map((user) => {
              return `
                <li id="stranger-item">
                  <div>
                      <figure>
                          <img id="${
                            user.id
                          }" style="heigh: 40px; width: 40px;" src="${
                user.avatar
              }" alt="">
                      </figure>
                      <div class="mesg-meta">
                          <h6><a href="/user/${
                            user.slug
                          }" title="">${user.firstName.concat(
                " " + user.lastName
              )}</a></h6>
                          <span><b>Amy</b> is mutule friend</span>
                          <i>yesterday</i>
                      </div>
                      <div class="add-del-friends">
                      <a class="add-tofrndlist add-tofrndlist-add-remove add-tofrndlist-add" title=""><i class="fa fa-heart"></i></a>
                      <a class="add-tofrndlist add-tofrndlist-add-remove add-tofrndlist-remove" href="#" title=""><i class="fa fa-trash"></i></a>
                      </div>
                      
                  </div>
              </li>
              `;
            });
            $(dropdown).find(".drops-menu").html(html);
            $parent.find(".bg-red").text(users.length);
            userEvent.handleAddFriend();
          }
        }
      }
      // Message notifications
      else if ($parent.hasClass("message-item")) {
        if (!window.location.href.includes("chat-messenger")) {
          if (!dropdown.hasClass("active")) {
            const response = await Promise.all([
              await fetch(
                `/api/v1/messages?sortBy=createdAt:desc&populatePk=users.sender,users.receiver,documents.document`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                  },
                }
              ),
              await fetch(`/api/v1/users?status=onlineFriend`, {
                method: "GET",
                headers: new Headers({
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                }),
              }),
            ]);
            const [response1, response2] = response;

            if (response1.status == 200 && response2.status == 200) {
              const data1 = await response1.json();
              const data2 = await response2.json();

              const messagesData = data1.results;
              $(dropdown)
                .find(".message-item-number")
                .text(`${messagesData.length} New Messages`);
              const userOnlineData = data2.results;
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
                  userMessages.push([
                    message.sender[0]._id,
                    message.receiver[0]._id,
                  ]);
                  return message;
                }
              });
              let html = messages.map((msg) => {
                return messageHelper.htmlUserChatList(msg, userOnlineData);
              });
              $(dropdown).find(".drops-menu").html(html);

              // Handle click messenger
              $(".nav-item")
                .find("a#nav-item-messenger")
                .on("click", async (e) => {
                  e.preventDefault();
                  $(".chat-box").addClass("show");
                  const messengerSlug = e.currentTarget.className;

                  const response = await Promise.all([
                    await fetch(
                      `/api/v1/messages?sortBy=createdAt:asc&populatePk=users.sender,users.receiver,documents.document&friend=${messengerSlug}`,
                      {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: "Bearer " + token,
                        },
                      }
                    ),
                    await fetch(`/api/v1/users?status=onlineFriend`, {
                      method: "GET",
                      headers: new Headers({
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                      }),
                    }),
                  ]);
                  const [response1, response2] = response;

                  if (response1.status == 200 && response2.status == 200) {
                    const data1 = await response1.json();
                    const data2 = await response2.json();
                    const messages = data1.results;
                    const userOnlineData = data2.results.map((user) => user.id);
                    let userMessenger;
                    if (
                      messages[messages.length - 1].sender[0]._id != user.id
                    ) {
                      // Update api message status of user
                      if (messages[messages.length - 1].read == false) {
                        const response3 = await fetch(
                          `/api/v1/messages/${
                            messages[messages.length - 1]._id
                          }`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: "Bearer " + token,
                            },
                            body: JSON.stringify({
                              read: true,
                            }), // body data type must match "Content-Type" header
                          }
                        );
                      }
                      userMessenger = messages[messages.length - 1].sender[0];
                    } else {
                      userMessenger = messages[messages.length - 1].receiver[0];
                    }

                    // Render messenger message
                    let html = messages.map((msg) => {
                      return messageHelper.htmlMessengerMessage(msg, "index");
                    });

                    $(".chat-head").find("h6").text(userMessenger.firstName);

                    $(".conversations-index").html(html.join(""));

                    if (userOnlineData.includes(userMessenger._id)) {
                      $(".chat-box")
                        .find("span.status")
                        .attr("class", "status f-online");
                    } else {
                      console.log($(".chat-box").find("span.status"));
                      $(".chat-box")
                        .find("span.status")
                        .attr("class", "status f-offline");
                    }

                    // submit message
                    userMessenger.id = userMessenger._id;
                    const messageEvent = new MessageEvent();
                    messageEvent.handleSubmitMessage(userMessenger, "index");

                    // set scroll bar is bottom
                    let messageBody = document.querySelector(
                      ".conversations-index"
                    );
                    messageBody.scrollTop =
                      messageBody.scrollHeight - messageBody.clientHeight;
                  }
                });
            }
          }
        }
      }
      // Notification notifications
      else if ($parent.hasClass("notification-item")) {
        if (!dropdown.hasClass("active")) {
          const notificationHelper = new NotificationHelper();
          const response = await await fetch(
            `/api/v1/notifications?sortBy=createdAt:desc&receiver=${user.id}&populatePk=users.sender`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );

          const data = await response.json();
          const notifications = data.results;
          $(dropdown)
            .find(".notification-item-number")
            .text(`${notifications.length} New Notifications`);
          const html = notifications.map((noti) => {
            let sender = noti.sender[0];
            return notificationHelper.htmlNotifications(noti, sender);
          });
          $(dropdown).find(".drops-menu").html(html.join(""));

          // Update unread notification
          const notificationEvent = new NotificationEvent();
          notificationEvent.handleUpdateNotifications();
        }
      }

      $(this)
        .addClass("active")
        .parent()
        .siblings()
        .children("a")
        .removeClass("active");
      $parent.siblings().children("div").removeClass("active");
      $(this).siblings("div").toggleClass("active");
      return false;
    });
  }
  async handleRenderTimelineFriend() {
    const userEvent = new UserEvent();
    const userHelper = new UserHelper();
    const cookieHelper = new CookieHelper();
    const token = cookieHelper.getCookie("jwt");
    try {
      const response = await fetch(`/api/v1/users?status=friend`, {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });

      console.log(response);
      if (response.status == 200) {
        const data = await response.json();
        const friends = data.results;
        const html = friends.map((friend) => {
          return userHelper.htmlTimelineFriend(friend);
        });
        $(".central-meta-friend").html(html.join(""));
        $(".send-mesg").on("click", function () {
          $(".popup-wraper1").addClass("active");
          return false;
        });
        console.log(friends);
      }
    } catch (e) {
      console.log(e);
      userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
    }
  }

  async handleRenderOnlineFriend() {
    const userEvent = new UserEvent();
    const userHelper = new UserHelper();
    const cookieHelper = new CookieHelper();
    const token = cookieHelper.getCookie("jwt");
    try {
      const response = await fetch(`/api/v1/users?status=onlineFriend`, {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
      });

      if (response.status == 200) {
        const data = await response.json();
        const friends = data.results;
        const html = friends.map((friend) => {
          return userHelper.htmlOnlineFriend(friend);
        });
        $(".chat-users").html(html.join(""));
      }
    } catch (e) {
      console.log(e);
      userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
    }
  }

  async handleUpdateUser() {
    let file = "";
    $(".fileContainer-avatar").on("change", (e) => {
      $(".change-photo")
        .find("img")
        .attr("src", URL.createObjectURL(e.target.files[0]));
      file = e.target.files[0];
    });

    $(".updateUser").on("submit", async (e) => {
      e.preventDefault();
      const cookieHelper = new CookieHelper();
      const token = cookieHelper.getCookie("jwt");
      const dataArray = $(".updateUser").serializeArray();
      const updatedUser = new FormData();
      dataArray.forEach((data) => {
        if (data.value) {
          if (data.name == "birthday") {
            console.log(data.value);
            let [year, month, day] = data.value.split("-");
            updatedUser.append("month", month);
            updatedUser.append("day", day);
            updatedUser.append("year", year);
          } else {
            updatedUser.append(data.name, data.value);
          }
        }
      });
      if (file) {
        updatedUser.append("file", file);
      }

      const response = await fetch(`/api/v1/users/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: updatedUser,
      });

      if (response.status == 200) {
        location.reload();
      }
    });
  }
}
