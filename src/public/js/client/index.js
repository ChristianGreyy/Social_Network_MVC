const handleRenderData = async () => {
  // Render posts (Render comments, create comment)
  const postEvent = new PostEvent();
  postEvent.handleRenderPost();

  // Create post
  postEvent.handleCreatePost(user.id);

  const userEvent = new UserEvent();
  userEvent.handleRenderOnlineFriend();
};

window.addEventListener("load", (event) => {
  handleRenderData();
});
