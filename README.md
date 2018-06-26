# rudim

A rudimentory javascript framework

## Introduction

This is not so serious javascript framework with focus on simple API.
I am huge fan of simplicity of reagent framework and rudim's API is similar.

This is not for production and implemented awefully. It also works only on
latest browsers.

### Using rudim

Following is a sample counter component built using rudim. Additional examples can be found at udhan/rudim-example

    import { render, rud } from 'rudim';
    import { h1, h3, span, div, input } from 'rudim';

    let appState = rud({count: 0});

    function aCounter(state){
        return [div,
                [h1, 'Counter Example'],
                [h3, 'count: ', [span, state.count]],
                [input, {type: 'button',
                        value: 'Increment',
                        onclick:()=>state.count++}]]
    }

    function app(state){
        return [div,
                [aCounter, state]]
    }

    render([app, appState], document.getElementById('app'));
