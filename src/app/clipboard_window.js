"use strict";
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const clipboard = electron.clipboard;

// const clipboard_component = require('../public/clipboard_bundle.js');

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

    copyto()
    {
        clipboard_component.add("test");
    }

    pastefrom()
    {
        console.log("paste");
    }

    // Delegate isVisible function
    isVisible()
    {
        return this.win.isVisible();
    }

    // Delegate show function
    show()
    {
        return this.win.show();
    }

    // Delegate hide function
    hide()
    {
        return this.win.hide();
    }

    pop()
    {
        this.win.isVisible() ? this.win.hide() : this.win.show();
    }
}

module.exports = ClipboardWindow;
