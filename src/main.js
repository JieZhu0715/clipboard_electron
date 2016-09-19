"use strict";

const {app, clipboard} = require('electron');
const log = require('electron-log');

const TrayWindow = require('./app/tray.js');
const ClipboardWindow = require('./app/clipboard_window.js');
const MenubarApp = require('./app/menubar.js');
const ipc = require('electron').ipcMain

class ClipboardApp
{
    constructor()
    {
        this.clipboardWindow = null;
        this.tray = null;
        this.menubar = null;
        this.menubarWin = null;

        this.lastClip = null;       
    }

    start()
    {
        log.info("Starting...");
        this._initApp();
        this._initIPC();
        
        this._watchSystemClipboard();
    }

    _initApp()
    {
        // log.info("initilizing meubar...");
        // this.menubar = new MenubarApp();
        // // this.menubarWin = this.menubar.getWindow();
        // this.menubarWin = this.menubar.getWindow();
        // log.info("menubarWin" + this.menubarWin);

        app.on('ready', () => {
            this.clipboardWindow = new ClipboardWindow();
            this.trayWindow = new TrayWindow(this.clipboardWindow);
        });
    }

    _initIPC()
    {
        // Talking between processes
        ipc.on("copy-clipboard-item", (event, args) => 
        {   
            log.info("copy-clipboard-item" + args[0]);
            if(args.length > 0) 
            {
                clipboard.writeText(args[0]);
            }
        });
    }

    _watchSystemClipboard() 
    {   
        setInterval(() => {
            let message = clipboard.readText();
            if (!this.lastClip || (message && message != this.lastClip)) 
            {   
                log.info('New clipboard message: ' + message);    
                // this.clipboardWindow.send('add-to-clipboard', message, 'message');
                // Update last clip
                this.clipboardWindow.send('add-to-clipboard', message);
                this.lastClip = message;            
            }
        }, 500);
    }
}

// Start the app
new ClipboardApp().start();
