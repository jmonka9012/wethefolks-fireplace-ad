const clickArea = document.querySelector('.creative');

function updateClickTag() {
  const clickTag = window.clickTag || 'https://example.com/landing';

  clickArea.href = clickTag;
}

updateClickTag();

clickArea.addEventListener('click', updateClickTag);
clickArea.addEventListener('auxclick', updateClickTag);
clickArea.addEventListener('contextmenu', updateClickTag);
