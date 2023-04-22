var overlay = document.getElementById("overlay");
var closeAboutButton = document.getElementById("close-about-button");

function onAboutOpen() {
  setVisibility('about', 'block');
  setVisibility('overlay', 'block');
};

function onAboutClose() {
  setVisibility('about', 'none');
  setVisibility('overlay', 'none');
};

closeAboutButton.addEventListener("click", onAboutClose);
  
window.onclick = function(event) {
  if (event.target == overlay) {
    onAboutClose();
  }
}

window.addEventListener("keydown", function(event) {
  if (event.keyCode === 27) {
    onAboutClose();
  }
});