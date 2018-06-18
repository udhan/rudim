import {render} from './core';

class Store {
    constructor(){
    }

    attachDom (component, domElement) {
        this.__component = component;
        this.__domElement = domElement;
    }

    flush () {
        let parent = this.__domElement.parentElement;
        render([this.__component, this], parent, this.__domElement);
    };
}

export function rud(data) {
    let rstore = new Store();
    let rData = Object.assign(rstore, data);

    return new Proxy(rData, {
        set: function (target, key, val) {
            target[key] = val;
            // Property updated, update view
            if (!key.startsWith('__')){
                target.flush();
            }

            return true;
        }
    });
}