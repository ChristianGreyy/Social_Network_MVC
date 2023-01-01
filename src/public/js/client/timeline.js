const handleRenderData = async () => {
  // Render posts (Render comments, create comment)
  const postEvent = new PostEvent();
  postEvent.handleRenderPost(remoteUser);

  // Create post
  postEvent.handleCreatePost(user.id);
};

window.addEventListener("load", (event) => {
  handleRenderData();
});
