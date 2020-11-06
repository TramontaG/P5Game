export default class GameObject {
	constructor(options = {}) {
		this.position = options.position || { x: 0, y: 0 };
		this.velocity = options.velocity || { x: 0, y: 0 };
		this.nextVelocity = this.velocity;
		this.width = options.width || options.size || 0;
		this.height = options.height || options.size || 0;
		this.size = this.width + this.height / 2;
		this.mass = options.mass || 1;

		this.accel = options.accel || { x: 0, y: 0 };		
		this.tag = options.tag || null;
		this.privateId = Game.utils.IdGenerator.getUniqueID(15);
		this.id = options.id || this.privateId;

		this.canDrag = options.canDrag || false;
		this.canBounceCanvas = options.canBounceCanvas || false;
		this.bounceCoeficient = options.bounceCoeficient || 0;
		this.dragging = false;
		this.hasGravity = options.hasGravity || false;
		this.gravity = options.gravity || 1;
		if (this.hasGravity) this.accel.y = this.gravity * 0.1;
		this.canvasFriction = options.canvasFriction || 0;
		this.airDrag = options.airDrag || 0;
		this.lastPos = this.position;
		this.canThrow = options.canThrow || false;

		this.hide = options.hide || false;
		this.active = options.active || true;

		this.hasRigidBody = options.hasRigidBody || false;
		this.hitboxes = options.hitboxes || [{
			xOffset: 0,
			yOffset: 0,
			width: this.width,
			height: this.height,
			tag: null,
		}];

		this.collisionHandler = {};

		this.debug = options.debug || {
			hitboxes: false,
			position: false,
		};

		this.children = [];
		this.messageHandler = {};	
	}

	protoPreLoad(){
		this.preLoad();
	}

	preLoad() {}

	compute() {
		if (!this.active) return;
		this.checkCollision();
		this.checkCanvasCollision();
		this.update();

		this.lastPos = this.position;

		if (!this.hide){
			this.render();
			if (this.debug.hitboxes) this.renderHitboxes();
			if (this.debug.position) this.renderPosition();
		}

		for (let child of this.children){
			child.run();
		}

	}

	render() { }

	
	renderHitboxes() {
		for (let hitbox of this.hitboxes){
			fill('rgba(255,0,255,.5)');
			rect(this.position.x + hitbox.xOffset, this.position.y + hitbox.yOffset, hitbox.width, hitbox.height);
		}
	}
	
	renderPosition(){
		stroke(0);
		circle(this.position.x, this.position.y, 5);
	}

	checkCollision() {
		for (let target of Object.values(Game.currentScene.gameObjects)){
			for (let selfHitbox of this.hitboxes){
				for (let targetHitbox of target.hitboxes){
					if (target.privateId != this.privateId) {
						const selfRightMargin 	= this.position.x + selfHitbox.xOffset + selfHitbox.width / 2;
						const selfLeftMargin 	= this.position.x - selfHitbox.xOffset - selfHitbox.width / 2;
						const selfBottomMargin 	= this.position.y + selfHitbox.yOffset + selfHitbox.height / 2;
						const selfTopMargin 	= this.position.y - selfHitbox.yOffset - selfHitbox.height / 2;

						const targetRightMargin 	= target.position.x + targetHitbox.xOffset + targetHitbox.width / 2;
						const targetLeftMargin 		= target.position.x - targetHitbox.xOffset - targetHitbox.width / 2;
						const targetBottomMargin 	= target.position.y + targetHitbox.yOffset + targetHitbox.height / 2;
						const targetTopMargin 		= target.position.y - targetHitbox.yOffset - targetHitbox.height / 2;

						const horizontalOverlapping = selfRightMargin >= targetLeftMargin && targetRightMargin >= selfLeftMargin; 
						const verticalOverlapping	= selfBottomMargin >= targetTopMargin && targetBottomMargin >= selfTopMargin; 

						if(horizontalOverlapping && verticalOverlapping){
							const collisionTan = (target.position.y - this.position.y) * -1 / (target.position.x - this.position.x);
							let collisionAngle = atan(collisionTan) * 180 / Math.PI;
							if (this.position.x < target.position.x) collisionAngle += 180;
							if (this.position.x > target.position.x && this.position.y > target.position.y) collisionAngle += 360;

							const verticalCollision = Math.floor((collisionAngle - 45) / 90) % 2 == 0;

							if (verticalCollision && this.position.y < target.position.y) 	this.position.y = targetTopMargin - selfHitbox.height / 2 - selfHitbox.yOffset; 
							if (verticalCollision && this.position.y > target.position.y) 	this.position.y = targetBottomMargin + selfHitbox.height / 2 + selfHitbox.yOffset; 
							if (!verticalCollision && this.position.x > target.position.x) 	this.position.x = targetRightMargin + selfHitbox.width / 2 + selfHitbox.xOffset; 
							if (!verticalCollision && this.position.x < target.position.x) 	this.position.x = targetLeftMargin - selfHitbox.width / 2 - selfHitbox.xOffset; 


							if (this.collisionHandler.hasOwnProperty('all')) 		this.collisionHandler.all(collisionAngle);
							if (this.collisionHandler.hasOwnProperty(target.tag))	this.collisionHandler[target.tag](collisionAngle);
							if (this.hasRigidBody && target.hasRigidBody) 			this.bounceAround(verticalCollision, target);
						}
					}
				}
			}
		}
	}

	move() {
		if (this.dragging) return;

		this.velocity = this.nextVelocity;

		if (this.position.y < windowHeight && this.hasGravity) this.accel.y = this.gravity * 0.1;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.nextVelocity.x += this.accel.x;
		this.nextVelocity.y += this.accel.y;

		if (this.airDrag) {
			this.nextVelocity.x -= this.airDrag * 0.1 * Math.sign(this.velocity.x);
			this.nextVelocity.y -= this.airDrag * 0.1 * Math.sign(this.velocity.y);
		}
	}

	bounceAround(verticalCollision, target) {
		const firstFactor 	= (this.mass - target.mass) / (this.mass + target.mass);
		const secondFactor 	= (2 * target.mass) / (this.mass + target.mass);

		const xNewVelocity = firstFactor * this.velocity.x + secondFactor * target.velocity.x;
		const yNewVelocity = firstFactor * this.velocity.y * - 1 + secondFactor * target.velocity.y * -1;

		if (verticalCollision) 	this.nextVelocity.y = yNewVelocity * this.bounceCoeficient;
		else 					this.nextVelocity.x = xNewVelocity * this.bounceCoeficient;
	}

	update() { }

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
		if (this.canDrag && this.mouseIsOver()) {
			this.dragging = true;
			this.position = {
				x: mouseX,
				y: mouseY,
			}

			//making sure you can't drag the object outside the screen
			if (this.position.y + this.height / 2 > windowHeight) 	this.position.y = windowHeight - this.height / 2
			if (this.position.y - this.height / 2 < 0) 				this.position.y = 0 + this.height / 2
			if (this.position.x + this.width / 2 > windowWidth) 	this.position.x = windowWidth - this.width / 2
			if (this.position.x - this.width / 2 < 0) 				this.position.x = 0 + this.width / 2
		}
		else this.onMouseDragged();
	}
	onMouseDragged() { };

	protoMousePressed() {
		if (this.canThrow && this.canDrag && this.mouseIsOver()) {
			this.accel = { x: 0, y: 0};
			this.velocity = {x: 0, y: 0};
			this.dragging = true;
		}
		this.onMousePressed();
	}
	onMousePressed() { }

	protoMouseReleased() {
		if (this.canThrow && this.canDrag && this.mouseIsOver()) {
			this.accel = { x: 0, y: this.hasGravity ? this.gravity * 0.1 : 0 };
			this.nextVelocity.x = (this.position.x - this.lastPos.x) * 2;
			this.nextVelocity.y = (this.position.y - this.lastPos.y) * 2;
			this.dragging = false;
		}
		this.onMouseReleased();
	}
	onMouseReleased() {}

	mouseIsOver() {
		return (
			mouseX >= this.position.x - (this.width / 2) && mouseX <= this.position.x + (this.width / 2) &&
			mouseY >= this.position.y - (this.height / 2) && mouseY <= this.position.y + (this.height / 2)
		);
	}

	checkCanvasCollision() {
		if (this.position.x - this.width / 2 <= 0) {
			//object is to the left of canvas
			this.touchingCanvas({
				edge: 'left',
				isSliding: Math.abs(this.velocity.x) < 1.2,
			})
		}

		else if (this.position.x + this.width / 2 >= windowWidth) {
			//object is to the right of canvas
			this.touchingCanvas({
				edge: 'right',
				isSliding: Math.abs(this.velocity.x) < 1.2,
			})
		}

		if (this.position.y - this.height / 2 <= 0) {
			//object is above canvas
			this.touchingCanvas({
				edge: 'top',
				isSliding: Math.abs(this.velocity.y) < 1.2,
			})

		}

		else if (this.position.y + this.height / 2 >= windowHeight) {
			//object is below canvas
			this.touchingCanvas({
				edge: 'bottom',
				isSliding: Math.abs(this.velocity.y) < 1.2,
			})
		}
	}

	touchingCanvas = info =>{
		const friction = {
			top: 	() => this.velocity.x -= (1 / this.canvasFriction) * 0.1 * Math.sign(this.velocity.x),
			bottom: () => this.velocity.x -= (1 / this.canvasFriction) * 0.1 * Math.sign(this.velocity.x),
			left:	() => this.velocity.y -= (1 / this.canvasFriction) * 0.1 * Math.sign(this.velocity.y),
			right:	() => this.velocity.y -= (1 / this.canvasFriction) * 0.1 * Math.sign(this.velocity.y),		
		}
		const bounce = {
			top:	() => this.velocity.y = this.bounceCoeficient * Math.abs(this.velocity.y),
			bottom:	() => this.velocity.y = this.bounceCoeficient * Math.abs(this.velocity.y) * -1,
			left: 	() => this.velocity.x = this.bounceCoeficient * Math.abs(this.velocity.x),
			right: 	() => this.velocity.x = this.bounceCoeficient * Math.abs(this.velocity.x) * -1,
		}
		const snap = {
			top:	() => this.position.y = this.height / 2,
			bottom:	() => this.position.y = windowHeight - this.height / 2,
			left: 	() => this.position.x = this.width / 2,
			right: 	() => this.position.x = windowWidth - this.width / 2
		}
		const stopBounce = {
			vertical:	() => this.velocity.y = 0,
			horizontal: () => this.velocity.x = 0,
		}

		if(info.isSliding && this.canvasFriction != 0) {
			friction[info.edge]();
		}

		if(this.canBounceCanvas) {
			snap[info.edge]();
			bounce[info.edge]();
			if (Math.abs(this.velocity.x) < 0.1 && this.position.x + this.height / 2 > 0) stopBounce.horizontal();
			if (Math.abs(this.velocity.y) < 0.75) stopBounce.vertical();
			this.onBouncedCanvas(info.edge);
		}
	}

	onBouncedCanvas(edge) { 

	}

	renderChildren() {
		Object.values(this.children).map(children => children.render());
	}
}