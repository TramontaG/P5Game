import Hitbox from './../parts/hitbox';
import CollisionHandler from './../util/ColisionHandler';
import { drawArrow } from './../util/Shapes';

export default class GameObject {
	constructor(options = {}) {
		//identification related properties
		this.tag = options.tag || null;
		this._privateId = Game.utils.IdGenerator.getUniqueID(10);
		this.publicId = options.publicId || null;

		//measure related properties
		this.width = options.width || 1;
		this.height = options.height || 1;

		//movement related properties
		this.position = options.position || new p5.Vector(0,0);
		this._lastPos = this.position;
		this.velocity = options.velocity || new p5.Vector(0,0);
		this.accel = options.accel || new p5.Vector(0,0);
		this.mass = options.mass || 1;
		this.gravity = options.gravity ? new p5.vector(0, (options.gravity * 0.1)) : new p5.Vector(0, 0.1);
		this.canvasFriction = options.canvasFriction || 0;
		this.bounceCoeficient = options.bounceCoeficient || 0;
		this.airDrag = options.airDrag || 0;

		//environment interaction related properties
		this.canDrag = options.canDrag || false;
		this.canBounceCanvas = options.canBounceCanvas || false;
		this.hasGravity = options.hasGravity || false;
		this.canThrow = options.canThrow || false;
		this.hasRigidBody = options.hasRigidBody || false;

		this._dragging = false;

		this.hide = options.hide || false;
		this.active = options.active || true;

		this.hitboxes = options.hitboxes || [
			new Hitbox.Square({
				xOffset: 0,
				yOffset: 0,
				width: this.width,
				height: this.height,
				tag: null,
			})
		];

		//event handlers
		this.messageHandler = {};
		this.collisionHandler = {};
		this.keyHandler = {};

		this.children = [];

		this.debug = options.debug || {
			hitboxes: false,
			position: false,
		};
	}

	_protoPreLoad() {
		this.preLoad();
	}

	preLoad() { }

	_compute() {
		if (!this.active) return;
		if (!this.hide)this.render();
		this._lastPos = this.position.copy();
		if (!this._dragging) {
			this.checkCollision();
			if (this.hasGravity) this.applyForce(p5.Vector.mult(this.gravity, this.mass));
			if (this.canBounceCanvas) this._checkCanvasCollision();
		}
		if (this.debug.hitboxes) this.renderHitboxes();
		if (this.debug.position) this.renderPosition();
		if (this.debug.vectors) this.renderVectors();

		for (let child of this.children) {
			child.compute();
		}
	}

	//rendering routines
	render() { }

	renderHitboxes() {
		for (let hitbox of this.hitboxes) {
			fill('rgba(255,0,255,.5)');
			if (hitbox instanceof Hitbox.Square) rect  (this.position.x + hitbox.xOffset, this.position.y + hitbox.yOffset, hitbox.width, hitbox.height);
			if (hitbox instanceof Hitbox.Circle) circle(this.position.x + hitbox.xOffset, this.position.y + hitbox.yOffset, hitbox.radius * 2);
		}
	}

	renderPosition() {
		stroke(0);
		circle(this.position.x, this.position.y, 5);
	}

	renderVectors() {
		if (this.velocity.mag() > 0.1) 	drawArrow(this.position, this.velocity, 'red', 7);
		if (this.accel.mag() > 0.01)	drawArrow(this.position, this.accel, 'green', 280);
	}

	renderChildren() {
		Object.values(this.children).map(children => children.render());
	}

	update() { }

	//movement routines
	applyForce(vector){
		this.accel.add(p5.Vector.div(vector, this.mass));
		if (this.debug.vectors) drawArrow(this.position, vector, 'blue', 70);
	}

	checkCollision() {
		//template for getting hitboxes margins
		for (let scene of Game.loadedScenes) {
			for (let target of Object.values(scene.gameObjects)) {
				if (this._privateId != target._privateId) CollisionHandler.checkCollision(this, target);
			}
		}
	}

	_move() {
		if (this._dragging) return;
		this.velocity.add(this.accel);
		this.position.add(this.velocity);
		this.accel = new p5.Vector(0,0);
		if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
		if (Math.abs(this.velocity.y) < 0.1) this.velocity.y = 0;
	}

	_checkCanvasCollision() {
		//object is to the left of canvas
		if (this.position.x - this.width / 2 <= 0) this._collideWithCanvas({ 
			edge: 'left', 
			isSliding: Math.abs(this.velocity.x) < 1.2, 
		})

		//object is to the right of canvas
		else if (this.position.x + this.width / 2 >= windowWidth) this._collideWithCanvas({
			edge: 'right',
			isSliding: Math.abs(this.velocity.x) < 1.2,
		})

		//object is above canvas
		if (this.position.y - this.height / 2 <= 0) this._collideWithCanvas({
			edge: 'top',
			isSliding: Math.abs(this.velocity.y) < 1.2,
		})

		//object is below canvas
		else if (this.position.y + this.height / 2 >= windowHeight) this._collideWithCanvas({
			edge: 'bottom',
			isSliding: Math.abs(this.velocity.y) < 1.2,
		})
	}

	_collideWithCanvas = info => {
		const friction = {
			top: 	new p5.Vector(Math.sign(this.velocity.x) * this.canvasFriction * -1, 0),
			bottom: new p5.Vector(Math.sign(this.velocity.x) * this.canvasFriction * -1, 0),
			left: 	new p5.Vector(0, Math.sign(this.velocity.y) * this.canvasFriction * -1),
			right: 	new p5.Vector(0, Math.sign(this.velocity.y) * this.canvasFriction * -1),
		}
		const bounce = {
			top: 	new p5.Vector(this.velocity.x, Math.abs(this.velocity.y) * this.bounceCoeficient),
			bottom: new p5.Vector(this.velocity.x, Math.abs(this.velocity.y) * -1 * this.bounceCoeficient),
			left: 	new p5.Vector(Math.abs(this.velocity.x) * this.bounceCoeficient, this.velocity.y),
			right: 	new p5.Vector(Math.abs(this.velocity.x) * -1 * this.bounceCoeficient, this.velocity.y),
		}
		const snap = {
			top: 	() => this.position.y = this.height / 2,
			bottom: () => this.position.y = windowHeight - this.height / 2,
			left: 	() => this.position.x = this.width / 2,
			right: 	() => this.position.x = windowWidth - this.width / 2
		}
		
		const stopBounce = {
			vertical: () => this.velocity.y = 0,
			horizontal: () => this.velocity.x = 0,
		}

		if (this.canBounceCanvas) {
			snap[info.edge]();
			if (this.canvasFriction > 0 && this.velocity.mag() > 0) {
				this.applyForce(friction[info.edge]);
			}
			this.velocity = bounce[info.edge];
			//this is just to counter the fact that the gravity is applied on the frame that the object is on the canvas floor
			//causing it to clip inside the canvas and lose a net height over time, even if the bounce coeficient is 1;
			if (info.edge == 'bottom') this.applyForce(p5.Vector.mult(this.gravity, this.mass).mult(-1));


			if (this.collisionHandler.hasOwnProperty('any') 	&& !info.isSliding) this.collisionHandler.any();
			if (this.collisionHandler.hasOwnProperty('canvas') 	&& !info.isSliding) this.collisionHandler.canvas(info.edge);

			if (Math.abs(this.velocity.x) < 0.1) stopBounce.horizontal();
			if (Math.abs(this.velocity.y) < 0.75) stopBounce.vertical();
			this.onBouncedCanvas(info.edge);
		}
	}

	//event routines
	onBouncedCanvas() {	}

	protoOnClick() {
		if (this.dragging) {
			this.dragging = false;
			return;
		}
		if (this.mouseIsOver()) {
			this.onClickMe();
		}
		else this.onClickOusideMe();
	}

	onClickMe() { }

	onClickOusideMe() { }

	protoMouseDragged() {
		if ((this.canDrag && this.mouseIsOver())|| this._dragging) {
			if (this.mouseIsOver()) this._dragging = true;
			this.position = new p5.Vector(mouseX, mouseY);
			this.accel = new p5.Vector(0,0);

			//making sure you can't drag the object outside the screen
			if (this.position.y + this.height / 2 > windowHeight) this.position.y = windowHeight - this.height / 2
			if (this.position.y - this.height / 2 < 0) this.position.y = 0 + this.height / 2
			if (this.position.x + this.width / 2 > windowWidth) this.position.x = windowWidth - this.width / 2
			if (this.position.x - this.width / 2 < 0) this.position.x = 0 + this.width / 2
		}
		else this.onMouseDragged();
	}

	onMouseDragged() { };

	protoMousePressed() {
		if (this.canThrow && this.canDrag && this.mouseIsOver()) {
			this.accel = new p5.Vector(0,0);
			this.velocity = new p5.Vector(0,0);
			this._dragging = true;
		}
		this.onMousePressed();
	}
	onMousePressed() { }

	protoMouseReleased() {
		if (this._dragging) {
			this.velocity = p5.Vector.sub(this.position, this._lastPos).mult(2).copy();
			this._dragging = false;
		}
		this.onMouseReleased();
	}
	onMouseReleased() { }

	mouseIsOver() {
		return (
			mouseX >= this.position.x - (this.width / 2) && mouseX <= this.position.x + (this.width / 2) &&
			mouseY >= this.position.y - (this.height / 2) && mouseY <= this.position.y + (this.height / 2)
		);
	}
}