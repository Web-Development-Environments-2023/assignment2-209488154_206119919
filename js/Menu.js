var signupMenuOption = document.getElementById("signup-menu-option")
var loginMenuOption = document.getElementById("login-menu-option")
var aboutMenuOption = document.getElementById("about-menu-option")

function hideMenu() {
    setVisibility('menu', 'none');
    setVisibility('header', 'none');
};

function onSignupMenuOption() {
    hideMenu();
    game.state = "signup";
    setVisibility('signup', 'block');
    setVisibility('return', 'block');
};

function onLoginMenuOption() {
    hideMenu();
    game.state = "login";
    setVisibility('login', 'block');
    setVisibility('return', 'block');
};

function onAboutMenuOption() {
    onAboutOpen();
};

signupMenuOption.addEventListener("click", onSignupMenuOption);
loginMenuOption.addEventListener("click", onLoginMenuOption);
aboutMenuOption.addEventListener("click", onAboutMenuOption);