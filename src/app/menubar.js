"use strict";

const BrowserWindow = require('electron').BrowserWindow;
const clipboard = require('electron').clipboard;
const Menubar = require("menubar");
const log = require("electron-log");

class MenubarApp
{
    constructor() 
    {
        this.menubar = null;
        this.window = null;
        this._init();
    }

    _init()
    {
        log.info("constructing menubar");
        this.menubar = new Menubar();

        log.info("register ready");
        this.menubar.on('ready', () =>
        {
            console.log("menubar app is ready");
            log.info("menubar app is ready");
        });

        this.menubar.on("after-create-window", () =>
        {
            const contentPath = `file://${__dirname}/../clipboard.html`;

            this.menubar.setOption('windowPosition' ,'center');
            this.menubar.setOption('showOnAllWorkspaces', 'true');
            // this.menubar.window = new BrowserWindow(
            // {
            //     width: 400,
            //     height: 300,
            //     frame: false,
            //     resizable: false,
            //     center: true,
            //     alwaysOnTop: true,
            //     show: false
            // });
            this.menubar.window.loadURL(contentPath);
        });

        this.window = this.menubar.window;
    }

    getWindow() 
    {   
        log.info("menubar window" + this.menubar.window);
        return this.menubar.window;
    }
}

module.exports = MenubarApp;