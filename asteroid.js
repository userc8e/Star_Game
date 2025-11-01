class Asteroid extends Body {
    constructor(x, y, maxSpeed, rUpperBound) {
        super(x, y, maxSpeed);
        this.clr = new StarColor(107, 108, 112, "grey", "none");
        this.r = int(random(80, rUpperBound));
        this.points = -this.r;
        this.duration = int(random(20, 40)); //asteroids last for a random amount of time
    }

    getPoints() {
        return this.points;
    }

    interact(p) {
        if (this.touch(p) && (!p.isInvincible())) {
        p.setPoints(int(this.points));
        p.pause(15);
        return true;
        }
        return false;
    }
}