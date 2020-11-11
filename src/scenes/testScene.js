import Scene from './Scene';
import { Rectangle } from './../gameObjects/gameObjectList';
import { center } from './../util/Measures';

export default class testScene extends Scene{
	constructor(options = {}){
		super(options);
		this.backgroundColor = '#55f';
		
		for (let i = 0 ; i<8; i++){
			this.gameObjects['cube' + i] = new Rectangle({...this.randomCubeOptions(), tag: 'cube' + i});
		}
	}

	randomCubeOptions = () => {
		const size = Math.random() * 60 + 20;
		return {
			width: size,
			height: size,
			bounceCoeficient: .8,
			position: p5.Vector.random2D().setMag(Math.random() * 400),
			velocity: p5.Vector.random2D().setMag(Math.random() * 15),
			mass: size / 3,
			debug: {
				hitboxes: true,
				position: true,
				vectors: true,
			},
			canvasFriction: 0.2,
		}
	}
}
