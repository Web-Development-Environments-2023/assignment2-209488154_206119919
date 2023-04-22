
function WelcomeState() {

}

WelcomeState.prototype.enter = function(game) {
    game.sounds = new Sounds();
    game.sounds.init();
    game.sounds.loadSound('shoot', 'sounds/SUIII.wav');
    game.sounds.loadSound('enemyShoot', 'sounds/burf.wav');
    game.sounds.loadSound('bang', 'sounds/enemyEat.wav');
    game.sounds.loadSound('explosion', 'sounds/awww-why.wav');
    game.sounds.loadSound('flipflop', 'sounds/flipflop.wav');
    game.sounds.loadSound('click', 'sounds/click.wav');
    game.sounds.loadSound('lose', 'sounds/lose.wav');
    game.sounds.loadSound('pause', 'sounds/excuse_me.wav');
};

WelcomeState.prototype.update = function (game, dt) {

};

WelcomeState.prototype.draw = function(game, dt, ctx) {

    ctx.clearRect(0, 0, game.width, game.height);
    
    var $menu = $('.Menu'),
    $item = $('.menu-item'),
    w = $(window).width(),
    h = $(window).height();

    $(window).on('mousemove', function(e) {
    var offsetX = 0.5 - e.pageX / w,
        offsetY = 0.5 - e.pageY / h,
        dy = e.pageY - h / 2,
        dx = e.pageX - w / 2,
        theta = Math.atan2(dy, dx),
        angle = theta * 180 / Math.PI - 90,
        offsetPoster = $menu.data('offset'),
        transformPoster = 'translate3d(0, ' + -offsetX * offsetPoster + 'px, 0) rotateX(' + (-offsetY * offsetPoster) + 'deg) rotateY(' + (offsetX * (offsetPoster * 2)) + 'deg)';

    if (angle < 0) {
        angle = angle + 360;
    }

    $menu.css('transform', transformPoster);

    $item.each(function() {
        var $this = $(this),
            offsetLayer = $this.data('offset') || 0,
            transformLayer = 'translate3d(' + offsetX * offsetLayer + 'px, ' + offsetY * offsetLayer + 'px, 20px)';

        $this.css('transform', transformLayer);
    });
    });

};