const handleRenderData = async () => {
  // Render posts (Render comments, create comment)
  const postEvent = new PostEvent();
  postEvent.handlePostDetail(post);
};

window.addEventListener("load", (event) => {
  handleRenderData();
});
