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

socket.on("msg", (value) => [console.log(value)]);
