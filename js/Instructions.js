
var overlay = document.getElementById("overlay");
var closeInstructionButton = document.getElementById("close-instruction-button");

function onInstructionOpen() {
  setVisibility('about', 'none');
  setVisibility('instruction', 'block');
  setVisibility('overlay', 'block');
};

function onInstructionClose() {
  setVisibility('instruction', 'none');
  setVisibility('overlay', 'none');
};

closeInstructionButton.addEventListener("click", onInstructionClose);
  
window.onclick = function(event) {
  if (event.target == overlay) {
    onInstructionClose();
    onAboutClose();
  }
}

window.addEventListener("keydown", function(event) {
  if (event.keyCode === 27) {
    onInstructionClose();
  }
});