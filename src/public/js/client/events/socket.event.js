// COMMENT

socket.off("getComments").on("getComments", (comment) => {
  console.log("socket", comment);

  let userPost = $("input.postId[value='" + comment.post + "']").closest(
    ".user-post"
  );
  var parent = $(userPost).find(".showmore").parent("li");
  console.log(parent);
  var comment_HTML = `<li><div class="comet-avatar"><img style="width: 36px; height: 36px;" alt="" src="${
    user.avatar
  }"></div><div class="we-comment"><h5><a title="" href="time-line.html">${user.firstName.concat(
    " " + user.lastName
  )}</a></h5><p> 
      ${comment.text} 
      </p><div class="inline-itms"><span>${moment(
        comment.createdAt
      ).from()}</span><a title="Reply" href="#" class="we-reply"><i class="fa fa-reply"></i></a> <a href="#" title=""><i
      class="fa fa-heart"></i><span>${
        comment.likes.length
      }</span></a></div></div></li>`;

  $(comment_HTML).insertBefore(parent);

  let currentComment = $(userPost)
    .find(".post-meta")
    .find(".comment")
    .find("ins")
    .text();

  $(userPost)
    .find(".post-meta")
    .find(".comment")
    .find("ins")
    .text(+currentComment + 1);
});

// POST

socket.on("getNewPost", (newPost) => {
  console.log(newPost.results[0].author[0].slug);
  if (
    window.location.href.includes(newPost.results[0].author[0].slug) ||
    window.location.href == "http://localhost:8080/"
  ) {
    const postHelper = new PostHelper();
    newPost.results[0].comments = [];
    newPost.results[0].id = newPost.results[0]._id;
    let html = $(".loadMore").html();
    let newPostHtml = postHelper.solveRenderHTMLPost(
      newPost.results[0],
      newPost.results[0].author[0],
      user
    );
    newPostHtml += html;
    document.querySelector(".loadMore").innerHTML = newPostHtml;
    const commentEvent = new CommentEvent();
    commentEvent.handleRenderComment();
    const postEvent = new PostEvent();
    postEvent.handleUpdatePost();
  }
});

socket.on("getUpdatedPost", (newPost) => {
  let userPost = $("input.postId[value='" + newPost.id + "']").closest(
    ".user-post"
  );
  // update like of post
  $(userPost)
    .find(".post-meta")
    .find(".likes")
    .find("span")
    .text(newPost.likes.length);
});

// MESSAGE

socket.on("getNewMessage", async (newMessage) => {
  const message = newMessage.results[0];
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
  }
  // Video
  if (message.video) {
    $(".submit-message").css("display", "none");

    $(".message-content").html(`
    <input type="text" placeholder="write your message here..">
  `);
  }

  // Document
  if (message.document) {
    $(".submit-message").css("display", "none");

    $(".message-content").html(`
    <input type="text" placeholder="write your message here..">
  `);
  }
  let bonusHtml = `
    <li class="you">
      <figure>
      <a href="/user/${messenger.slug}">
      <img style="width: 25px; height: 25px;" src="${messenger.avatar}" alt="">
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

  // Solve user chat list
  const cookieHelper = new CookieHelper();
  const token = cookieHelper.getCookie("jwt");
  const response = await fetch(`/api/v1/users?status=onlineFriend`, {
    method: "GET",
    headers: new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    }),
  });
  const data = await response.json();
  const userOnlineData = data.results;

  const userSlug = message.sender[0].slug;

  const navItem = document.querySelectorAll(".nav-item");
  for (let i in navItem) {
    if (isElement(navItem[i])) {
      const aElement = navItem[i].querySelector("a");
      let slugElement = aElement.className;
      console.log(slugElement, userSlug);
      if (slugElement.includes(userSlug)) {
        navItem[i].innerHTML = messageHelper.htmlUserChatList(
          message,
          userOnlineData
        );
      }
    }
  }

  // set typing
  $(".text-area")
    .find("input")
    .on("keyup", async function (e) {
      if (e.target.value.length > 0) {
        $(".submit-message").css("display", "block");
      } else {
        $(".submit-message").css("display", "none");
      }
    });

  // set scroll bar is bottom
  var messageBody = document.querySelector(".conversations");
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

  const messageEvent = new MessageEvent();
  messageEvent.handleActiveMessage();
});

// USER

socket.on("addNewFriendRequest", async ({ user, strangerLength }) => {
  // in timeline
  if (window.location.href.includes(`/user/${user.slug}`) != -1) {
    $(".profile-controls").html(`
      <li class="add-tofrndlist add-tofrndlist-add-remove add-tofrndlist-add">
        <a href="#" title="Chấp nhận lời mời kết bạn" data-toggle="tooltip">
            <i class="fa fa-heart"></i>
        </a>
      </li>
      <li class="add-tofrndlist add-tofrndlist-add-remove add-tofrndlist-remove">
          <a href=" #" title="Hủy lời mời kết bạn"><i class="fa fa-trash"></i></a>
      </li>
      <li><a href="#" title="Follow" data-toggle="tooltip"><i
      class="fa fa-star"></i></a>
      </li>
      <li><a class="send-mesg" href="#" title="Send Message" data-toggle="tooltip"><i
            class="fa fa-comment"></i></a>
      </li>
    `);
  }
  // In dropdown
  $(".friend-requests-item").find("a.friend-requests-item-href").html(`
      <i class="fa fa-user"></i>
      <em class="bg-red">
        ${strangerLength}
      </em>
  `);

  const userEvent = new UserEvent();
  userEvent.handleAddFriend();
});

socket.on("addNewFriend", async ({ user, remoteUserNotiLength }) => {
  // in timeline
  if (window.location.href.includes(`/user/${user.slug}`) != -1) {
    $(".profile-controls").html(`
      <li class="friend">
          <a title="Bạn bè" data-toggle="tooltip">
              <i class="fa fa-user"></i>
          </a>
      </li>
      <li class="add-tofrndlist add-tofrndlist-remove-friend">
          <a href="#" title="Hủy kết bạn" data-toggle="tooltip">
              <i class="fa fa-trash"></i>
          </a>
      </li>
      <li><a href="#" title="Follow" data-toggle="tooltip"><i
      class="fa fa-star"></i></a>
      </li>
      <li><a class="send-mesg" href="#" title="Send Message" data-toggle="tooltip"><i
            class="fa fa-comment"></i></a>
      </li>
    `);
  }
  // In dropdown
  $(".notification-item").find("a.notification-item-href").html(`
    <i class="fa fa-bell"></i>
    <em class="bg-purple">
      ${remoteUserNotiLength}
    </em>
  `);
});

socket.on("removeFriendRequestOrFriend", async ({ user }) => {
  if (window.location.href.includes(`/user/${user.slug}`) != -1) {
    $(".profile-controls").html(`
    <li class="add-tofrndlist">
      <a href="#" title="" data-toggle="tooltip" data-original-title="Gủi lời mời kết bạn">
        <i class="fa fa-user-plus"></i>
      </a>
    </li>
    <li><a href="#" title="Follow" data-toggle="tooltip"><i
      class="fa fa-star"></i></a>
    </li>
    <li><a class="send-mesg" href="#" title="Send Message" data-toggle="tooltip"><i
          class="fa fa-comment"></i></a>
    </li>
    `);
  }
});
