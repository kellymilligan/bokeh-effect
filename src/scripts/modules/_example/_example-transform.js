import { _, $, BaseObject } from '../../common';

import TweenMax from 'gsap';

import * as matrixHelpers from '../../utils/dom/matrix_helpers';
import applyCssTransform from '../../utils/dom/apply_css_transform';

export default _.assign( _.create( BaseObject ), {


    active: false,


    setup(options) {

        this.child = document.createElement( 'div' );
        this.child.style.cssText = 'position: absolute; left: 40%; top: 40%; width: 20%; height: 20%; background: #f00;';
        $( this.child ).appendTo( this.node );

        this.activate();
    },

    activate() {

        if ( this.active ) { return; }
        this.active = true;

        //
    },

    deactivate() {

        if ( !this.active ) { return; }
        this.active = false;

        //
    },

    onResize() {

    },

    onMouseMove() {

    },

    onAnimFrame() {

        if ( !this.active ) { return; }

        this.draw();
    },

    draw() {

        let time = this.window_data.time;

        let rotate_z = Math.sin( time * 0.0015 );

        let rotate_z_matrix = matrixHelpers.getRotationZMatrix( rotate_z );
        let result_matrix = matrixHelpers.getResultMatrix( [ rotate_z_matrix ] );

        let matrix_string = matrixHelpers.getTransformString( result_matrix );

        applyCssTransform( this.child, matrix_string );
    }

});