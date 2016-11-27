const {app, BrowserWindow} = require(`electron`);

let w: any;

app.on(`ready`, () => {
    w = new BrowserWindow({
        width: 1024,
        height: 768,
    });
    w.loadURL(`file://${__dirname}/index.html`);
    w.webContents.openDevTools();
    w.on(`closed`, () => w = null);
});

app.on(`window-all-closed`, () => {
    if (process.platform !== `darwin`) {
        app.quit();
    }
});
