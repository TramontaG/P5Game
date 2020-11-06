import Scene from './Scene';
import { Square } from './../gameObjects/gameObjectList';

export default class testScene2 extends Scene{
	constructor(options = {}){
		super(options)
		this.backgroundColor = 'rgba(0,0,0,1)';

		this.gameObjects = {
			square: new Square({
				position: {x: 200, y: 200},
				width: 30,
				height: 25,
				fillColor: 'rgba(150,200,150,.5)',
				borderColor: 'rgb(150,150,150)',
				borderThicknes: 3,
			}),
		}

	}
}