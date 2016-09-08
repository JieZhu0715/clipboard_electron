const {app, BrowserWindow, nativeImage, Tray} = require('electron');
const path = require('path');

app.on("ready", () => {
    let image = nativeImage.createFromPath(path.join(__dirname, '../assets/status_bar_linux.png'));
    let tray = new Tray(image);
    let win = new BrowserWindow({width: 800, height: 600, frame: false});

    // menubar.window.loadURL(`file://${__dirname}/index.html`);
    const contentPath = `file://${__dirname}/clipboard.html`;
    win.on('close', function () { win = null })
    win.loadURL(contentPath);

    // Menubar onclick event listener
    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show()
    });
});
