import {DeadzoneFunction} from './driver';

const AxialDeadzone = (deadzone: number): DeadzoneFunction => (value: number) => {
    if (Math.abs(value) < deadzone) {
        return 0;
    } else {
        return value;
    }
};

export { AxialDeadzone }
