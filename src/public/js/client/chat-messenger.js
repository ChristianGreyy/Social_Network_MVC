const handleRenderData = async () => {
  const messageEvent = new MessageEvent();
  messageEvent.handleRenderMessage();
  messageEvent.handleRenderMessagerMessage();
  messageEvent.handleSubmitMessage();
};

window.addEventListener("load", (event) => {
  handleRenderData();
});
