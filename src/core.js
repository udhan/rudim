function createElement(tag) {
    return document.createElement(tag.toString().slice(7, -1));
}

export function isObject(obj) {
    return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
}

function componentType(component) {
    if (!Array.isArray(component) || component.length <= 0) {
        throw 'component must be defined as non empty array';
    }

    let compType = typeof component[0];

    switch (compType) {
        case 'function':
            if (component.length < 2) {
                return 'function-ns';
            } else {
                return 'function';
            }
        case 'symbol':
            return 'symbol';
        default:
            throw `component of type ${compType} is not supported`;
    }
}

function funcComponentHandler(component, hasState, reRender=false) {
    let f = component[0];
    let state = component[1];
    let view;

    if(hasState){
        view = f(state);
    }else{
        view = f();
    }
    
    let dComp = domComponent(view);

    if(!reRender){
        state.attachDom(f, dComp);
    }
    return dComp;
}

function tagComponentHandler(tag, options) {
    // create dom element
    let domEle = createElement(tag);

    // attach options
    for (let attr in options) {
        if(attr === 'e'){
            let event = options[attr];
            let eOptions = event.options || {};
            domEle.addEventListener(event.type, event.listener, eOptions);
        } else {
            domEle.setAttribute(attr, options[attr]);
        }
    }

    return domEle;
}

export function domComponent(component, reRender=false) {

    let compType = componentType(component);

    if (compType === 'function') {
        return funcComponentHandler(component, true, reRender);
    }else if(compType === 'function-ns'){
        return funcComponentHandler(component, false, reRender);
    }

    // compType is symbol
    let tag = component[0];
    let options = {};
    let childStartIndex = 1;

    if (isObject(component[1])) {
        options = component[1];
        childStartIndex = 2;
    }

    // create main element
    let domEle = tagComponentHandler(tag, options);

    // Attach child elements
    for (let i = childStartIndex; i < component.length; i++) {

        let item = component[i];

        if (Array.isArray(item)) {
            domEle.appendChild(domComponent(item));
        } else {
            let childEle = document.createTextNode(item);
            domEle.appendChild(childEle);
        }
    }

    return domEle;
}

export function render(component, rootEle, oldEle, reRender=false) {
    if (oldEle) {
        rootEle.replaceChild(domComponent(component, reRender), oldEle);
    } else {
        rootEle.appendChild(domComponent(component, reRender));
    }
}