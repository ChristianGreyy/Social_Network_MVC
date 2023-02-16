class CommentHelper {
  solveRenderHTMLComment(comments) {
    return comments
      .map((comment) => {
        return `
        <li>
          <div class="comet-avatar">
            <img style="width: 36px; height: 36px;" src="${
              comment.author.avatar
            }"
              alt="">
          </div>
          <div class="we-comment">
            <h5><a href="/user/${comment.author.slug}"
                title="">${comment.author.firstName.concat(
                  " " + comment.author.lastName
                )}</a></h5>
            <p>${comment.text}</p>
            <div class="inline-itms">
              <span>${moment(comment.createdAt).fromNow()}</span>
              <a class="we-reply" href="#"
                title="Reply"><i
                  class="fa fa-reply"></i></a>
              <a href="#" title=""><i
                  class="fa fa-heart"></i><span>${
                    comment.likes.length
                  }</span></a>
            </div>
          </div>
        </li>
        `;
      })
      .join("");
  }
}
