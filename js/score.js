
function go(rank, score) {
    var duration = 1000;
    var start = null;
    var gameScoreContainer = document.getElementById("game-score-container");
    var startY = gameScoreContainer.getBoundingClientRect().bottom;
    var endY = startY - 250;
    var fps = 80;
    var currentY = startY;
    var incrementY = (endY - startY) / (duration / 1000 * fps);
    if(rank){
        var scoreEl = document.createElement('div');
        scoreEl.innerHTML = "+" + rank;
        scoreEl.classList.add('score-animation');
        document.body.appendChild(scoreEl);
    }

    $({ score }).animate({ score: score + rank }, {
        duration,
        easing: "linear",
        step: function (now, fx) {
            $("#score").html(score + rank); 
        },
        queue: false,
        complete: function () {      
            if (scoreEl instanceof Node) {      
                document.body.removeChild(scoreEl);
            }
        }
    });
    
    function animate(timestamp) {
        if(rank){
            if (!start) start = timestamp;
            var progress = timestamp - start;
        
            currentY += incrementY;
            scoreEl.style.top = currentY + "px";
        
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
    }

    requestAnimationFrame(animate);

    return score + rank;
}
