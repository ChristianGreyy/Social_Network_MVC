class UserEvent {
  handleAddFriend() {
    let userEvent = new UserEvent();
    let userHelper = new UserHelper();
    $(".add-tofrndlist").on("click", async function (e) {
      // console.log($(this).closest(".drops-menu").is(':empty'));

      e.preventDefault();
      const cookieHelper = new CookieHelper();
      const token = cookieHelper.getCookie("jwt");
      // Accept/Remove another request add friend to user
      if ($(this).hasClass("add-tofrndlist-add-remove")) {
        let remoteUserCl;
        let remoteUserid;
        // In userRemote's timline
        if (
          typeof remoteUser !== "undefined" &&
          remoteUser.id.toString() != user.id.toString()
        ) {
          remoteUserCl = remoteUser;
          remoteUserid = remoteUser.id;
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

          user.friends = user.friends.map((friend) => {
            if (friend.user == remoteUserid && friend.status == "stranger") {
              friend.status = "friend";
            }
            return friend;
          });

          try {
            // const res = await Promise.all([
            //   fetch(`/api/v1/users/${user.id}`, {
            //     method: "PATCH",
            //     headers: new Headers({
            //       Authorization: "Bearer " + token,
            //       "Content-Type": "application/json",
            //     }),
            //     body: JSON.stringify(user),
            //   }),
            //   fetch(`/api/v1/users/${remoteUserid}`, {
            //     method: "PATCH",
            //     headers: new Headers({
            //       Authorization: "Bearer " + token,
            //       "Content-Type": "application/json",
            //     }),
            //     body: JSON.stringify(remoteUserCl),
            //   }),
            // ]);

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
          const index = user.friends.findIndex(
            (friend) => friend.user == remoteUserCl.id
          );
          user.friends.splice(index, 1);
          try {
            const response = await fetch(`/api/v1/users/${user.id}`, {
              method: "PATCH",
              headers: new Headers({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              }),
              body: JSON.stringify(user),
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
        const index = remoteUser.friends.findIndex(
          (friend) => friend.user == user.id
        );
        // Create request friend
        if (index == -1) {
          remoteUser.friends.push({
            user: user.id,
            status: "stranger",
          });
        }
        // Remove request friend
        else {
          remoteUser.friends.splice(index, 1);
          // Remove friend
          if ($(this).hasClass("add-tofrndlist-remove-friend")) {
            const index = user.friends.findIndex(
              (friend) => friend.user == user.id
            );
            user.friends.splice(index, 1);

            try {
              const response = await fetch(`/api/v1/users/${user.id}`, {
                method: "PATCH",
                headers: new Headers({
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                }),
                body: JSON.stringify(user),
              });

              if (response.status == 200) {
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
          const response = await fetch(`/api/v1/users/${remoteUser.id}`, {
            method: "PATCH",
            headers: new Headers({
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            }),
            body: JSON.stringify(remoteUser),
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
    $(".top-area > .setting-area > li > a").on("click", async function () {
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
                  console.log(messages);
                  let userMessenger;
                  if (messages[messages.length - 1].sender[0]._id != user.id) {
                    // Update api message status of user
                    if (messages[messages.length - 1].read == false) {
                      const response3 = await fetch(
                        `/api/v1/messages/${messages[messages.length - 1]._id}`,
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

                  $(".conversations").html(html.join(""));

                  // set scroll bar is bottom
                  let messageBody = document.querySelector(".conversations");
                  messageBody.scrollTop =
                    messageBody.scrollHeight - messageBody.clientHeight;
                }
              });
          }

          // const response = await fetch(`/api/v1/users?status=request`, {
          //   method: "GET",
          //   headers: new Headers({
          //     Authorization: "Bearer " + token,
          //     "Content-Type": "application/json",
          //   }),
          // });
          // if (response.status == 200) {
          //   const data = await response.json();
          //   const users = data.results;
          //   console.log(users);
          //   let html = users.map((user) => {
          //     return `
          //       <li>
          //         <div>
          //             <figure>
          //                 <img style="height: 40px; width: 40px;" src="${
          //                   user.avatar
          //                 }" alt="">
          //             </figure>
          //             <div class="mesg-meta">
          //                 <h6><a href="#" title="">${user.firstName.concat(
          //                   " " + user.lastName
          //                 )}</a></h6>
          //                 <span><b>Amy</b> is mutule friend</span>
          //                 <i>yesterday</i>
          //             </div>
          //             <div class="add-del-friends">
          //                 <a onclick="(function(){
          //               alert('Hey i am calling');
          //               return false;
          //           })()" class="add-tofrndlist-add" href="#" title=""><i class="fa fa-heart"></i></a>
          //                 <a class="add-tofrndlist-remove" href="#" title=""><i class="fa fa-trash"></i></a>
          //             </div>
          //         </div>
          //     </li>
          //     `;
          //   });
          //   $(dropdown).find(".drops-menu").html(html);
          //   $parent.find(".bg-red").text(users.length);
          // }
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

        console.log(friends);
      }
    } catch (e) {
      console.log(e);
      userHelper.handleErrorToast("Lỗi server", "Xin vui lòng thử lại");
    }
  }
}
