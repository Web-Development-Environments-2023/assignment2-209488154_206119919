var keyChoices = {
    spaceKey: 32,
    leftKey: 37,
    upKey: 38,
    rightKey: 39,
    downKey: 40,
    pKey: 80
};

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

function Invader(x, y, rank, col, invaderWidth, invaderHeight, type, photo) {
    this.x = x;
    this.y = y;
    this.row = rank;
    this.col = col;
    this.rank = (20 - (rank * 5));
    this.type = type;
    this.width = invaderWidth;
    this.height = invaderHeight;
    this.photo = photo;
}