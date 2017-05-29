import {app, BrowserWindow} from 'electron';

let w: any;
let isDevelopment = () => process.env.NODE_ENV === `development`;

app.on(`ready`, () => {
    w = new BrowserWindow({
        height: 768,
        width: 1024,
    });
    w.loadURL(`file://${__dirname}/index.html`);
    w.on(`closed`, () => w = null);
    if (isDevelopment()) {
        w.webContents.openDevTools();
    }
});

app.on(`window-all-closed`, () => {
    if (process.platform !== `darwin`) {
        app.quit();
    }
});
