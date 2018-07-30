import { render, isObject } from './core';

export function rud(data) {
    if (isObject(data)) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (isObject(data[key]) || Array.isArray(data[key])) {
                    data[key] = rud(data[key]);
                }
            }
        }
    }

    Object.defineProperty(data, '__components', {
        value: [],
        writable: true,
        enumerable: false
    });

    data.attachDom = function (component, domElement) {
        console.log('Attaching dom', component);
        this.__components.push({ component: component, domElement: domElement });
    };

    data.flush =  function () {
        let comps = this.__components;
        this.__components = [];
        for (let i = 0; i < comps.length; i++) {
            let comp = comps[i].component;
            let domEle = comps[i].domElement;
            let parent = domEle.parentElement;
            console.log('Rendering', comp, this);
            render([comp, rud(data)], parent, domEle, false);
        }
    };

    return new Proxy(data, {
        set: function (target, key, val) {
            target[key] = val;

            if (!key.startsWith('__')) {
                console.log('Triggering flush for', target, key, val);
                target.flush();
            }

            return true;
        },

    });
}