import { _, $, BaseObject } from '../common';

import Bokeh from '../modules/bokeh.js';

export default _.assign( _.create( BaseObject ), {


    setup() {

        this.bokeh = this.createChild( Bokeh, $('.js-bokeh') );
    },

    onResize() {},
    onScroll() {},
    onAccelChange() {},
    onMouseMove() {},
    onAnimFrame() {}

});