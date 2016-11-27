import {Observable, Disposable, Observer} from 'rx';

const makeGamepadDriver = () => () => Observable.create((observer: Observer<Gamepad>) => {
    let raf = window.requestAnimationFrame(function loop() {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            observer.onNext(gamepads[i]);
        }
        raf = window.requestAnimationFrame(loop);
    });
    return Disposable.create(() => window.cancelAnimationFrame(raf));
});

export { makeGamepadDriver };
