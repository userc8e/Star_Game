class Star extends Body {
    constructor(x, y, maxSpeed) {
        super(x, y, maxSpeed);
        this.colors = [
        new StarColor(255, 228, 94, "yellow", "none"),
        new StarColor(255, 115, 236, "pink", "speed"),
        new StarColor(125, 149, 255, "blue", "invincibility"),
        new StarColor(218, 255, 125, "lime", "double XP"),
        new StarColor(222, 78, 123, "red", "heal"),
        ];
        this.clr = this.colors[int(random(this.colors.length))];
        this.r = int(random(5, 60));
        this.points = this.r;
        this.duration = 5;
    }

    getPoints() {
        return int(this.points);
    }

    interact(p) {
        if (this.touch(p)) {
            p.setPoints(int(this.points));
            return true;
        }
        return false;
    }
}