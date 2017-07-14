import { _, $, BaseObject } from '../../common';

export default _.assign( _.create( BaseObject ), {


    setup(options) {

        console.log( options.local_config );
    },

    onResize() {

    },

    onMouseMove() {

    },

    onAnimFrame() {

    }

});