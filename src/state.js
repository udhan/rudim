import {render, isObject} from './core';

class Store {
    constructor(){
    }

    attachDom (component, domElement) {
        Object.defineProperty(this, '__component', {
            value: component,
            writable:true,
            enumerable:false
        });

        Object.defineProperty(this, '__domElement', {
            value: domElement,
            writable:true,
            enumerable:false
        });

        // this.__component = component;
        // this.__domElement = domElement;
    }

    flush () {
        let parent = this.__domElement.parentElement;
        render([this.__component, this], parent, this.__domElement);
    };
}

export function rud(data) {
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if(isObject(data[key])){
                data[key] = rud(data[key]);
            }
        }
    }

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