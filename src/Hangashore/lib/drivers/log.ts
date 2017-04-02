import {kebabCase} from 'lodash';
import {Observable} from 'rxjs';
import {Stream} from 'xstream';

const LocalForage = require(`localforage`);

type Config = {
    name: string,
    description?: string,
};

const makeLogDriver = (config: Config) => {
    const store = LocalForage.createInstance({
        description: config.description,
        driver: LocalForage.INDEXEDDB,
        name: kebabCase(config.name),
        storeName: kebabCase(`${config.name}-kv`),
    });
    return (data$: Stream<any>) => {
        (<Observable<any>> Observable.from(data$))
            .timestamp()
            .subscribe(data => {
                store.setItem(data.timestamp.toString(), data.value);
            });
    };
};

export {makeLogDriver};
