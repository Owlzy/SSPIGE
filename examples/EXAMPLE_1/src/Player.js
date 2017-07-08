/**
 * Created by Owlz on 01/07/2017.
 */
"use strict";

export default class Player extends Game.Sprite {
    constructor() {
        super();

        /**
         * @type {number}
         * @private
         */
        this._moveSpeed = 2.75;

        /**
         * Players need only a y velocity, set it to random start value
         * @type {number}
         * @private
         */
        this._dy = 0;

        /**
         * @type {Game.Sprite}
         * @private
         */
        this._view = Game.generateRect(25, 125, 0xeceddc);

        /**
         * Random start
         * @type {number}
         */
        this.x = 0;

        /**
         * Random start
         * @type {number}
         */
        this.y = -Game.view.height * 0.5 - this.hei * 0.5;

        //--add display object to scene--//
        this.addChild(this._view);
    }

    initControl() {
        //--setup keyboard controls--//
        let moveUp = Game.keyboard(87);
        moveUp.down = () => {
            this.dy = -this._moveSpeed;
        };
        moveUp.up = () => {
            this.dy = 0;
        };

        let moveDown = Game.keyboard(83);
        moveDown.down = () => {
            this.dy = this._moveSpeed;
        };
        moveDown.up = () => {
            this.dy = 0;
        };
    }

    animateIn() {
        this.y = -Game.view.height * 0.5 - this.hei * 0.5;
        TweenMax.to(this, 3.5, {y: 0, ease: Elastic.easeOut});
    }

    update() {
        if (Game.isPause) return;
        this.y += this.dy;
    }

    get dy() {
        return this._dy;
    }

    set dy(float) {
        this._dy = float;
    }

    get moveSpeed() {
        return this._moveSpeed;
    }

    get y() {
        return this._view.y;
    }

    set y(val) {
        this._view.y = val;
    }

    get hei() {
        return this._view.height;
    }
}