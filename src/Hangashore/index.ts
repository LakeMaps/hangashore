import {app, BrowserWindow} from 'electron';
import {Observable} from 'rxjs';

let w: any;
let isDevelopment = () => process.env.NODE_ENV === `development`;

Observable.fromEvent(app, `ready`)
    .subscribe(() => {
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

Observable.fromEvent(app, `window-all-closed`)
    .subscribe(() => {
        if (process.platform !== `darwin`) {
            app.quit();
        }
    });
