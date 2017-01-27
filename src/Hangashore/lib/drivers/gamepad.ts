import {Disposable, Observable, Observer} from 'rx';

const makeGamepadDriver = (id?: string) => () => Observable.create((observer: Observer<Gamepad>) => {
    let raf = window.requestAnimationFrame(function loop() {
        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (gamepad === undefined) {
                continue;
            }
            if (id && gamepad.id !== id) {
                continue;
            }
            observer.onNext(gamepad);
        }
        raf = window.requestAnimationFrame(loop);
    });
    return Disposable.create(() => window.cancelAnimationFrame(raf));
});

export { makeGamepadDriver };
