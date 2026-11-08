const reloadButton = document.querySelector('#reload');
const frames = document.querySelectorAll('iframe');

reloadButton.addEventListener('click', () => {
  for (const frame of frames) {
    frame.contentWindow.location.reload();
  }
});
