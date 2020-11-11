import Scene from './Scene';
import { Rectangle } from './../gameObjects/gameObjectList';
import { center } from './../util/Measures';

export default class testScene extends Scene{
	constructor(options = {}){
		super(options);
		this.backgroundColor = '#55f';
		this.gameObjects = {}

		this.gameObjects = {
			square2: new Rectangle({
				width: 50,
				height: 50,
				bounceCoeficient: .75,
				canvasFriction: 0,
				position: new p5.Vector(windowWidth / 2, windowHeight / 2),
				fillColor: 'rgba(150,200,150,.5)',
				borderColor: 'rgb(150,150,150)',
				borderThicknes: 3,
				canvasFriction: .2,
				mass: 5,
				name: 'start',
				tag: "smallBlock",
				hasRigidBody: true,
				debug: {
					hitboxes: true,
					vectors: true,
					position: true,
				}
			}),

			square1: new Rectangle({
				width: 75,
				height: 75,
				bounceCoeficient: .75,
				canvasFriction: .2,
				position: new p5.Vector(windowWidth * 0.75, windowHeight * 0.25),
				fillColor: 'rgba(150,200,150,.5)',
				borderColor: 'rgb(150,150,150)',
				borderThicknes: 3,
				canvasFriction: 0,
				mass: 10,
				name: 'start',
				tag: "smallBlock",
				hasRigidBody: true,
				debug: {
					hitboxes: true,
					vectors: true,
					position: true,
				}
			}),
			square3: new Rectangle({
				width: 100,
				height: 100,
				bounceCoeficient: .75,
				canvasFriction: 0,
				position: new p5.Vector(windowWidth / 4, windowHeight * .75),
				fillColor: 'rgba(150,200,150,.5)',
				borderColor: 'rgb(150,150,150)',
				borderThicknes: 3,
				canvasFriction: .2,
				mass: 15,
				name: 'start',
				tag: "mediumBlock",
				hasRigidBody: true,
				debug: {
					hitboxes: true,
					vectors: true,
					position: true,
				}
			}),
		}
	}

	randomCubeOptions = () => {
		const size = Math.random() * 60 + 20;
		const xvel = Math.random() * 10 - 10;
		const yvel = Math.random() * 10 - 10;
		return {
			width: size,
			height: size,
			bounceCoeficient: .8,
			position: {x: Math.random() * windowWidth - size, y: Math.random() * windowHeight - size},
			velocity: {x: xvel, y: yvel},
			mass: size / 3,
			debug: {
				hitboxes: true,
				position: true,
			},
			canvasFriction: 2,
		}
	}
}
