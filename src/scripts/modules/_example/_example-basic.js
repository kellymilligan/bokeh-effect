import { _, $, BaseObject } from '../../common';

export default Object.assign( Object.create( BaseObject ), {


    setup(options) {

        console.log( options.localConfig );
    },

    onResize() {

    },

    onMouseMove() {

    },

    onAnimFrame() {

    }

});