import {Observable} from 'rx';

const makeWirelessDriver = () => (data$: Observable<any>) => data$.subscribe(data => console.log(data));

export {makeWirelessDriver};
