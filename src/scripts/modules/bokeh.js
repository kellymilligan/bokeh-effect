import { _, $, BaseObject } from '../common';

export default _.assign( _.create( BaseObject ), {


    canvas      : null,
    ctx         : null,

    pixel_ratio : 1,

    invalidated : false,


    setup() {

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.node.append( this.canvas );

        this.resize();
    },

    onResize() {

        this.pixel_ratio = window.devicePixel_ratio || 1;

        this.canvas.width = this.window_data.width * this.pixel_ratio;
        this.canvas.height = this.window_data.height * this.pixel_ratio;

        this.canvas.style.width = this.window_data.width + 'px';
        this.canvas.style.height = this.window_data.height + 'px';

        this.ctx.scale( this.pixel_ratio, this.pixel_ratio );
    },

    onMouseMove() {

    },

    onAnimFrame() {

        this.draw();
    },

    draw() {

        this.ctx.fillStyle = "rgb(12, 227, 185)";
        this.ctx.fillRect(
            this.mouse_data.x - 5,
            this.mouse_data.y - 5,
            10,
            10
        );
    }

});