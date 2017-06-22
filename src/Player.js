/**
 * Created by Owlz on 16/04/2017.
 */
"use strict";

import MobileEntity from './MobileEntity';

export default class Player extends MobileEntity {
    constructor(view, params) {
        super(view, params);
        const actualView = this._view;
        params.holder.removeChild(this._view);
        this._view = new Game.Sprite("alpha", params.holder);
        this._view.anchor.set(0.5);
        this._view.addChild(actualView);
        this._view.a = actualView;
        params.holder.addChild(this._view);
    }

    update() {
        //flip player so he faces right way
        if (this.dx > 0) {
            this.scale.x = -1;

        } else if (this.dx < 0) {
            this.scale.x = 1;
        }
    }
}