import { render, isObject } from './core';

// class Store {
//     attachDom(component, domElement) {
//         Object.defineProperty(this, '__components', {
//             value: [],
//             writable: true,
//             enumerable: false
//         });
//         this.__components.push({ component: component, domElement: domElement });
//     }
//     flush() {
//         if (this.__components === undefined) {
//             return;
//         }

//         for (let i = 0; i < this.__components.length; i++) {
//             let comp = this.__components[i].component;
//             let domEle = this.__components[i].domElement;
//             let parent = domEle.parentElement;

//             render([comp, rud(this)], parent, domEle);
//         }
//     };
// }

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

    // let rstore = new Store();
    // let rData = Object.assign(rstore, data);
    //let rData = Object.assign({}, data);

    Object.defineProperty(data, '__components', {
        value: [],
        writable: true,
        enumerable: false
    });

    data.attachDom = function (component, domElement) {
        this.__components.push({ component: component, domElement: domElement });
    };

    data.flush =  function () {
        for (let i = 0; i < this.__components.length; i++) {
            let comp = this.__components[i].component;
            let domEle = this.__components[i].domElement;
            let parent = domEle.parentElement;

            render([comp, rud(this)], parent, domEle);
        }
    };

    return new Proxy(data, {
        set: function (target, key, val) {
            target[key] = val;
            if (!key.startsWith('__')) {
                target.flush();
            }

            return true;
        },

    });
}