var signupMenuOption = document.getElementById("signup-menu-option")
var loginMenuOption = document.getElementById("login-menu-option")
var aboutMenuOption = document.getElementById("about-menu-option")

function hideMenu() {
    setVisibility('menu', 'none');
    setVisibility('header', 'none');
};

function onSignupMenuOption() {
    hideMenu();
    setVisibility('signup', 'block');
};

function onLoginMenuOption() {
    hideMenu();
    setVisibility('login', 'block');
};

function onAboutMenuOption() {
    onAboutOpen();
};

signupMenuOption.addEventListener("click", onSignupMenuOption);
loginMenuOption.addEventListener("click", onLoginMenuOption);
aboutMenuOption.addEventListener("click", onAboutMenuOption);