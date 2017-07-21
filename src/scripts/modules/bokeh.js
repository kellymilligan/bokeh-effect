import { _, $, BaseObject } from '../common';

import { TWO_PI, PI, HALF_PI } from '../utils/math/constants';
import * as Easing from '../utils/math/easing';
import drawPolygon from '../utils/canvas/draw_polygon';
import simpleEase from '../utils/math/simple_ease';
import distance from '../utils/math/distance_2d';

const INSTANCES = 1000;
const COLOURS = [
    '#f00',
    '#00f',
    '#0f0',
    '#ff0',
    '#f0f',
    '#0ff'
];

export default _.assign( _.create( BaseObject ), {


    canvas      : null,
    ctx         : null,
    comp_ctx    : null,

    pixel_ratio : 1,

    invalidated : false,

    instances      : null,
    instance_count : 0,

    cursor_speed   : 0,
    cursor_prev_x  : 0,
    cursor_prev_y  : 0,


    setup() {

        this.canvas = document.createElement( 'canvas' );
        this.ctx = this.canvas.getContext( '2d' );

        let comp_canvas = document.createElement( 'canvas' );
        this.comp_ctx = comp_canvas.getContext( '2d' );

        comp_canvas.width = 200;
        comp_canvas.height = 200;

        this.node.append( this.canvas );

        this.setupInstances();

        this.resize();
    },

    setupInstances() {

        this.instances = [];

        for ( var i = 0; i < INSTANCES; i++ ) {

            let x_start = Math.random() * 3 - 1.5;
            let y_start = Math.random() * 3 - 1.5;

            let instance = {

                time_offset: Math.random() * Date.now(),

                x_start: x_start,
                y_start: y_start,

                x_target: x_start,
                y_target: y_start,

                x: x_start,
                y: y_start,

                rot_target: 0,
                rot: 0,

                scale: 0.8 + Math.random() * 0.2,

                alpha: 1,

                colour: COLOURS[ Math.floor( Math.random() * COLOURS.length ) ]
            };

            this.instances.push( instance );
        }

        this.instance_count = this.instances.length;
    },

    // Handlers
    // --------

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

        this.calc( this.window_data.time );
        this.draw( this.ctx, this.window_data.time );
    },

    // Animate
    // -------

    calc(time) {

        this.cursor_speed += 0.05 * distance( this.mouse_data.n_x, this.mouse_data.n_y, this.cursor_prev_x, this.cursor_prev_y );
        this.cursor_prev_x = this.mouse_data.n_x;
        this.cursor_prev_y = this.mouse_data.n_y;

        this.cursor_speed *= 0.97;

        // Update isntances
        for ( let i = 0; i < this.instance_count; i++ ) {

            let instance = this.instances[ i ];

            instance.x_target = instance.x_start + 0.5 * this.mouse_data.n_x * ( 0.5 + Math.abs( instance.x_start ) * 0.5 );
            instance.y_target = instance.y_start + 0.5 * this.mouse_data.n_y * ( 0.5 + Math.abs( instance.y_start ) * 0.5 );

            instance.rot_target = this.mouse_data.n_x * ( 0.5 + Math.abs( instance.y_start ) * 0.5 ) * instance.scale;

            instance.x = simpleEase( instance.x, instance.x_target, 0.02, true );
            instance.y = simpleEase( instance.y, instance.y_target, 0.02, true );

            instance.rot = simpleEase( instance.rot, instance.rot_target, 0.01, true );

            instance.alpha = Math.max( 1 - distance( instance.x, instance.y, instance.x_start, instance.y_start ) * 2, 0 );
        }
    },

    draw(ctx, time) {

        // Trails
        ctx.save();
        {

            ctx.globalAlpha = 0.33;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        }
        ctx.restore();

        // Bokeh flares
        ctx.save();
        {

            // set coordinate space to center
            ctx.translate( ctx.canvas.width * 0.5, ctx.canvas.height * 0.5 );

            for ( let i = 0; i < this.instance_count; i++ ) {

                this.drawBokeh( ctx, this.instances[ i ], time );
            }

        }
        ctx.restore();
    },

    drawBokeh(ctx, instance, time) {

        let radius_min = 92 * instance.scale;
        let radius_max = 100 * instance.scale;
        let count = 1;//20;
        let alpha_step = 1 / count;

        ctx.save();
        {

            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = instance.colour;

            for ( let i = 0; i < count; i++ ) {

                let pos = Easing.easeOutCubic( i / count );

                drawPolygon(
                    ctx,
                    instance.x * ( ctx.canvas.width * 0.5 ),
                    instance.y * ( ctx.canvas.height * 0.5 ),
                    radius_min + ( radius_max - radius_min ) * pos,
                    10,
                    instance.rot * TWO_PI * 0.1 + ( pos * PI * 0.1 )
                );

                ctx.globalAlpha = this.cursor_speed * instance.alpha * alpha_step;
                ctx.fill();
            }

        }
        ctx.restore();
    }

     // drawBokeh(ctx, comp_ctx, instance, time) {

    //     let radius_min = 80 * instance.scale;
    //     let radius_max = 100 * instance.scale;
    //     let count = 10;//20;
    //     let alpha_step = 1 / count;

    //     comp_ctx.clearRect( 0, 0, comp_ctx.canvas.width, comp_ctx.canvas.height );

    //     comp_ctx.save();
    //     {

    //         comp_ctx.globalCompositeOperation = 'screen';
    //         comp_ctx.fillStyle = instance.colour;

    //         comp_ctx.translate( comp_ctx.canvas.width * 0.5, comp_ctx.canvas.height * 0.5 );

    //         for ( let i = 0; i < count; i++ ) {

    //             let pos = Easing.easeOutCubic( i / count );

    //             drawPolygon(
    //                 comp_ctx,
    //                 0,
    //                 0,
    //                 radius_min + ( radius_max - radius_min ) * pos,
    //                 10,
    //                 instance.rot * ( PI + ( pos * PI ) ) * 0.1
    //             );

    //             comp_ctx.globalAlpha = alpha_step;
    //         }
    //             comp_ctx.fill();

    //     }
    //     comp_ctx.restore();

    //     ctx.save();
    //     {

    //         ctx.globalCompositeOperation = 'screen';
    //         ctx.globalAlpha = instance.alpha;

    //         let x = instance.x * ctx.canvas.width * 0.5;
    //         let y = instance.y * ctx.canvas.height * 0.5;
    //         let comp_half_w = comp_ctx.canvas.width * 0.5;
    //         let comp_half_h = comp_ctx.canvas.height * 0.5;

    //         ctx.drawImage(
    //             comp_ctx.canvas,
    //             x - comp_half_w,
    //             y - comp_half_h
    //         );

    //     }
    //     ctx.restore();
    // }

});