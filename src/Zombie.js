/**
 * Created by Owlz on 16/04/2017.
 */
"use strict";

import MobileEntity from './MobileEntity';

export default class Zombie extends MobileEntity {
    constructor(view, params) {
        super(view, params);
        ///this._collRect = Game.generateRect(50, 25);
        //this.view.addChild(this._collRect);
        const actualView = this._view;
        params.holder.removeChild(this._view);
        this._view = new Game.Sprite("alpha", params.holder);
        this._view.anchor.set(0.5);
        this._view.addChild(actualView);
        this._view.a = actualView;
        params.holder.addChild(this._view);


        this._path = [];

        // Game.Util.aStar.init(Game.gsop.floorTiles);

        this.pathTo();
    }

    update() {
        //flip player so he faces right way
        if (this.dx > 0) {
            this.scale.x = -1;

        } else if (this.dx < 0) {
            this.scale.x = 1;
        }
    }

    pathTo(x, y) {
        //    this._path = Game.Util.aStar.search(Game.gsop.floorTiles, this, Game.gsop.player);
        // console.log(this._path);
    }

    followPath() {
        if (this._path.length === 0) return;
        TweenMax.to(this, 2, {
            x: this._path[this._path.length - 1].x, y: this._path[this._path.length - 1].y,
            ease: Power0.easeNone,
            onComplete: () => {
                this._path.pop();
                this.followPath();
            }
        })
    }

}