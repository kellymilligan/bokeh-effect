import { _, $, BaseObject } from '../common';

import Example from '../modules/_example/_example-basic.js';
// import Example from '../modules/_example/_example-transform.js';
// import Example from '../modules/_example/_example-canvas.js';
// import Example from '../modules/_example/_example-three.js';
// import Example from '../modules/_example/_example-shader.js';

export default Object.assign( Object.create( BaseObject ), {


    setup() {

        this.example = this.createChild( Example, $('.js-example'), { prop1: 10, prop2: 'value' } );
    },

    onResize() {

        this.example.resize();
    },

    onMouseMove() {

        this.example.mouseMove();
    },

    onAnimFrame() {

        this.example.animFrame();
    }

});