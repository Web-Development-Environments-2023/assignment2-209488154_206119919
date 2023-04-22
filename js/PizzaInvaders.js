var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_SPACE = 32;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_P = 80;

function Player(x, y, width, height, photo) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.photo = photo;
}

function PlayerBullet(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}

function InvaderBullet(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}

function Invader(x, y, rank, file, invaderWidth, invaderHeight, type, photo) {
    this.x = x;
    this.y = y;
    this.rank = (20 - (rank * 5));
    this.file = file;
    this.type = type;
    this.width = invaderWidth;
    this.height = invaderHeight;
    this.photo = photo;
}