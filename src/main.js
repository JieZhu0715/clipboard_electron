const {app, BrowserWindow, Tray} = require('electron')

app.on("ready", () => {
    let tray = new Tray();
    let win = new BrowserWindow({width: 800, height: 600, frame: false});

    // menubar.window.loadURL(`file://${__dirname}/index.html`);
    const path = `file://${__dirname}/clipboard.html`;
    win.on('close', function () { win = null })
    win.loadURL(path);

    // Menubar onclick event listener
    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show()
    });
});
