// COMMENT

socket.off("getComments").on("getComments", (comment) => {
  console.log("socket", comment);

  let userPost = $("input.postId[value='" + comment.post + "']").closest(
    ".user-post"
  );
  var parent = $(userPost).find(".showmore").parent("li");
  console.log(parent);
  var comment_HTML = `<li><div class="comet-avatar"><img alt="" src="${
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
