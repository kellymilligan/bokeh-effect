import { _, $, BaseObject } from '../common';

import { TWO_PI, PI, HALF_PI } from '../utils/math/constants';
import * as Easing from '../utils/math/easing';
import drawPolygon from '../utils/canvas/draw_polygon';

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

        this.draw( this.ctx );
    },

    draw(ctx) {

        // ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        ctx.save();
        {

            ctx.globalAlpha = 0.33;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        }
        ctx.restore();

        ctx.save();
        {

            // ctx.globalAlpha = 0.01;
            ctx.globalCompositeOperation = 'lighter';
            // ctx.fillStyle = "rgb(12, 227, 185)";
            ctx.fillStyle = "rgb(255, 0, 0)";

            let radius_min = 90;
            let radius_max = 100;
            let count = 20;

            ctx.globalAlpha = 1 / count;

            for ( let i = 0; i < count; i++ ) {

                let pos = Easing.easeOutCubic( i / count );

                drawPolygon(
                    ctx,
                    this.mouse_data.x,
                    this.mouse_data.y,
                    radius_min + ( radius_max - radius_min ) * pos,
                    9,
                    ( TWO_PI * ( this.window_data.time + pos * 15000 ) * 0.00002 ) % TWO_PI
                );

                ctx.fill();
            }

        }
        ctx.restore();
    }

});