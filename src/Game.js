/**
 * Created by Owlz on 18/03/2017.
 */
import Button from './Button';
import Scene from './Scene';
import FadeTransition from './FadeTransition';
import Entity from './GameEntity';
import Bump from './Bump';

const Game = function () {
};
Game.Util = {};

//members
Game.renderer = null;
Game.assets = null;
Game.stage = null;
Game.view = null;
Game.screen = null;
Game.ticker = null;
Game.nextScene = null;
Game.view = {width: undefined, height: undefined};
Game.loadProgress = 0.0;
Game.isPause = false;
Game.gsop = null;

//global game classes
Game.Button = Button;
Game.Scene = Scene;
Game.Transition = new FadeTransition(2);

/**
 * Simple physics and collision library
 * @type {Bump}
 */
Game.Bump = Bump;

/**
 * Root game entity class
 * @type {GameEntity}
 */
Game.Entity = Entity;

/**
 * Sprite class.  Takes arg that is texture name string or a PIXI.Texture, with optional holder arg.
 * @type {Sprite}
 */
Game.Sprite = class extends PIXI.Sprite {
    /**
     * Creates an image with optional argument to add it to a display object
     * @param texture {string | PIXI.Texture}
     * @param holder {PIXI.Container=}
     */
    constructor(texture, holder) {
        if (typeof texture === 'string') super(Game.getTexture(texture));
        else if (texture instanceof PIXI.Texture) super(texture);
        else super(PIXI.Texture.EMPTY);
        if (holder) holder.addChild(this);
    }
};

/**
 * @type {AnimatedSprite}
 */
Game.AnimatedSprite = class extends PIXI.extras.AnimatedSprite {
    /**
     *
     * @param textures {Array<PIXI.Texture>}
     */
    constructor(textures) {
        super(textures);
    }
};

/**
 * @type {Container}
 */
Game.Container = class extends PIXI.Container {
    constructor() {
        super();
    }
};

/**
 * @type {PhysSprite}
 */
Game.PhysSprite = class extends Game.Sprite {
    constructor(texture, holder) {
        if (texture instanceof PIXI.Sprite) {
            super(texture.texture, holder);
            texture.destroy();
            this.anchor = {x: 0.5, y: 0.5};
        }
        else super(texture, holder);

        /**
         *
         * @type {number}
         * @private
         */
        this._dx = 0;
        /**
         *
         * @type {number}
         * @private
         */
        this._dy = 0;

        /**
         *
         * @type {number}
         * @private
         */
        this._rotSpeed = 0;
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

    get rotSpeed() {
        return this._rotSpeed;
    }

    set rotSpeed(float) {
        this._rotSpeed = float;
    }
};

/**
 * Returns a base texture from cached assets
 * @param name {!string}
 * @returns {PIXI.Texture | PIXI.Texture.EMPTY}
 */
Game.getTexture = (name) => {
    if (Game.assets[name]) return Game.assets[name].texture;
    else {
        //if we cant find it lets see if it is in a texture sheet
        try {
            /// let texture = PIXI.Texture.fromFrame(name + ".png");
            return PIXI.Texture.fromFrame(name + ".png");
        }
        catch (err) {
            console.warn("texture not found : " + name);
            return PIXI.Texture.EMPTY;
        }
    }
};

/**
 *
 * @param name {string}
 */
Game.getJSON = (name) => {
    return Game.assets[name].data;
};

/**
 * Checks if two bounding boxes overlap, with optional bounce param
 * @param r1 {PIXI.Sprite | PIXI.Rectangle}
 * @param r2 {PIXI.Sprite | PIXI.Rectangle}
 * @returns {boolean}
 */
Game.collideOBB = (r1, r2) => {

    r1 = r1.getBounds();
    r2 = r2.getBounds();

    return !(r2.x > (r1.x + r1.width) ||
    (r2.x + r2.width) < r1.x ||
    r2.y > (r1.y + r1.height) ||
    (r2.y + r2.height) < r1.y);
};

/**
 * Returns a new sprite that uses a texture generated using pixi graphics, mostly for debug and prototyping etc.
 * @param width
 * @param height
 * @param colour
 * @returns {PIXI.Sprite|String}
 */
Game.generateRect = function (width, height, colour) {
    let g = new PIXI.Graphics();
    if (colour) g.beginFill(colour);
    else g.beginFill(0x000fff);
    g.drawRect(0, 0, width, height);
    g.endFill();
    let sprite = new PIXI.Sprite(Game.renderer.generateTexture(g));
    sprite.anchor = {x: 0.5, y: 0.5};
    g.destroy();
    return sprite;
};

/**
 * Returns a new sprite that uses a texture generated using pixi graphics, mostly for debug and prototyping etc.
 * @param width
 * @param height
 * @param colour
 * @returns {PIXI.Sprite|String}
 */
Game.generateEllipse = function (width, height, colour) {
    let g = new PIXI.Graphics();
    if (colour) g.beginFill(colour);
    else g.beginFill(0xfff000);
    g.drawEllipse(0, 0, width, height);
    g.endFill();
    let sprite = new PIXI.Sprite(Game.renderer.generateTexture(g));
    sprite.anchor = {x: 0.5, y: 0.5};
    g.destroy();
    return sprite;
};

/**
 * Returns a new keyboard object that listens for keyboard input
 * @param keyCode
 * @returns {{}}
 */
Game.keyboard = function (keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.down = undefined;
    key.up = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.down) key.down();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.up) key.up();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );

    key.removeTheListeners = () => {
        window.removeEventListener(
            "keydown", key.downHandler.bind(key)
        );
        window.removeEventListener(
            "keyup", key.upHandler.bind(key)
        );
    };

    return key;
};

/**
 * @param {number} x1 - Coordinate X of 1st point
 * @param {number} y1 - Coordinate Y of 1st point
 * @param {number} x2 - Coordinate X of 2nd point
 * @param {number} y2 - Coordinate Y of 2nd point
 * @returns {number} distance - Euclidean distance between the two points
 */
Game.Util.distance = function (x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

Game.Util.aStar = {
    /**
     * @param grid
     */
    init: function (grid) {
        for (let x = 0; x < grid.length; x++)for (let y = 0; y < grid[x].length; y++)grid[x][y].f = 0, grid[x][y].g = 0, grid[x][y].h = 0, grid[x][y].parent = null
    },
    /**
     * @param grid
     * @param start
     * @param end
     * @returns {Array}
     */
    search: (grid, start, end) => {
        Game.Util.aStar.init(grid);
        let openList = [], closedList = [];
        openList.push(start);
        for (; openList.length > 0;) {
            for (let lowInd = 0, i = 0; i < openList.length; i++)openList[i].f < openList[lowInd].f && (lowInd = i);
            let currentNode = openList[lowInd];
            if (currentNode.pos.x === end.pos.x && currentNode.pos.y === end.pos.y) {
                for (let curr = currentNode, ret = []; curr.parent;)ret.push(curr), curr = curr.parent;
                return ret
            }
            let index = openList.indexOf(currentNode);
            openList.splice(index, 1), closedList.push(currentNode);
            let neighbours = Game.Util.aStar.neighbours(grid, currentNode);
            for (i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i], isWall = !1;
                if ((neighbour.pos.x < 0 || neighbour.pos.x > grid[0].length || neighbour.pos.y < 0 || neighbour.pos.y > grid[0].length) && (isWall = !0), index = closedList.indexOf(neighbour), index === -1 && !isWall && !neighbour.occupied) {
                    let gScore = currentNode.g + 1, gScoreIsBest = !1;
                    index = openList.indexOf(neighbour), index === -1 ? (gScoreIsBest = !0, neighbour.h = Game.Util.aStar.manhattan(neighbour.pos, end.pos), openList.push(neighbour)) : gScore < neighbour.g && (gScoreIsBest = !0), gScoreIsBest && (neighbour.parent = currentNode, neighbour.g = gScore, neighbour.f = neighbour.g + neighbour.h)
                }
            }
        }
        return console.log("no path found"), []
    },
    /**
     * @param pos0
     * @param pos1
     * @returns {number}
     */
    manhattan: function (pos0, pos1) {
        let dX = Math.abs(pos1.x - pos0.x), dY = Math.abs(pos1.y - pos0.y);
        return dX + dY
    },
    /**
     * @param grid
     * @param node
     */
    neighbours: function (grid, node) {
        let neigh = [], x = node.pos.x, y = node.pos.y;
        return grid[x - 1] && grid[x - 1][y] && neigh.push(grid[x - 1][y]), grid[x + 1] && grid[x + 1][y] && neigh.push(grid[x + 1][y]), grid[x][y - 1] && grid[x][y - 1] && neigh.push(grid[x][y - 1]), grid[x][y + 1] && grid[x][y + 1] && neigh.push(grid[x][y + 1]), neigh
    }
};

/**
 * Returns a matrix of defined size with optional initial values
 * @param {number} numRows - Number rows in matrix
 * @param {number} numCols - Number of columns in matrix
 * @param initial - Optional initial value
 * @returns {Array}
 */
Game.Util.matrix = (numRows, numCols, initial) => {
    let arr = [], columns = [];
    for (let i = 0; i < numRows; i++) {
        columns = [];
        for (let j = 0; j < numCols; j++) columns[j] = initial;
        arr[i] = columns;
    }
    return arr;
};

export default Game;
window.Game = Game;