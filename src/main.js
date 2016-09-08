"use strict";

const {app} = require('electron');
const log = require('electron-log');

const TrayApp = require('./app/tray.js');
const ClipboardWindow = require('./app/clipboard_window.js');
const MenubarApp = require('./app/menubar.js');

class ClipboardApp {
    constructor()
    {
        this.clipboardWindow = null;
        this.tray = null;
        this.menubar = null;
    }

    start()
    {
        log.info("Starting...");
        this._initApp();
        this._initIPC();
    }

    _initApp()
    {
        // app.on("ready", () =>
        // {
        //     this.clipboardWindow = new ClipboardWindow();
        //     this.tray = new TrayApp(this.clipboardWindow);
        // });

        log.info("initilizing menubar...");
        this.menubar = new MenubarApp();

    }

    _initIPC()
    {
        // Talking between processes
    }
}

// Start the app
new ClipboardApp().start();
