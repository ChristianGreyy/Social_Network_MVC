class CommentEvent {
  handleCreateComment(userId, postId) {
    jQuery(".post-comt-box textarea").on("keydown", async function (event) {
      if (event.keyCode == 13) {
        var comment = jQuery(this).val();
        jQuery(this).val("");
        const cookieHelper = new CookieHelper();
        const token = cookieHelper.getCookie("jwt");

        const response = await fetch("/api/v1/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            text: comment,
            author: userId,
            post: postId,
          }),
        });
      }
    });
  }
  handleRenderComment() {
    $(".comment").on("click", async function (e) {
      $(this)
        .parents(".post-meta")
        .siblings(".coment-area")
        .slideToggle("slow");
      let userPostElement = $(this).closest(".user-post");
      let postIdElement = userPostElement.find(".postId");
      console.log(postIdElement);
      let postId = postIdElement.val();
      const cookieHelper = new CookieHelper();
      const token = cookieHelper.getCookie("jwt");
      console.log(token);

      const response = await fetch(
        `/api/v1/comments?post=${postId}&populate=author`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();
      const comments = data.results;
      const commentHelper = new CommentHelper();
      let html = `
        <!-- Comment -->
        <ul class="we-comet">
      `;

      console.log(comments);

      html += commentHelper.solveRenderHTMLComment(comments);
      html += `
          <li>
          <a href="#" title=""
            class="showmore underline">more
            comments+</a>
        </li>
        <li class="post-comment">
          <div class="comet-avatar">
            <img src="/images/resources/nearly1.jpg"
              alt="">
          </div>
          <div class="post-comt-box">
            <form method="post">
              <textarea
                placeholder="Post your comment"></textarea>
              <div class="add-smiles">
                <div class="uploadimage">
                  <i
                    class="fa fa-image"></i>
                  <label
                    class="fileContainer">
                    <input type="file">
                  </label>
                </div>
                <span
                  class="em em-expressionless"
                  title="add icon"></span>
                <div class="smiles-bunch">
                  <i
                    class="em em---1"></i>
                  <i
                    class="em em-smiley"></i>
                  <i
                    class="em em-anguished"></i>
                  <i
                    class="em em-laughing"></i>
                  <i
                    class="em em-angry"></i>
                  <i
                    class="em em-astonished"></i>
                  <i
                    class="em em-blush"></i>
                  <i
                    class="em em-disappointed"></i>
                  <i
                    class="em em-worried"></i>
                  <i
                    class="em em-kissing_heart"></i>
                  <i
                    class="em em-rage"></i>
                  <i
                    class="em em-stuck_out_tongue"></i>
                </div>
              </div>
  
              <button type="submit"></button>
            </form>
          </div>
        </li>
      </ul>
      `;

      // Render comment
      let commentAreaElement = userPostElement
        .find(".friend-info")
        .find(".coment-area");
      commentAreaElement.html(html);

      // Create comment
      const commentEvent = new CommentEvent();
      commentEvent.handleCreateComment(user._id, postId);
    });
  }
}
