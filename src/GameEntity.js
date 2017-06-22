/**
 * Created by Owlz on 16/04/2017.
 */
"use strict";

export default class GameEntity {
    constructor(view, params) {

        /**
         * @type {Game.Sprite | dragonBones.Armature}
         * @private
         */
        this._view = null;

        /**
         * @type {object}
         * @private
         */
        this._params = params | {isAnim: null, holder: null};

        /**
         * @type {null}
         * @private
         */
        this._collRect = null;

        if (params.isAnim) {
            console.log("isanim");
            console.log(view);
            dragonBones.PixiFactory.factory.parseDragonBonesData(Game.getJSON(view + "_ske"));
            dragonBones.PixiFactory.factory.parseTextureAtlasData(Game.getJSON(view + "_texData"), Game.getTexture(view + "_tex"));
            this._view = dragonBones.PixiFactory.factory.buildArmatureDisplay(view);
            if (params.holder) {
                params.holder.addChild(this._view);
            }
        }
        else {
            //make view a sprite
            this._view = new Game.Sprite(view, params.holder);
        }
    }

    update() {
        //override
    }

    get x() {
        return this._view.x;
    }

    set x(num) {
        this._view.x = num;
    }

    get y() {
        return this._view.y;
    }

    set y(num) {
        this._view.y = num;
    }

    get view() {
        return this._view;
    }

    get scale() {
        return this._view.scale;
    }

    get animation() {
        if (this._view.a) {
            return this._view.a.animation;
        } else {
            return this._view.animation;
        }
    }

    get collRect() {
        if (this._collRect) return this._collRect;
        else console.warn("collision rect not defined");
    }
}