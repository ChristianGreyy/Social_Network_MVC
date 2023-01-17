class UserHelper {
  // async solveAddFriend(event, userId) {
  htmlFriendProfileControl() {
    return `
      <li class="friend">
          <a title="" data-toggle="tooltip" data-original-title="Bạn bè">
              <i class="fa fa-user"></i>
          </a>
      </li>
      <li class="add-tofrndlist add-tofrndlist-remove-friend">
          <a href="#" title="" data-toggle="tooltip" data-original-title="Hủy kết bạn">
              <i class="fa fa-trash"></i>
          </a>
      </li>
      <li><a href="#" title="" data-toggle="tooltip" data-original-title="Follow"><i class="fa fa-star"></i></a>
      </li>
      <li><a class="send-mesg" href="#" title="" data-toggle="tooltip" data-original-title="Send Message"><i class="fa fa-comment"></i></a>
      </li>
    `;
  }
  htmlNotFriendProfileControl() {
    return `
      <li class="add-tofrndlist">
        <a href="#" title="" data-toggle="tooltip" data-original-title="Gủi lời mời kết bạn">
            <i class="fa fa-user-plus"></i>
        </a>
      </li>
      <li><a href="#" title="" data-toggle="tooltip" data-original-title="Follow"><i class="fa fa-star"></i></a>
      </li>
      <li><a class="send-mesg" href="#" title="" data-toggle="tooltip" data-original-title="Send Message"><i class="fa fa-comment"></i></a>
      </li>
    `;
  }
  handleErrorToast(heading, text) {
    $.toast({
      heading: heading,
      text: text,
      showHideTransition: "fade",
      icon: "error",
      hideAfter: 7000,
      loaderBg: "#fa6342",
      position: "bottom-right",
    });
  }
  handleSuccessToast(heading, text) {
    $.toast({
      heading: heading,
      text: text,
      showHideTransition: "slide",
      icon: "success",
      loaderBg: "#fa6342",
      position: "bottom-right",
      hideAfter: 3000,
    });
  }
  htmlTimelineFriend(user) {
    return `
    <div class="col-lg-3 col-md-6 col-sm-6">
      <div class="friend-box">
        <figure>
          <img src="${user.background}"
            alt="">
          <span>Followers: ${user.followers.length}</span>
        </figure>
        <div class="frnd-meta">
          <img style="width: 88px; height: 88px;" src="${user.avatar}"
            alt="">
          <div class="frnd-name">
            <a href="/user/${user.slug}" title="">${user.firstName.concat(
      " " + user.lastName
    )}</a>
            <span>${user.address ? user.address : ""}</span>
          </div>
          <ul class="frnd-info">
            <li><span>Friends:</span> ${user.friends.length}
            </li>
            <li><span>Post:</span> 250</li>
            <li><span>Since:</span> December, 2014</li>
          </ul>
          <a class="send-mesg" href="#"
            title="">Message</a>
          <div class="more-opotnz">
            <i class="fa fa-ellipsis-h"></i>
            <ul>
              <li><a href="#" title="">Block</a></li>
              <li><a href="#" title="">UnBlock</a>
              </li>
              <li><a href="#" title="">Mute
                  Notifications</a></li>
              <li><a href="#" title="">hide from
                  friend
                  list</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    `;
  }
  htmlOnlineFriend(friend) {
    return `
      <li>
        <div class="author-thmb">
          <img style="width: 34px; height: 34px;" src="${friend.avatar}" alt="">
          <span class="status f-online"></span>
        </div>
      </li>
    `;
  }
}
