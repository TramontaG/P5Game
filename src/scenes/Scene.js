export default class Scene {
	constructor(options = {}){
		this.gameObjects = {}
		this.opacity = options.opacity || 255;
		this.backgroundColor = options.backgroundColor || 0;
	}

	render(){
		background(this.backgroundColor || 0);
		Object.values(this.gameObjects).map(gameObject => {
			gameObject.compute();
		});
		Object.values(this.gameObjects).map(gameObject => {
			gameObject.move();
		});
	};

	protoPreLoad(){
		Object.values(this.gameObjects).map(gameObject => {
			gameObject.protoPreLoad();
		});
	}

	onClick = () => {
		Object.values(this.gameObjects).map(gameObject => {
			gameObject.protoOnClick();
		});
	}

	mouseDragged = () => {
		Object.values(this.gameObjects).map(gameObject => {
			gameObject.protoMouseDragged();
		});
	}

	mouseReleased = () => {
		Object.values(this.gameObjects).map(gameObject => {
			gameObject.protoMouseReleased();
		});
	}

	mousePressed = () => {
		Object.values(this.gameObjects).map(gameObject => {
			gameObject.protoMousePressed();
		});
	}
}