/**
 * Created by Owlz on 18/03/2017.
 */

import Common from './Common';
import Player from './Player';

export default
class GameScene extends Game.Scene {
    constructor() {

        //--call super classes constructor--//
        super();

        //-----------------------//
        //--declare global vars--//
        //-----------------------//

        /**
         * Master map holder that contains the whole level
         * @type {Container}
         */
        this.mapHolder = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.bgLayer = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.baseLayer = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.decoLayer = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.decoLayer_2 = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.floorLayer = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.floorDecoLayer = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.floorDecoLayer_2 = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.blockedLayer = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.blockedLayer_2 = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.objectLayer = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.objectLayer_2 = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.upperDecoLayer = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.aboveLayer = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.aboveLayer_2 = new Game.Container();

        /**
         * @type {Game.Container}
         */
        this.characterLayer = new Game.Container();

        /**
         * @type PIXI.Container
         */
        this.uiLayer = new Game.Container();

        /**
         * @type {Array}
         */
        this.floorTiles = [];

        /**
         * @type {Array<Game.Entity>}
         */
        this.gameObjects = [];

        /**
         *
         * @type {Game.Sprite}
         */
        this.player = null;

        /**
         * @type {number}
         */
        this.startArrIndex = -1;

    }

    //called after constructor, can be used for init
    start() {

        console.log("init game scene");

        //--set game scope--//
        Game.gsop = this;

        //--add our game holder to the scene, and our UI holder on top (all buttons etc will draw over the top)--//
        this.mapHolder.addChild(this.bgLayer, this.baseLayer, this.floorLayer, this.floorDecoLayer, this.floorDecoLayer_2, this.decoLayer, this.decoLayer_2, this.objectLayer, this.objectLayer_2, this.upperDecoLayer, this.blockedLayer, this.blockedLayer_2, this.characterLayer, this.aboveLayer, this.aboveLayer_2, this.uiLayer);
        this.addChild(this.mapHolder);

        //--load level from JSON--//
        this.loadLevel();

        //--init user input etc.--//
        this.initGame();

    }

    /**
     * Called once per frame
     */
    update() {

        if (this.player) {

            //--lock map on player--//
            this.mapHolder.x = -this.player.x;
            this.mapHolder.y = -this.player.y;
            //--round values--//
            this.mapHolder.x = Math.round(this.mapHolder.x);
            this.mapHolder.y = Math.round(this.mapHolder.y);

            //--update player every frame, for animations etc--//
            this.player.update();

            //--depth sort character layer, any sprites to be depth sorted should be added to this layer--//
            this.characterLayer.children.sort(function (a, b) {
                if (a.position.y > b.position.y) return 1;
                if (a.position.y < b.position.y) return -1;
                if (a.position.x > b.position.x) return 1;
                if (a.position.x < b.position.x) return -1;
                return 0;
            });
        }

    }

    /**
     * Called on leaving the scene, used to cleanup display objects, data and any generated textures
     */
    destroy() {
        //--calls super function cleaning up this scene--//
        super.destroy();
        //--clear global game scope--//
        Game.gsop = null;
        //--if you generate any textures call destroy(true) on them to destroy the base texture--//
        //texture.destroy(true);
    }

    /**
     * Init's user input etc.
     */
    initGame() {
        //--init keyboard movement--//
        const tileWid = 128;

        //--move up--//
        let moveUp = Game.keyboard(87);
        moveUp.down = () => {
            this.player.animation.play("walk_back");
            this.player.tweenTo(this.player.x, this.player.y - Common.tileSize, {
                cb: () => {
                    this.player.animation.play("idle_side");
                }
            });
        };
        moveUp.up = () => {
        };

        //--move down--//
        let moveDown = Game.keyboard(83);
        moveDown.down = () => {

            this.player.animation.play("walk_front");
            this.player.tweenTo(this.player.x, this.player.y + Common.tileSize, {
                cb: () => {
                    this.player.animation.play("idle_side");
                }
            });
        };
        moveDown.up = () => {
        };

        //--move left--//
        let moveLeft = Game.keyboard(65);
        moveLeft.down = () => {
            this.player.scale.x = 1;
            this.player.animation.play("walk_side");
            this.player.tweenTo(this.player.x - Common.tileSize, this.player.y, {
                cb: () => {
                    this.player.animation.play("idle_side");
                }
            });
        };
        moveLeft.up = () => {
        };

        //--move right--//
        let moveRight = Game.keyboard(68);
        moveRight.down = () => {
            this.player.scale.x = -1;
            this.player.animation.play("walk_side");
            this.player.tweenTo(this.player.x + Common.tileSize, this.player.y, {
                cb: () => {
                    this.player.animation.play("idle_side");
                }
            });
        };
        moveRight.up = () => {
        };
    }

    /**
     * Loads the level
     */
    loadLevel() {

        //--bind nested functions--//
        createObjLayer = createObjLayer.bind(this);
        createPlayer = createPlayer.bind(this);

        //--grab textures from sheet and pop them into a convenient array where they can be accessed using the tile id as the index--//
        const tileSize = 128;
        let sheet = Game.getTexture("tileset").baseTexture;
        sheet.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let textures = [];
        let tilesPerRow = Math.round(sheet.width / tileSize);
        let tilesPerCol = Math.round(sheet.height / tileSize);
        let totalTileTextures = tilesPerRow * tilesPerCol;
        for (let i = 0; i < totalTileTextures; i++) {
            textures.push(new PIXI.Texture(sheet, new PIXI.Rectangle((i % tilesPerRow) * tileSize, Math.floor(i / tilesPerRow) * tileSize, tileSize, tileSize)));
        }

        //--set tile size--//
        Common.tileSize = Math.round(sheet.width / tilesPerRow);

        //--load map--//
        let map = Game.getJSON("test_level");

        //===========================//
        //=====tile layers start=====//
        //===========================//

        //--bg layer--//
        createTileLayer(map.layers[0].data, this.bgLayer);

        //--base layer--//
        createTileLayer(map.layers[1].data, this.baseLayer);

        //--deco layer--//
        createTileLayer(map.layers[2].data, this.decoLayer);

        //--deco layer_2--//
        createTileLayer(map.layers[3].data, this.decoLayer_2);

        //--floor layer--//
        createTileLayer(map.layers[4].data, this.floorLayer, this.floorTiles);

        //--floor deco layer--//
        createTileLayer(map.layers[5].data, this.floorDecoLayer);

        //--floor deco layer_2--//
        createTileLayer(map.layers[6].data, this.floorDecoLayer_2);

        //--blocked layer--//
        createTileLayer(map.layers[7].data, this.blockedLayer);

        //blocked layer_2
        createTileLayer(map.layers[8].data, this.blockedLayer_2);

        //===========================//
        //======tile layers end======//
        //===========================//
        //---------------------------//
        //===========================//
        //====object layers start====//
        //===========================//

        //--create object layer--//
        createObjLayer(map.layers[9].objects, this.characterLayer, this.gameObjects);

        //--create object layer_2--//
        createObjLayer(map.layers[10].objects, this.characterLayer, this.gameObjects);

        //===========================//
        //=====object layers end=====//
        //===========================//

        //===========================//
        //=====create player=========//
        //===========================//
        if (this.startArrIndex !== -1) createPlayer(map.layers[9].objects, this.startArrIndex, this.characterLayer);
        else console.warn("start not initialised");
        //===========================//
        //===========================//

        //===========================//
        //=====upper tile layers=====//
        //===========================//
        console.log("foo");
        //upper deco layer
        createTileLayer(map.layers[11].data, this.upperDecoLayer);

        //above layer
        createTileLayer(map.layers[12].data, this.aboveLayer);

        //above layer_2
        createTileLayer(map.layers[13].data, this.aboveLayer_2);

        //===========================//
        //===========end=============//
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@//

        //-----nested functions------//

        /**
         * Creates a object layer
         * @param data
         * @param holder
         * @param arr
         */
        function createObjLayer(data, holder, arr) {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                let gameObj, skipPush = false, posX = data[i].x + Common.tileSize, posY = data[i].y - Common.tileSize;
                console.log(data[i].type);
                switch (data[i].type) {
                    //place player
                    case "start":
                        //--store index for placing character--//
                        this.startArrIndex = i;
                        //--create start tile--//
                        gameObj = createSprite(posX, posY, "obj_stone_start", holder);
                        skipPush = true;
                        break;
                    //place level end
                    case "end":
                        //--create end tile--//
                        gameObj = createSprite(posX, posY, "obj_blue_end", holder);
                        break;
                    case "block":
                        //--create destination pad--//
                        gameObj = createSprite(posX, posY, "obj_stone_block", holder);
                        gameObj.scale.set(0.75);
                        break;
                    //materials
                    case "mat_slip":
                        //--assign material component--//
                        break;
                    default:
                        console.warn("unknown game object : " + data[i].type);
                }
                if (arr && !skipPush) arr.push(gameObj);
            }
        }

        /**
         * @param data
         * @param holder
         * @param arr
         */
        function createTileLayer(data, holder, arr) {
            let tiles = convert(data), sp;
            for (let i = 0; i < tiles.length; i++) {
                sp = createSprite(tiles[i].x, tiles[i].y, textures[tiles[i].tileID - 1], holder);
                if (arr) arr.push(sp);
            }
        }

        /**
         * Converts CSV tile array to objects with x, y values and tileID
         * @param array
         * @returns {Array}
         */
        function convert(array) {
            let x = 0, y = 0, retArr = [], mapWid = Common.mapSize, mapHei = Common.mapSize;
            for (let i = 0; i < array.length; i++) {
                x = (i % mapWid) * tileSize;
                if (i % mapHei === 0) y += tileSize;
                if (array[i] !== 0) retArr.push({tileID: array[i], x: x, y: y});
            }
            return retArr;
        }

        function createPlayer(data, index, holder) {
            this.player = new Player("char", {isAnim: true, holder: holder});
            this.player.animation.play("idle_side");
            this.player.x = data[index].x + Common.tileSize;
            this.player.y = data[index].y - Common.tileSize;
            this.player.animation.timeScale = 2;
        }
    }
}

/**
 * Factory method, don't have to use it but can help inline code sometimes to keep it short
 * @param x {number}
 * @param y {number}
 * @param textureName {string}
 * @param holder {PIXI.Container}
 * @returns {Game.Sprite}
 */
function createSprite(x, y, textureName, holder) {
    let sprite = new Game.Sprite(textureName, holder);
    sprite.anchor = {x: 0.5, y: 0.5};
    sprite.x = x;
    sprite.y = y;
    return sprite;
}