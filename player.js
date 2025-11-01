class Player {
  constructor(keysPressed, keysPressedCode) {
        // starting position
        this.x = width / 10;
        this.y = height / 10;
        this.keysPressed = keysPressed;
        this.keysPressedCode = keysPressedCode;

        // movement variables
        this.w = 20;
        this.h = 70;
        this.s = 30;

        // game functionality variables
        this.points = 0;
        this.hitAsteroid = false;
        this.pauseFrames = 0;
        this.lives = 3; // start w 3 lives
        this.currentEffect = "none";
        this.effectTimer = 0;
        this.invincible = false;
        this.xpMultiplier = 1;
        this.speedMultiplier = 1;

        // color variables
        this.r = 255;
        this.g = 255;
        this.b = 255;
    }

    // VISUAL/MOVEMENT METHODS
    display() {
        ellipseMode(CORNER);
        if (this.hitAsteroid) {
        fill(255, 0, 0); // red when hit
        } else {
        fill(color(this.r, this.g, this.b)); // normal color
        }
        //ellipse(this.x, this.y, this.w, this.h);
        ellipse(this.x + 5, this.y, this.s - 10, this.s - 10);
        rect(this.x, this.y + (this.s - 10), this.s, this.s);
        /*
        let legWidth = this.s / 6;
        let legHeight = this.s / 4;
        rect(this.x + this.s / 6, this.y + this.s + 5, legWidth, legHeight); 
        rect(this.x + this.s - this.s / 6 - legWidth, this.y + this.s + 5, legWidth, legHeight);
        */
    }

    move() {
        // if the player hits an asteroid - the game pauses temporarily
        if (this.pauseFrames > 0) {
        this.pauseFrames--;
        if (this.pauseFrames === 0) {
            this.hitAsteroid = false;
        }
        return; // skip movement
        }

        // vertical movements
        if (this.keysPressed.has('w') || this.keysPressedCode.has(UP_ARROW)) {
        if (this.y - this.h / 2 > 0) {
            this.y -= 3.75;
        }
        }
        if (this.keysPressed.has('s') || this.keysPressedCode.has(DOWN_ARROW)) {
        if (this.y + this.h / 2 < height) {
            this.y += 3.75;
        }
        }

        // horizontal movements
        if (this.keysPressed.has('a') || this.keysPressedCode.has(LEFT_ARROW)) {
        if (this.x > 0) {
            this.x -= 3.75;
        }
        }
        if (this.keysPressed.has('d') || this.keysPressedCode.has(RIGHT_ARROW)) {
        if (this.x < width - this.w) {
            this.x += 3.75;
        }
        }
    }

    // GAME FUNCTIONALITY METHODS
    pause(time) {
        this.hitAsteroid = true;
        this.pauseFrames = time;
        this.loseLife();
        }

        absorbColor(c) {
        this.resetEffect();

        this.r = c.getR();
        this.g = c.getG();
        this.b = c.getB();

        this.currentEffect = c.getEffect();
        this.applyEffect(this.currentEffect);
        }

        // helper function to absorbColor
        applyEffect(effectName) {
        switch (effectName) {
            case "speed":
            this.speedMultiplier *= 3;
            this.effectTimer = 800;
            break;
            case "invincibility":
            this.invincible = true;
            this.effectTimer = 800;
            break;
            case "double XP":
            this.xpMultiplier *= 2;
            this.effectTimer = 1200;
            break;
            case "heal":
            if (this.lives < 3) {
                this.lives++;
            }
            this.effectTimer = 400;
            break;
        }
    }

    // timer for the effect
    timeEffect() {
        if (this.effectTimer > 0) {
            this.effectTimer--;
        } else {
            this.resetEffect();
        }
    }

    // helper function to timeEffect
    resetEffect() {
        this.currentEffect = "none";
        this.r = 255;
        this.g = 255;
        this.b = 255;

        this.invincible = false;
        this.xpMultiplier = 1;
        this.speedMultiplier = 1;
    }

    // GETTERS & SETTERS

    // get position of Player
    getPos() {
        return [this.x, this.y];
    }

    getPoints() {
        return this.points;
    }

    setPoints(i) {
        this.points += i * this.xpMultiplier;
    }

    getW() {
        return this.w;
    }

    getH() {
        return this.h;
    }

    getLives() {
        return this.lives;
    }

    isInvincible() {
        return this.invincible;
    }

    getEffect() {
        return this.currentEffect;
    }

    getEffectTimer() {
        return this.effectTimer;
    }

    getColor() {
        return color(this.r, this.g, this.b);
    }

    loseLife() {
        if (this.lives > 0) {
            this.lives--;
        }
    }

    die() {
        this.lives = 0;
    }
}