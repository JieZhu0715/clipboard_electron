const electron = require('electron');
const Menubar = require('menuBar');

const menubar = Menubar();

menubar.on('ready', function() {
    console.log("menubar app is ready");
});

menubar.on('after-create-window', function () {
    menubar.window.loadURL(`file://${__dirname}/index.html`);
});
