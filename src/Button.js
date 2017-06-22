/**
 * Created by Owlz on 25/03/2017.
 */
export default class Button extends PIXI.Sprite {
    constructor(states, func) {
        super(states.up);
        this.states = states;
        this.anchor = {x: 0.5, y: 0.5};
        this.interactive = true;
        this._clickFunction = func;
    }

    mouseover() {
        if (this.states.over) this.texture = this.states.over;
        TweenMax.to(this.scale, 0.15, {x: 1.2, y: 1.2, ease: Power4.easeOut});
    }

    mouseout() {
        if (this.states.over) this.texture = this.states.up;
        TweenMax.to(this.scale, 0.5, {x: 1, y: 1, ease: Bounce.easeOut});
    }

    mousedown() {
        if (this.states.down) this.texture = this.states.down;
        TweenMax.to(this.scale, 0.15, {x: 0.95, y: 0.95, ease: Power4.easeOut});
    }

    mouseup() {
        if (this.states.down) {
            if (this.states.over) this.texture = this.states.over;
            else this.texture = this.states.up;
        }
        TweenMax.to(this.scale, 0.5, {
            x: 1.2,
            y: 1.2,
            ease: Elastic.easeOut.config(1, 0.6),
            onComplete: this._clickFunction
        });
    }

    touchstart() {
        this.mouseup();
    };
}