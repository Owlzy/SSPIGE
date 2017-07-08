/**
 * Created by Owlz on 18/03/2017.
 */

export default class Scene extends PIXI.Container {
    constructor() {
        super();
        //make it so zero is the centre of the window
        this.x = Game.view.width * 0.5;
        this.y = Game.view.height * 0.5;
    }

    start() {
        //overridden in child class
    }

    update() {
        //overridden in child class
    }

    destroy() {
        for (let i = 0; i < this.children.length; i++) this.children[i].destroy();
        Game.stage.removeChild(this);
        Game.ticker.remove(this.update, this);
        super.destroy();
    }
}