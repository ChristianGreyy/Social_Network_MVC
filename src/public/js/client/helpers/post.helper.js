class PostHelper {
  solveRenderHTMLPost(post, remoteUser, user) {
    post.likes.reverse();

    const likedUsers = post.likes.filter((user, index) => {
      return index <= 4;
    });

    let likedUsersName = [];

    let likedUsersHtml = likedUsers
      .map((user, index) => {
        if (index <= 1) {
          likedUsersName.push(user.firstName);
        }
        return `
        <a  data-toggle="tooltip" title="${user.firstName}"
          href="/user/${user.slug}">
          <img style="width: 36px; height: 36px;" alt=""
            src="${user.avatar}">
        </a>
        
      `;
      })
      .join("");

    if (likedUsersName.length >= 2) {
      likedUsersHtml += `
        <span> <b>${likedUsersName[0]}</b>, <b>${likedUsersName[1]}</b> 
        and
        <a href="#" title="">${post.likes.length - likedUsersName.length}</a>
        liked</span>
      `;
    } else if (likedUsersName.length >= 1) {
      likedUsersHtml += `
        <span> <b>${likedUsersName[0]}</b>
        and
        <a href="#" title="">${post.likes.length - likedUsersName.length}</a>
        liked</span>
      `;
    } else {
      likedUsersHtml += `
      <span>
      <a href="#" title="">${post.likes.length - likedUsersName.length}</a>
      liked</span>  
    `;
    }

    console.log(likedUsersHtml);

    let res = `
    <div class="central-meta item">
      <div class="user-post">
        <input type="hidden" class="postId" value="${
          post.id ? post.id : post._id
        }">
        <div class="friend-info">
          <!-- Avatar author -->
          <figure>
            <img style="width: 40px; height: 40px;" src="${
              remoteUser.avatar
            }" alt="">
          </figure>
          <!-- Info author -->
          <div class="friend-name">
            <div class="more">
              <div class="more-post-optns"><i
                  class="ti-more-alt"></i>
                <ul>
                  <li><i
                      class="fa fa-pencil-square-o"></i>Edit
                    Post</li>
                  <li><i
                      class="fa fa-trash-o"></i>Delete
                    Post
                  </li>
                  <li class="bad-report"><i
                      class="fa fa-flag"></i>Report
                    Post
                  </li>
                  <li><i
                      class="fa fa-address-card-o"></i>Boost
                    This Post</li>
                  <li><i
                      class="fa fa-clock-o"></i>Schedule
                    Post
                  </li>
                  <li><i
                      class="fa fa-wpexplorer"></i>Select
                    as
                    featured</li>
                  <li><i
                      class="fa fa-bell-slash-o"></i>Turn
                    off
                    Notifications</li>
                </ul>
              </div>
            </div>
            <ins><a href="/user/${
              remoteUser.slug
            }" title="">${remoteUser.firstName.concat(
      " " + remoteUser.lastName
    )}</a></ins>
            <span>${moment(post.createdAt).fromNow()} <i
                class="fa fa-globe"></i></span>

          </div>
    `;
    if (post.photo != undefined || post.video != undefined) {
      // console.log(post.photo, post.photo == "undefined");
      res += `
        <div class="post-meta">
          <!-- Video, Photo -->
          <figure>
            <img src="${post.photo}" alt="">
            <ul class="like-dislike">
              <li><a class="bg-purple" href="#"
                  title="Save to Pin Post"><i
                    class="fa fa-thumb-tack"></i></a>
              </li>
              <li><a class="bg-blue" href="#"
                  title="Like Post"><i
                    class="ti-thumb-up"></i></a>
              </li>
              <li><a class="bg-red" href="#"
                  title="dislike Post"><i
                    class="ti-thumb-down"></i></a>
              </li>
            </ul>
          </figure>
          <!-- Content -->
          <div class="description">
            <a href="#" class="learnmore"
              data-ripple="">Learn
              More</a>
            <p>
              ${post.content}
            </p>
          </div>
          <!-- Info interact -->
          <div class="we-video-info">
            <ul>
              <li>
                <div class="likes heart ${
                  post.likes.indexOf(user.id) != -1 ? "happy" : "broken"
                }"
                  title="Like/Dislike">❤
                  <span>${post.likes.length}</span>
                </div>
              </li>
              <li>
                <span class="comment"
                  title="Comments">
                  <i class="fa fa-commenting"></i>
                  <ins>${post.comments.length}</ins>
                </span>
              </li>

              <li>
                <span>
                  <a class="share-pst" href="#"
                    title="Share">
                    <i
                      class="fa fa-share-alt"></i>
                  </a>
                  <ins>${post.shares.length}</ins>
                </span>
              </li>
            </ul>
            <div class="users-thumb-list">
              ${likedUsersHtml}
            </div>
          </div>
        </div>
      `;
    } else {
      res += `
        <div class="post-meta">
          <!-- Content -->
          <div class="description">
            <p>
              ${post.content}
            </p>
          </div>
          <!-- Hover -->
          <ul class="like-dislike">
            <li><a href="#" title="Save to Pin Post"><i
                  class="fa fa-thumb-tack"></i></a>
            </li>
            <li><a href="#" title="Like Post"><i
                  class="ti-thumb-up"></i></a>
            </li>
            <li><a href="#" title="dislike Post"><i
                  class="ti-thumb-down"></i></a>
            </li>
          </ul>
          <!-- Info interact -->
          <div class="we-video-info">
          <ul>
            <li>
              <div class="likes heart ${
                post.likes.indexOf(user.id) != -1 ? "happy" : "broken"
              }"
                title="Like/Dislike">❤
                <span>${post.likes.length}</span>
              </div>
            </li>
            <li>
              <span class="comment"
                title="Comments">
                <i class="fa fa-commenting"></i>
                <ins>${post.comments.length}</ins>
              </span>
            </li>

            <li>
              <span>
                <a class="share-pst" href="#"
                  title="Share">
                  <i
                    class="fa fa-share-alt"></i>
                </a>
                <ins>${post.shares.length}</ins>
              </span>
            </li>
          </ul>
            <div class="users-thumb-list">
              ${likedUsersHtml}

            </div>
          </div>
        </div>
      `;
    }

    res += `
            <div class="coment-area" style="">
            </div>
          </div>
        </div>
      </div><!-- album post -->
    `;

    return res;
  }
}
