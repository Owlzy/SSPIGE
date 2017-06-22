/**
 * Created by Owlz on 16/04/2017.
 */
"use strict";

import GameEntity from './GameEntity';

export default class MobileEntity extends GameEntity {
    constructor(view, params) {
        super(view, params);

        /**
         * @type {number}
         * @private
         */
        this._dx = 0;
        /**
         * @type {number}
         * @private
         */
        this._dy = 0;

        /**
         * Tween Speed
         * @type {number}
         * @private
         */
        this._twSpeed = 800;
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

    tweenTo(x, y, params) {
        let dist = Game.Util.distance(this.x, this.y, x, y);
        if (params.speed) {
            TweenMax.to(this, dist / speed, {x: x, y: y, ease: Power0.easeNone, onComplete: params.cb});
        } else {
            TweenMax.to(this, dist / this._twSpeed, {x: x, y: y, ease: Power0.easeNone, onComplete: params.cb});
        }
    }

    update() {
        if (Game.isPause) return;
        this.x += this.dx;
        this.y += this.dy;
    }

}