"use strict";

const BrowserWindow = require('electron').BrowserWindow;
const Menubar = require("menubar");
const log = require("electron-log");
class MenubarApp
{
    constructor()
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

            // this.menubar.setOption('alwaysOnTop', 'true');

            this.menubar.setOption('windowPosition' ,'center');
            this.menubar.setOption('showOnAllWorkspaces', 'true');
            this.menubar.window = new BrowserWindow(
                {
                    width: 400,
                    height: 300,
                    frame: false,
                    resizable: false,
                    center: true,
                    alwaysOnTop: true,
                    show: false
                });

            this.menubar.window.loadURL(contentPath);

            // document.addEventListener("keyup", (event) => {
            //     console.log("event" + event.keyCode());
            //     log.info("event" + event.keyCode());
            // });

        });
    }
}

module.exports = MenubarApp;