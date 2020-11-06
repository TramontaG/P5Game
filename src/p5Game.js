import gameScenes from "./scenes/scenesList";
import IdGenerator from './util/IDGenerator';

const debug = 2;

class P5Game {
  setup() {
    this.loadedScenes = [];
    this.currentScene = this.loadedScenes[0];
    

    this.utils = {
      IdGenerator: IdGenerator,
    }

    this.pushScene('scene1'); 

    this.scenesTransitions = {
      fade: this.fade,
    };
    
    rectMode(CENTER)
  }

  render = () =>{
    for (let scene of this.loadedScenes){
			scene.render();
		}
  }

	//Scenes Management
  changeSceneTo = (sceneName, sceneOptions = {}, transitionOptions = {}) => {
    if (this.scenesTransitions.hasOwnProperty(transitionOptions.type)) {
      this.scenesTransitions[transitionOptions.type](sceneName, sceneOptions, transitionOptions);
    } else {
      this.loadedScenes = [new gameScenes[sceneName](sceneOptions)];
      this.currentScene = this.loadedScenes[this.loadedScenes.length - 1];
    }
    this.currentScene.protoPreLoad();
  }

  pushScene = (sceneName, sceneOptions) => {
    this.loadedScenes.push(new gameScenes[sceneName](sceneOptions));
    this.currentScene = this.loadedScenes[this.loadedScenes.length - 1];
    this.currentScene.protoPreLoad();
  }

  popScene = () => {
    const lastScene = this.loadedScenes.pop();
    this.currentScene = this.loadedScenes[this.loadedScenes.length - 1];
    return lastScene;
  }

	//scene transitions
	stopSceneTransition = (sceneTransition) => {
		clearInterval(sceneTransition);
		this.loadedScenes.splice(this.loadedScenes.indexOf(this.currentScene) - 1, 1);
	}

  fade = (sceneName, sceneOptions, transitionOptions) => {
		this.pushScene(sceneName, sceneOptions);
		this.currentScene.opacity = 0;
		const fade = setInterval(() => {
			this.currentScene.opacity < 255 ? 
			this.currentScene.opacity ++ 		:
			this.stopSceneTransition(fade);
		}, 255 / (60 * (transitionOptions.speed || 1)));
  }
  
  //Events
  emitMessage = (title, message) => {
    for (let element of Object.values(this.currentScene.gameObjects)){
      if (element.messageHandler.hasOwnProperty(title)){
        element.messageHandler[title](message);
      }
    }
  }	


  //IO Events
  onClick = () => {
    this.currentScene.onClick();
  }

  mouseDragged = () => {
    this.currentScene.mouseDragged();
  }

  mouseReleased = () => {
    this.currentScene.mouseReleased();
  }

  mousePressed = () => {
    this.currentScene.mousePressed();
  }
}

Game = new P5Game();