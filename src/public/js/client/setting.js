const handleRenderData = async () => {
  // Render posts (Render comments, create comment)
  const userEvent = new UserEvent();
  userEvent.handleUpdateUser();
};

window.addEventListener("load", (event) => {
  handleRenderData();
});
