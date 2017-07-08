/**
 * Created by Owlz on 31/03/2017.
 */

export default class Preloader extends Game.Scene {
    constructor() {
        super();
        this._g = null;
        this._genTex = null;
        this._bar = null;
    }

    //called after constructor, can be used for init
    start() {
        //this._barOverlay = createSprite(0, 0, "loading_bar");
        this._g = new PIXI.Graphics();
        this._g.beginFill(0xd0d1cc);
        this._g.drawRect(0, 0, 350, 25);
        this._genTex = Game.renderer.generateTexture(this._g);
        this._g.destroy();
        this._bar = new Game.Sprite(this._genTex);
        this.addChild(this._bar);
        this._bar.anchor = {x: 0, y: 0.5};
        this._bar.x = -this._bar.width * 0.5;
        this._bar.scale.x = 0;
    }

    //called once per frame
    update() {
        this._bar.scale.x = Game.loadProgress;
    }

    destroy() {
        for (let i = 0; i < this.children.length; i++) this.children[i].destroy(true);
        Game.stage.removeChild(this);
        Game.ticker.remove(this.update, this);
    }
}

function createSprite(x, y, textureName, holder) {
    let sprite = new Game.Sprite(textureName, holder);
    sprite.x = x;
    sprite.y = y;
    sprite.anchor = {x: 0.5, y: 0.5};
    return sprite;
}