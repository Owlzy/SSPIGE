/**
 * Created by Owlz on 01/07/2017.
 */
"use strict";

export default class Ball extends Game.Sprite {
    constructor() {
        super();

        /**
         * @type {number}
         * @private
         */
        this._moveSpeed = 3.75;

        /**
         * @type {number}
         * @private
         */
        this._dy = Math.random() < 0.5 ? this._moveSpeed : -this._moveSpeed;

        /**
         * @type {number}
         * @private
         */
        this._dx = Math.random() < 0.5 ? this._moveSpeed : -this._moveSpeed;

        /**
         * @type {Game.Sprite}
         * @private
         */
        this._view = Game.generateEllipse(12, 12, 0xeceddc);

        this.addChild(this._view);
    }

    update() {
        //--don't run if paused--//
        if (Game.isPause) return;

        //--update position--//
        this.x += this.dx;
        this.y += this.dy;

        //--check edges for scoring--//
        if (this.x > Game.view.width * 0.5 - this._view.width || this.x < -Game.view.width * 0.5 + this._view.width) {

            console.log("scored");

            //--"serve" by reflecting ball back at them--//
            this.dx = -this.dx;

            //--reset position to centre--//
            this.x = 0;
            this.y = 0;

            //--pause game--//
            Game.isPause = true;
            Game.reset();

            //--wait a period and unpause--//
            delay(() => {
                Game.isPause = false;
            }, 5);

        }

        //--reflect off top and bottom--//
        if (this.y > Game.view.height * 0.5 - this._view.height || this.y < -Game.view.height * 0.5 + this._view.height) {
            this.dy = -this.dy;
        }
    }

    get dx() {
        return this._dx;
    }

    set dx(float) {
        this._dx = float;
    }

    get dy() {
        return this._dy;
    }

    set dy(float) {
        this._dy = float;
    }

    get x() {
        return this._view.x;
    }

    set x(val) {
        this._view.x = val;
    }

    get y() {
        return this._view.y;
    }

    set y(val) {
        this._view.y = val;
    }
}