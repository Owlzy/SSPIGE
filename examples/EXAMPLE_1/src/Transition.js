/**
 * Created by Owlz on 26/03/2017.
 */
export default class Transition {
    constructor() {
        this._objIn = null;
    }

    set objIn(displayObj) {
        displayObj.visible = false;
        this._objIn = displayObj;
    }

    /**
     * Transitions old scene out and has a callback that it calls upon completion
     * @param displayObj {PIXI.Container}
     * @param cb {function} - Callback function
     */
    transitionOut(displayObj, cb) {
        //override in child class
    }

    /**
     * Transitions new scene in
     * @param displayObj {PIXI.Container}
     */
    transitionIn(displayObj) {
        //override in child class
    }

}