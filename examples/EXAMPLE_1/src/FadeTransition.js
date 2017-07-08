/**
 * Created by Owlz on 26/03/2017.
 */
import Transition from './Transition';

export default class FadeTransition extends Transition {
    /**
     * @param fadeTime {number} - Fade time in seconds
     */
    constructor(fadeTime) {
        super();
        this._fadeTime = fadeTime;
    }

    /**
     * Transitions old scene out and has a callback that it calls upon completion
     * @param displayObj {PIXI.Container}
     * @param cb {function} - Callback function
     */
    transitionOut(displayObj, cb) {
        TweenMax.to(displayObj, this._fadeTime, {
                alpha: 0,
                ease: Power0.easeNone,
                onComplete: () => {
                    cb();
                    this.transitionIn(this._objIn);
                }
            }
        );
    }

    /**
     * Transitions new scene in
     * @param displayObj {PIXI.Container}
     */
    transitionIn(displayObj) {
        displayObj.alpha = 0;
        displayObj.visible = true;
        TweenMax.to(displayObj, this._fadeTime, {
                alpha: 1,
                ease: Power0.easeNone
            }
        );
    }
}