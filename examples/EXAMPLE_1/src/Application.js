import SplashScene from './SplashScene';
import GameScene from './GameScene';
import Loader from './Loader';

export default class Application {
    constructor() {
        //bind next scene function
        Game.nextScene = this.nextScene.bind(this);

        /**
         * Currently active scene
         * @type {?Scene}
         * @private
         */
        this._currentScene = null;

        /**
         * Next scene
         * @type {?Scene}
         * @private
         */
        this._incomingScene = null;

        /**
         * Loading scene
         * @type {?Scene}
         * @private
         */
        this._loaderScene = null;

        /**
         * Main game assets
         * @type {[*]}
         * @private
         */
        this._mainAssets = [
            //texture packer json texture sheet
            {name: 'buttons', uri: './assets/' + 'textures' + '/' + 'buttons' + '.json'},
        ];

        /**
         * Data json files, configs, level files etc.
         * @type {[*]}
         * @private
         */
        this._dataFiles = [
        ];

        /**
         * Counts number of extra data files from texture sheets so loader has correct file length.
         * @returns {number}
         * @private
         */
        this._fileCount = () => {
            let count = 0;
            for (let i = 0; i < this._mainAssets.length; i++) {
                if (this._mainAssets[i].uri.substr(this._mainAssets[i].uri.length - 4) === 'json') {
                    count++;
                }
            }
            count += this._dataFiles.length;
            return count;
        };

        this._scenes = {
            splash: SplashScene,
            game: GameScene
        };

        this.launch();
    }

    /**
     * Launches loader scene
     */
    launch() {
        this.loader([
            //single sprite for our bar overlay
            {name: 'loading_bar', uri: './assets/' + 'textures' + '/' + 'loading_bar' + '.png'}
        ])
    }

    /**
     * The loader function loads main assets and displays progress to the user in a loader scene
     * which is destroyed afterwards and along with its base textures.
     * @param files
     */
    loader(files) {

        console.log("loader files loading");
        const loader = PIXI.loader;

        // loop through array and add them to loader
        for (let i = 0; i < files.length; i++) {
            loader.add(files[i].name, files[i].uri);
        }

        // loop through array and add data files to loader
        for (let i = 0; i < this._dataFiles.length; i++) {
            loader.add(this._dataFiles[i].name, this._dataFiles[i].uri);
        }

        //load files
        loader.load((loader, resources) => {
            Game.assets = resources;
            //loader loaded
            console.log("loader loaded");
            this.loadAssets(this._mainAssets);
            this._loaderScene = Application.createScene(Loader);
        });
    }

    /**
     * Load assets is the function that actually loads the main assets and tracks the progress.
     * @param files
     */
    loadAssets(files) {
        console.log("main files loading");
        const loader = PIXI.loader;

        // loop through array and add them to loader
        for (let i = 0; i < files.length; i++) {
            loader.add(files[i].name, files[i].uri);
        }

        //load files
        loader.load(() => {
            setTimeout(() => {
                //call some code once files are loaded
                console.log("files loaded");
                this._loaderScene.destroy();
                this._currentScene = Application.createScene(this._scenes.splash);
            }, 1000);
        });

        // count file loading progress
        const fileLength = files.length + this._fileCount() - this._dataFiles.length;
        loader.onProgress.add(() => {
            Game.loadProgress += 1 / fileLength;
        });
        // called once per loaded/errored file
        //loader.onError.add(() => {}); // called once per errored file
    }

    /**
     * Changes scene to string key passed to it and is accessible through a global function in Game class.
     * Make sure you have your scenes and keys added to this._scenes so you can access them.
     * @param name {string}
     */
    nextScene(name) {
        TweenMax.killAll();
        this._incomingScene = Application.createScene(this._scenes[name]);
        this.killScene();
    }

    /**
     * Kills currently active scene, if there is a transition defined in game global class it will trigger it.
     */
    killScene() {
        let cb = () => {
            this._currentScene.destroy();
            this._currentScene = null;
        };

        if (!Game.Transition) cb();
        else {
            Game.Transition.objIn = this._incomingScene;
            Game.Transition.transitionOut(this._currentScene, cb);
        }
    }

    /**
     * Creates and returns a new scene
     * @param sceneClass
     * @returns {*}
     */
    static createScene(sceneClass) {
        const scene = new sceneClass();
        Game.stage.addChild(scene);
        scene.start();
        Game.ticker.add(scene.update, scene);
        return scene;
    }
}