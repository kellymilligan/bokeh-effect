import { _, $, BaseObject } from '../../common';

import TweenMax from 'gsap';

import * as matrixHelpers from '../../utils/dom/matrix_helpers';
import applyCssTransform from '../../utils/dom/apply_css_transform';

export default Object.assign( Object.create( BaseObject ), {


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

        let time = this.windowData.time;

        let rotateZ = Math.sin( time * 0.0015 );

        let rotateZMatrix = matrixHelpers.getRotationZMatrix( rotateZ );
        let resultMatrix = matrixHelpers.getResultMatrix( [ rotateZMatrix ] );

        let matrixString = matrixHelpers.getTransformString( resultMatrix );

        applyCssTransform( this.child, matrixString );
    }

});