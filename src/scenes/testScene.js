import Scene from './Scene';
import { Square } from './../gameObjects/gameObjectList';

export default class testScene extends Scene{
	constructor(options = {}){
		super(options);
		this.backgroundColor = '#55f';

		this.gameObjects = {
			square: new Square({
				width: 30,
				height: 50,
				bounceCoeficient: .8,
				friction: 0,
				position: {x: 150, y: 150},
				fillColor: 'rgba(150,200,150,.5)',
				borderColor: 'rgb(150,150,150)',
				borderThicknes: 3,
				name: 'start',
				tag: "smallBlock",
				debug: {
					hitboxes: true,
					position: true,
				},
				hasRigidBody: true,
			}),
			square2: new Square({
				width: 150,
				height: 150,
				position: {x: windowWidth /2, y: windowHeight / 2},
				fillColor: '#000',
				debug: {
					hitboxes: true,
					position: true,
				},
				tag: 'bigBlock',
				bounceCoeficient: 0.6,
				mass: 20,
			}),
		}
	}

	randomCubeOptions = () => {
		const size = Math.random() * 35 + 30;
		const xvel = Math.random() * 10 - 10;
		const yvel = Math.random() * 10 - 10;
		return {
			width: size,
			height: size,
			bounceCoeficient: .8,
			position: {x: Math.random() * windowWidth - size, y: Math.random() * windowHeight - size},
			velocity: {x: 0, y: 0},
			mass: size / 2,
		}
	}
}
