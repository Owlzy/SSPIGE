/**
 * Created by Owlz on 18/03/2017.
 */

import Common from './Common';
import Player from './Player';
import Ball from './Ball';

export default
class GameScene extends Game.Scene {
    constructor() {

        //--call super classes constructor--//
        super();

        //-----------------------//
        //--declare global vars--//
        //-----------------------//

        /**
         * @type {Container}
         */
        this.gameHolder = new Game.Container();

        /**
         * @type {Container}
         */
        this.uiHolder = new Game.Container();

        /**
         * @type {Array<Game.Sprite>}
         */
        this.gameObjects = [];

        /**
         * @type {Ball}
         * @private
         */
        this._ball = new Ball();

        /**
         * @type {Player}
         * @private
         */
        this._player = new Player();

        /**
         * @type {Player}
         * @private
         */
        this._opponent = new Player();

        this._players = [];

        /**
         * @type {boolean}
         * @private
         */
        this._running = false;

        Game.reset = this.animateIn.bind(this);
    }

    //called after constructor, can be used for init
    start() {

        console.log("init game scene");

        //--add to scene--//
        this.gameHolder.addChild(this._ball, this._player, this._opponent);
        this.addChild(this.gameHolder, this.uiHolder);

        this.initGame();

        delay(() => {
            this.animateIn();
            delay(() => {
                this._running = true;
                Game.isPause = false;
                console.log("running");
            }, 5);
        }, 4);
    }

    animateIn() {
        this._player.animateIn();
        this._opponent.animateIn();
    }

    /**
     * Called once per frame
     */
    update() {

        //--if its not running or pause, skip game loop--//
        if (!this._running || Game.isPause) return;

        //--run ball update--//
        this._ball.update();

        //--loop through players, run their update function and check for collision with ball--//
        for (let i = 0; i < this._players.length; i++) {
            this._players[i].update();
            //-player ball collision--//
            if (Game.collideOBB(this._players[i]._view, this._ball._view)) {
                this._ball.dx = -this._ball.dx;
            }
            //--player top and bottom collision--//
            if (this._players[i].y - this._players[i].hei * 0.5 < -Game.view.height * 0.5) {
                this._players[i].y = -Game.view.height * 0.5 + this._players[i].hei * 0.5;
            }
            else if (this._players[i].y + this._players[i].hei * 0.5 > Game.view.height * 0.5) {
                this._players[i].y = Game.view.height * 0.5 - this._players[i].hei * 0.5;
            }
        }

        //--"A.I." logic--//
        if (this._ball.y > this._opponent.y) this._opponent.dy = this._opponent.moveSpeed;
        else if (this._ball.y < this._opponent.y) this._opponent.dy = -this._opponent.moveSpeed;
    }

    /**
     * Called on leaving the scene, used to cleanup display objects, data and any generated textures
     */
    destroy() {
        //--calls super function cleaning up this scene--//
        super.destroy();
        //--if you generate any textures call destroy(true) on them to destroy the base texture--//
        //texture.destroy(true);
    }

    /**
     * Init's user input, position game elements etc.
     */
    initGame() {

        //--setup user input--//
        this._player.initControl();

        //--add players to array--//
        this._players.push(this._player, this._opponent);

        //--position both players--//
        this._player.x = -Game.view.width * 0.5 + this._player.width;
        this._opponent.x = Game.view.width * 0.5 - this._opponent.width;
    }

    /**
     * Loads the level
     */
    loadLevel() {


    }
}

/**
 * Factory method, don't have to use it but can help inline code sometimes to keep it short
 * @param x {number}
 * @param y {number}
 * @param textureName {string}
 * @param holder {PIXI.Container}
 * @returns {Game.Sprite}
 */
function createSprite(x, y, textureName, holder) {
    let sprite = new Game.Sprite(textureName, holder);
    sprite.anchor = {x: 0.5, y: 0.5};
    sprite.x = x;
    sprite.y = y;
    return sprite;
}