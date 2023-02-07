const handleRenderData = async () => {
  const messageEvent = new MessageEvent();
  messageEvent.handleRenderMessage();
  messageEvent.handleRenderMessagerMessage();
  messageEvent.handleSubmitMessage(messenger);
};

window.addEventListener("load", (event) => {
  handleRenderData();
});
