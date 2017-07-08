/**
 * Created by Owlz on 18/06/2017.
 */

/**
 * Global class for persistent variables such as current level etc.
 * @constructor
 */
const Common = function () {
};

/**
 * Size of map, a square of n x n tiles
 * @type {number}
 */
Common.mapSize = 50;

/**
 * Size of a single square tile, set on map init
 * @type {number}
 */
Common.tileSize = -1;

/**
 * Current level
 * @type {number}
 */
Common.currentLevel = 0;

/**
 * Strings copy object for retrieving strings from JSON
 * @type {?object}
 */
Common.strings = null;

export default Common;
//global.Common = Common;
