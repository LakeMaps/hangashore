const {app, BrowserWindow} = require(`electron`);

let w: any;

app.on(`ready`, () => {
    w = new BrowserWindow({
        height: 768,
        width: 1024,
    });
    w.loadURL(`file://${__dirname}/index.html`);
    w.on(`closed`, () => w = null);
});

app.on(`window-all-closed`, () => {
    if (process.platform !== `darwin`) {
        app.quit();
    }
});
