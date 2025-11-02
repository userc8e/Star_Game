class Body {
    constructor(x, y, maxSpeed) {
        this.r = undefined;
        this.x = x;
        this.y = y;
        this.clr = undefined;
        this.spawnTime = frameCount;
        this.duration = 15;
        this.vx = random(-maxSpeed, maxSpeed);
        this.vy = random(-maxSpeed, maxSpeed);
        this.maxSpeed = maxSpeed;
    }

    display() {
        ellipseMode(CENTER);
        fill(this.clr.getColor());
        ellipse(this.x, this.y, this.r, this.r);
        //ellipse(this.x, this.y, this.r*1.2, this.r*1.2);
    }

    // determines if a Player touches the object
    touch(p) {
        let pos = p.getPos();
        let px = pos[0];
        let py = pos[1];
        let ps = 30; 
        
        let playerLeft = px;
        let playerRight = px + ps;
        let playerTop = py;
        let playerBottom = py + ps + ps / 4 + 5;

        let bodyLeft = this.x - this.r / 2;
        let bodyRight = this.x + this.r / 2;
        let bodyTop = this.y - this.r / 2;
        let bodyBottom = this.y + this.r / 2;

        return !(playerRight < bodyLeft ||
                playerLeft > bodyRight ||
                playerBottom < bodyTop ||
                playerTop > bodyBottom);
    }

    // bodies are able to have a velocity
    updatePosition() {
        this.x += this.vx;
        this.y += this.vy;
    }

    // bodies disappear after a certain amount of time
    isExpired() {
        return (frameCount - this.spawnTime) > this.duration * 60;
    }

    // determines what will happen when they interact
    interact(p) {
        throw new Error("interact(p) must be implemented by subclass");
    }

    // GETTERS
    getColor() {
        return this.clr;
    }
}