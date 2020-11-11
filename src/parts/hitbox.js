class Hitbox {
    constructor(options){
        this._x;
        this._y;
        this.xOffset = options.xOffset;
        this.yOffset = options.yOffset;
        this.tag = options.tag || null;
    }
}

class SquareHitbox extends Hitbox {
    constructor(options){
        super(options);
        this.width = options.width;
        this.height = options.height;
    }
}

class CircleHitbox extends Hitbox {
    constructor(options){
        super(options);
        this.radius = options.radius || 1;
    }
}

export default {
    Circle: CircleHitbox,
    Square: SquareHitbox,
}