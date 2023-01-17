class PostEvent {
  handleCreatePost(userId) {
    $(".attachments-image").on("change", function (e) {
      $(".photo-container").css("display", "flex");
      $(".photo").css("display", "block");
      $(".photo").attr("src", URL.createObjectURL(e.target.files[0]));
    });

    $(".post-btn").on("click", async function (e) {
      const cookieHelper = new CookieHelper();
      const token = cookieHelper.getCookie("jwt");
      const photo = $(".attachments-image")[0].files[0];
      const text = $(".newpst-input").find("textarea").val();
      let createdPost = new FormData();
      createdPost.append("content", text);
      createdPost.append("author", userId);
      createdPost.append("photo", photo);

      try {
        const response = await fetch("/api/v1/posts", {
          method: "POST",
          body: createdPost,
          headers: new Headers({
            Authorization: "Bearer " + token,
          }),
        });

        if (response.status == 201) {
          $(".postbox").find("textarea").val("");
          $(".postoverlay").css("display", "none");
          $(".photo-container").css("display", "none");
          $(".photo").css("display", "none");
          $(".photo").attr("src", "");

          $.toast({
            heading: "Tạo bài viết thành công",
            text: "",
            showHideTransition: "slide",
            icon: "success",
            loaderBg: "#fa6342",
            position: "bottom-right",
            hideAfter: 3000,
          });
        } else {
          $.toast({
            heading: "Lỗi server",
            text: "Xin vui lòng thử lại",
            showHideTransition: "fade",
            icon: "error",
            hideAfter: 7000,
            loaderBg: "#fa6342",
            position: "bottom-right",
          });
        }
      } catch (err) {
        $.toast({
          heading: "Lỗi server",
          text: "Xin vui lòng thử lại",
          showHideTransition: "fade",
          icon: "error",
          hideAfter: 7000,
          loaderBg: "#fa6342",
          position: "bottom-right",
        });
      }
    });
  }
  handleUpdatePost() {
    //--- heart like and unlike

    var counter = 0;
    var animated = false;
    $(".heart").on("click", async function () {
      const cookieHelper = new CookieHelper();
      const token = cookieHelper.getCookie("jwt");
      let userPostElement = $(this).closest(".user-post");
      let postIdElement = userPostElement.find(".postId");
      let postId = postIdElement.val();
      let post;

      try {
        const response = await fetch(`/api/v1/posts/${postId}`, {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
        });

        if (response.status == 200) {
          post = await response.json();
        } else {
          $.toast({
            heading: "Lỗi server",
            text: "Xin vui lòng thử lại",
            showHideTransition: "fade",
            icon: "error",
            hideAfter: 7000,
            loaderBg: "#fa6342",
            position: "bottom-right",
          });
        }
      } catch (err) {
        console.log(err);
        $.toast({
          heading: "Lỗi server",
          text: "Xin vui lòng thử lại",
          showHideTransition: "fade",
          icon: "error",
          hideAfter: 7000,
          loaderBg: "#fa6342",
          position: "bottom-right",
        });
      }

      let index = post.likes.indexOf(user.id);
      if (index == -1) {
        post.likes.push(user.id);
      } else {
        post.likes.splice(index, 1);
      }
      try {
        const response = await fetch(`/api/v1/posts/${postId}`, {
          method: "PATCH",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(post),
        });

        if (response.status == 200) {
          if (index == -1) {
            $(this).addClass("happy").removeClass("broken");
          } else {
            $(this).removeClass("happy").addClass("broken");
          }
          animated = true;

          const updatedPost = await response.json();
          $(this).children("span").text(updatedPost.likes.length);
        } else {
          $.toast({
            heading: "Lỗi server",
            text: "Xin vui lòng thử lại",
            showHideTransition: "fade",
            icon: "error",
            hideAfter: 7000,
            loaderBg: "#fa6342",
            position: "bottom-right",
          });
        }
      } catch (err) {
        console.log(err);
        $.toast({
          heading: "Lỗi server",
          text: "Xin vui lòng thử lại",
          showHideTransition: "fade",
          icon: "error",
          hideAfter: 7000,
          loaderBg: "#fa6342",
          position: "bottom-right",
        });
      }

      // if (!animated) {
      //   $(this).addClass("happy").removeClass("broken");
      //   animated = true;
      //   counter++;
      //   $(this).children("span").text(counter);
      // } else {
      //   $(this).removeClass("happy").addClass("broken");
      //   animated = false;
      //   counter--;
      //   $(this).children("span").text(counter);
      // }
    });
  }
  async handleRenderPost(remoteUser) {
    // get token
    const cookieHelper = new CookieHelper();
    const token = cookieHelper.getCookie("jwt");
    let response;
    if (remoteUser) {
      response = await fetch(
        `/api/v1/posts?author=${remoteUser._id}&sortBy=createdAt:desc&populateFk=comments.post`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    } else {
      response = await fetch(
        `/api/v1/posts?sortBy=createdAt:desc&populateFk=comments.post&populatePk=users.author`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    }

    const data = await response.json();
    const posts = data.results.map((post) => {
      post.id = post._id;
      return post;
    });

    const postHelper = new PostHelper();

    let html = posts.map((post) => {
      if (!remoteUser) {
        remoteUser = post.author[0];
      }
      return postHelper.solveRenderHTMLPost(post, remoteUser, user);
    });

    document.querySelector(".loadMore").innerHTML = html.join("");

    // Render comments & Creat comment
    const commentEvent = new CommentEvent();
    commentEvent.handleRenderComment();
    const postEvent = new PostEvent();
    postEvent.handleUpdatePost(posts);
  }
}
