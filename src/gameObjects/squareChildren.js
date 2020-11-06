import GameObject from "./gameObject";

export default class SquareChildren extends GameObject {
    constructor(options) {
      super(options);
      this.size = options.size || 50;
      this.fillColor = options.fillColor || "rgb(255, 255, 255)";
      this.borderThickness = options.borderThickness || 2;
      this.borderColor = options.borderColor || 'rgb(0,0,0)';
    }
  
    render() {
      stroke(this.borderColor);
      strokeWeight(this.borderThickness);
      fill(this.fillColor);
      rect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
    }
  
    mouseIsOver(){
      return (
        mouseX <= this.x + size && mouseX >= this.x &&
        mouseY <= this.y + size && mouseY >= this.y
      );
    }
  
    follow(){
      this.position.x = mouseX;
      this.position.y = mouseY;
    }
  
    update(){
  
    }
    
  }
  