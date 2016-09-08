"use strict";

const {app, BrowserWindow, nativeImage, Tray} = require('electron');
const path = require('path');

class TrayApp {
    constructor(clipboardWindow)
    {
        this.clipboardWindow = clipboardWindow;
        this._init();
    }

    _init()
    {
        // Init tray view
        let image = nativeImage.createFromPath(path.join(__dirname, '../assets/status_bar_linux.png'));
        image.setTemplateImage(true);
        this.tray = new Tray(image);
        this.tray.on("click", () =>
        {
            this.clipboardWindow.pop();
        });
    }

    _registerHotKeys()
    {

    }
}

module.exports = TrayApp;
