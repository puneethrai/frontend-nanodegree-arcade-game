// Enemies our player must avoid
var Enemy = function (x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var randomRate = Resources.getRandomInt(0, 101 / 2);
    this.x = this.x + randomRate * dt * Math.pow(2, this.y / 63) >= 505 ? 0 : this.x + randomRate * dt * Math.pow(2, this.y / 63);
    if (this.x === 0) {
        this.y = this.y / 63 >= 3 ? 63 : this.y + 63;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Enemy.prototype.getCurrentPos = function () {
    this.boxX = Math.round(this.x / 101);
    this.boxY = this.y / 63;
    return [this.boxX, this.boxY];
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var rows = 3; rows >= 1; rows--) {
    allEnemies.push(new Enemy(0, rows * 83 - 20));
};
var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.reset(true);
}
// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function () {
    if (this.y === 0) {
        //player won
        this.reset();
    }
}
Player.prototype.getCurrentPos = function () {
    this.boxX = Math.round(this.x / 101);
    this.boxY = Math.round(this.y / 83);
    return [this.boxX, this.boxY];
}
Player.prototype.reset = function (fresh) {
    if (!fresh) {
        if (this.getCurrentPos()[1] === 0) {
            Resources.playerWon++;
        } else {
            Resources.playerLost++;
        }
    }
    this.x = 101 * 2;
    this.y = (606 - 171);
    if (document.getElementById("WON")) {
        document.getElementById("WON").innerHTML = Resources.playerWon;
        document.getElementById("LOST").innerHTML = Resources.playerLost;
    }
}
// Draw the enemy on the screen, required method for game
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function (key) {
    switch (key) {
    case 'left':
        this.x = this.x - 101 <= 0 ? 0 : this.x - 101;
        break;
    case 'up':
        this.y = this.y - 83 <= 0 ? 0 : this.y - 83;
        break;
    case 'right':
        this.x = this.x + 101 >= 505 ? (505 - 101) : this.x + 101;
        break;
    case 'down':
        this.y = this.y + 83 + 171 >= 606 ? (606 - 171) : this.y + 83;
        break;
    }
}
var player = new Player();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart = "MSPointerDown";
    this.eventTouchmove = "MSPointerMove";
    this.eventTouchend = "MSPointerUp";
} else {
    this.eventTouchstart = "touchstart";
    this.eventTouchmove = "touchmove";
    this.eventTouchend = "touchend";
}
window.onload = function() {
// Respond to swipe events
var touchStartClientX, touchStartClientY;
var gameContainer = document.getElementsByTagName("canvas")[0];

gameContainer.addEventListener(this.eventTouchstart, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches > 1 ||
        targetIsInput(event)) {
        return; // Ignore if touching with more than 1 finger or touching input
    }

    if (window.navigator.msPointerEnabled) {
        touchStartClientX = event.pageX;
        touchStartClientY = event.pageY;
    } else {
        touchStartClientX = event.touches[0].clientX;
        touchStartClientY = event.touches[0].clientY;
    }

    event.preventDefault();
});

gameContainer.addEventListener(this.eventTouchmove, function (event) {
    event.preventDefault();
});

gameContainer.addEventListener(this.eventTouchend, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        event.targetTouches > 0 ||
        targetIsInput(event)) {
        return; // Ignore if still touching with one or more fingers or input
    }

    var touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
        touchEndClientX = event.pageX;
        touchEndClientY = event.pageY;
    } else {
        touchEndClientX = event.changedTouches[0].clientX;
        touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
        // (right : left) : (down : up)
       player.handleInput( absDx > absDy ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    }
});
var targetIsInput = function (event) {
    return event.target.tagName.toLowerCase() === "input";
};
}