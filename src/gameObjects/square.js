import GameObject from "./gameObject";
import SquareChildren from './squareChildren'

export default class Square extends GameObject {
  constructor(options) {
    super(options);
    this.fillColor = options.fillColor || "rgb(255, 255, 255)";
    this.borderThickness = options.borderThickness || 2;
    this.borderColor = options.borderColor || 'rgb(0,0,0)';
    this.name = options.name;
    this.canDrag = true;
		this.canBounceCanvas = true;
		this.hasGravity = true;
    this.canThrow = true;
    this.hasRigidBody = true;
  }

  render() {
    stroke(this.borderColor);
    strokeWeight(this.borderThickness);
    fill(this.fillColor);
    rect(this.position.x, this.position.y, this.width, this.height);
  }


  update(){
    if (this.mouseIsOver()){
      this.fillColor = 'rgba(0,0,0,.5)';
    } else {
      this.fillColor = 'rgb(255,255,255)';
    }
  }

}
