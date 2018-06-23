function createElement(tag) {
    return document.createElement(tag.toString().slice(7, -1));
}

export function isObject(obj) {
    return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
}

function componentType(component){
    if(!Array.isArray(component) || component.length <= 0){
        throw 'component must be defined as non empty array';
    }

    let compType = typeof component[0];

    if((compType !== 'function' || component.length < 2) && 
        compType !== 'symbol'){
        throw `first element in component array must either be
               a function with second item as state or a tag`;
    }

    return compType;
}

function funcComponentHandler(component){
    let f = component[0];
    let state = component[1];

    let view = f(state);
    let dComp = domComponent(view);
    
    state.attachDom(f, dComp);
    
    return dComp;
}

function tagComponentHandler(tag, options){
    // create dom element
    let domEle = createElement(tag);

    // attach options
    // TODO: validations and more event support
    for (let attr in options) {
        if (attr == 'onclick') {
            domEle.addEventListener('click', options[attr]);
        } else {
            domEle.setAttribute(attr, options[attr]);
        }
    }

    return domEle;
}

export function domComponent(component) {

    let compType = componentType(component);

    if (compType === 'function') {
        return funcComponentHandler(component);
    }

    // compType is symbol
    let tag = component[0];
    let options = {};
    let childStartIndex = 1;

    if(isObject(component[1])){
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

export function render(component, rootEle, oldEle) {
    if(oldEle){
        rootEle.replaceChild(domComponent(component), oldEle);
    }else{
        rootEle.appendChild(domComponent(component));
    }
}