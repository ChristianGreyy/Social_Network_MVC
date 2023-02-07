let editor;
class PostEvent {
  handleCreatePost(userId) {
    // New submit post box
    $(".new-postbox").click(function () {
      // $(this).find(".newpst-input").css("display", "block");
      const check = $(this).find("textarea#editor");
      if (check.length == 0) {
        $(this).find(".newpst-input").css("width", "100%");
        $(this).find(".newpst-input").css("margin", "30px 0");
        $(this).find("textarea").attr("id", "editor");

        ClassicEditor.create(document.querySelector("#editor"), {
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
          ],
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
              {
                model: "heading5",
                view: "h5",
                title: "Heading 5",
                class: "ck-heading_heading5",
              },
              {
                model: "heading6",
                view: "h6",
                title: "Heading 6",
                class: "ck-heading_heading6",
              },
            ],
          },
        })
          .then((newEditor) => {
            editor = newEditor;
            console.log(editor);
          })
          .catch((error) => {
            console.error(error);
          });
      }

      // .id = "editor";
      $(".postoverlay").fadeIn(500);
    });

    $(".attachments-image").on("change", function (e) {
      $(".photo-container").css("display", "flex");
      $(".photo").css("display", "block");
      $(".photo").attr("src", URL.createObjectURL(e.target.files[0]));
    });

    $(".post-btn").on("click", async function (e) {
      const cookieHelper = new CookieHelper();
      const token = cookieHelper.getCookie("jwt");
      const photo = $(".attachments-image")[0].files[0];
      const video = $(".attachments-video")[0].files[0];
      // const text = $(".newpst-input").find("textarea").val();
      const text = editor.getData();
      let createdPost = new FormData();
      createdPost.append("content", text);
      createdPost.append("author", userId);
      if (photo) {
        createdPost.append("file", photo);
      }
      if (video) {
        createdPost.append("file", video);
      }

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

    // console.log(html.join(""));

    document.querySelector(".loadMore").innerHTML = html.join("");

    const desElement = document.querySelectorAll(".description");
    // console.log(desElement);
    for (let i in desElement) {
      if (isElement(desElement[i])) {
        const pElement = desElement[i].querySelector("p");
        pElement.innerHTML = pElement.innerText;
      }
    }

    // Render comments & Creat comment
    const commentEvent = new CommentEvent();
    commentEvent.handleRenderComment();
    const postEvent = new PostEvent();
    postEvent.handleUpdatePost(posts);
  }

  async handlePostDetail(post) {
    let postDoc;
    // get token
    const cookieHelper = new CookieHelper();
    const token = cookieHelper.getCookie("jwt");
    const response = await fetch(
      `/api/v1/posts?_id=${post.id}&populateFk=comments.post&populatePk=users.author`,
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
      postDoc = data.results[0];
    }
    console.log(postDoc);
    const postHelper = new PostHelper();
    const html = postHelper.solveRenderHTMLPost(postDoc, user, user);
    document.querySelector(".loadMore").innerHTML = html;

    // Render comments & Creat comment
    const commentEvent = new CommentEvent();
    commentEvent.handleRenderComment();
    const postEvent = new PostEvent();
    postEvent.handleUpdatePost();

    const desElement = document.querySelector(".description");
    const pElement = desElement.querySelector("p");
    pElement.innerHTML = pElement.innerText;
  }
}
