import Application from "./Application";

function Main(width, height) {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container.
    let app = new PIXI.Application(width, height);

    //store static globals in Common
    Game.renderer = app.renderer;
    Game.stage = app.stage;
    Game.view = app.view;
    Game.screen = app.screen;
    Game.ticker = app.ticker;
    Game.view.width = width;
    Game.view.height = height;
    Game.Bump = new Game.Bump();

    // The application creates a canvas element for you that you
    // can then insert into the DOM.
    document.body.appendChild(app.view);

    window.delay = function (cb, time) {
        TweenMax.delayedCall(time, cb);
    };

    new Application();
}

//gives us access to this file in our index.html
window.Main = Main;