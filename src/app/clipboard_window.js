"use strict";
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const clipboard = electron.clipboard;

class ClipboardWindow {
    constructor()
    {
        this._init();
    }

    _init()
    {
        this.win = new BrowserWindow(
            {
                width: 800,
                height: 600,
                frame: false,
                resizable: false,
                center: true,
                autoHideMenuBar: true,
                alwaysOnTop: true,
                show: false
                // More properties to add
            });

        const contentPath = `file://${__dirname}/../clipboard.html`;
        this.win.on('close', function () { this.win = null })
        this.win.loadURL(contentPath);
    }

    send(channel, ...message) 
    {
        this.win.send(channel, message);
    }

    pop()
    {
        this.win.isVisible() ? this.win.hide() : this.win.show();
    }
}

module.exports = ClipboardWindow;
