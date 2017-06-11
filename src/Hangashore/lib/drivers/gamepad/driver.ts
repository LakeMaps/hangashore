import {adapt} from '@cycle/run/lib/adapt';
import {Observable, Observer} from 'rxjs';

export type DeadzoneFunction = (value: number) => number;

export type Config = {
    id?: string,
    deadzone: DeadzoneFunction,
};

const AxesProxyHandler = (deadzone: DeadzoneFunction): ProxyHandler<number[]> => ({
    get(axes: number[], k: string) {
        const idx = Number(k);
        if (!isNaN(idx)) {
            return deadzone(axes[idx]);
        } else {
            return (<any> axes)[k];
        }
    },
});

const GamepadButtonProxyHandler = (deadzone: DeadzoneFunction): ProxyHandler<GamepadButton> => ({
    get(button: GamepadButton, k: string) {
        if (k === `value`) {
            return deadzone(button.value);
        } else {
            return (<any> button)[k];
        }
    },
});

const ButtonsProxyHandler = (deadzone: DeadzoneFunction): ProxyHandler<GamepadButton[]> => ({
    get(buttons: GamepadButton[], k: string) {
        const idx = Number(k);
        if (!isNaN(idx)) {
            return new Proxy(buttons[idx], GamepadButtonProxyHandler(deadzone));
        } else {
            return (<any> buttons)[k];
        }
    },
});

const GamepadProxy = (deadzone: DeadzoneFunction): ProxyHandler<Gamepad> => ({
    get(gamepad: Gamepad, k: string) {
        if (k === `axes`) {
            return new Proxy(gamepad.axes, AxesProxyHandler(deadzone));
        }

        if (k === `buttons`) {
            return new Proxy(gamepad.buttons, ButtonsProxyHandler(deadzone));
        }

        return (<any> gamepad)[k];
    },
});

function poll(config: Config, observer: Observer<Gamepad>) {
    const gamepads = Array.from(navigator.getGamepads());
    for (const gamepad of gamepads) {
        if (gamepad === undefined) {
            continue;
        }
        if (gamepad === null) {
            continue;
        }
        if (config.id && gamepad.id !== config.id) {
            continue;
        }
        observer.next(new Proxy(gamepad, GamepadProxy(config.deadzone)));
    }
}

const driver = (config: Config) => Observable.create((observer: Observer<Gamepad>) => {
    const f = poll.bind(null, config, observer);
    let raf = window.requestAnimationFrame(function loop() {
        f();
        raf = window.requestAnimationFrame(loop);
    });
    return () => window.cancelAnimationFrame(raf);
});

const makeGamepadDriver = (config: Config) => () => adapt(driver(config));

export { makeGamepadDriver };
