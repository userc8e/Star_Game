class StarColor {
    constructor(r, g, b, name, effect) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.name = name;
        this.effect = effect;
    }

    getColor() {
        return color(this.r, this.g, this.b);
    }

    isYellow() {
        return this.r === 255 && this.g === 255 && this.b === 0;
    }

    getR() {
        return this.r;
    }

    getG() {
        return this.g;
    }

    getB() {
        return this.b;
    }

    getColorName() {
        return this.name;
    }

    getEffect() {
        return this.effect;
    }
}