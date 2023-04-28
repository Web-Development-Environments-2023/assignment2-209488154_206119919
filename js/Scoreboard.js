function showScoreboard(game) {
    generateScoreHtml(game);
    showStatus(game);
    game.state = "gameover";
    clearInterval(speedUpIntervalId);
    game.stop();
    setVisibility('scoreboard-container', 'flex');
    setVisibility('game-score-container', 'none');
    setVisibility('return', 'block');
    hideHealthBar();
};

function generateScoreHtml(game) {
    var scoreboardList = document.getElementById("scoreboard-list");
    currentPlayer.records.forEach(function (score, index) {
        var newRow = document.createElement('li');
        newRow.classList.add('score-list-item');
        newRow.innerHTML = `
        <div class="record">
            <div class="flag place transparent-background">${index + 1}</div>
                <div class="scoreboard-username">
                    <div class="scoreboard-username-title">${score.username}</div>
                </div>
                <div class="right-text scoreboard-points">
                <div class="margin-top-8">
                    <strong>${score.points}</strong>
                </div>
            </div>
        </div>
        `;
        
        if (index == 0) {
            newRow.querySelector('.place').classList.add('dark-text');
            newRow.querySelector('.place').classList.add('yellow-background');
            newRow.querySelector('.scoreboard-points').classList.add('yellow-text');
        } else if (index == 1) {
            newRow.querySelector('.place').classList.add('dark-text');
            newRow.querySelector('.place').classList.add('teal-background');
            newRow.querySelector('.scoreboard-points').classList.add('teal-text');
        } else if (index == 2) {
            newRow.querySelector('.place').classList.add('dark-text');
            newRow.querySelector('.place').classList.add('orange-background');
            newRow.querySelector('.scoreboard-points').classList.add('orange-text');
        }
        
        scoreboardList.appendChild(newRow);
    });
}

function showStatus(game){
    var statusesElements = document.querySelectorAll('.neon');
    var statusResult = getStatusByScore(game.score, game.didWin, game.didLose);

    statusesElements[statusResult].style.display = 'inline';
};

function getStatusByScore(score, didWin, didLose) {
    var statuses = {
        winner: 0,
        lost: 1,
        better: 2,
        champion: 3
    };

    if (didLose)
        return statuses.lost;
    
    if (didWin)
        return statuses.champion;
    
    return score < 100 ? statuses.better : statuses.winner;
}
