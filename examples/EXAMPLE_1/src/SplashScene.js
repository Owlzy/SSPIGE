/**
 * Created by Owlz on 18/03/2017.
 */

import Game from './Game';

export default class SplashScene extends Game.Scene {
    constructor() {
        //--call super classes constructor first--//
        super();
    }

    //called after constructor, can be used for init
    start() {
        console.log("init splash scene");

        //declare our button states
        const btnStates = {
            up: Game.getTexture("btn_play_up"),
            down: Game.getTexture("btn_play_down"),
            over: Game.getTexture("btn_play_over")
        };

        //create a button and pass in the states and click function
        let clicked = false;
        let btn = new Game.Button(btnStates, () => {
            if (clicked) return;
            clicked = true;
            console.log("button clicked");
            Game.nextScene("game");
        });

        //add to holder
        this.addChild(btn);
    }

    //called once per frame
    update() {
        /// this.sprite.rotation += 0.01;
    }

    destroy() {
        //calls super function cleaning up this scene
        super.destroy();
        //if you generate any textures call .destroy(true) on them here to destroy the base texture
    }
}