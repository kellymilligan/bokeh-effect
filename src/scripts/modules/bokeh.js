import { _, $, BaseObject } from '../common';

import { TWO_PI, PI, HALF_PI } from '../utils/math/constants';
import * as Easing from '../utils/math/easing';
import drawPolygon from '../utils/canvas/draw_polygon';
import drawCircle from '../utils/canvas/draw_circle';
import simpleEase from '../utils/math/simple_ease';
import distance from '../utils/math/distance_2d';
import clamp from '../utils/math/clamp';

const INSTANCES = 120;
const COLOURS = [
    // '#f00',
    // '#00f',
    // '#0f0',
    // '#ff0',
    // '#f0f',
    // '#0ff'

    '#fcfaf4', // white
    '#f9f3db', // white
    '#f8eec8', // white
    '#f5dea2', // white

    '#fccd4a', // yellow
    '#ffc113', // yellow
    '#0f4aaa', // blue
    '#407fbd', // blue

    '#3b895f', // green
    '#ffc113', // cyan
    '#ff4c00', // orange
    '#f86b2f', // orange

    '#f01f1f', // red
    '#f01f5a', // red
    '#ff002a', // red
    '#ed1111', // red

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

                scale: 0.9 + Math.random() * 0.2,

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
        this.cursor_speed = Math.min( this.cursor_speed, 0.15 );
        this.cursor_prev_x = this.mouse_data.n_x;
        this.cursor_prev_y = this.mouse_data.n_y;

        this.cursor_speed *= 0.98;

        // Update isntances
        for ( let i = 0; i < this.instance_count; i++ ) {

            let instance = this.instances[ i ];
            let magnitude = 0.5;

            instance.x_target = instance.x_start + magnitude * this.mouse_data.n_x * ( 0.3 + 0.7 * Math.abs( instance.x_start ) );
            instance.y_target = instance.y_start + ( magnitude / this.window_data.ratio ) * this.mouse_data.n_y * ( 0.5 + Math.abs( instance.y_start ) * 0.5 );

            // instance.rot_target = this.mouse_data.n_x * ( 0.5 + Math.abs( instance.y_start ) * 0.5 ) * instance.scale;

            instance.x = simpleEase( instance.x, instance.x_target, 0.02, true );
            instance.y = simpleEase( instance.y, instance.y_target, 0.02, true );

            // instance.rot = simpleEase( instance.rot, instance.rot_target, 0.01, true );

            instance.alpha = Math.max( 1 - distance( instance.x, instance.y, instance.x_start, instance.y_start ) * 2, 0 );
        }
    },

    draw(ctx, time) {

        // Trails
        ctx.save();
        {

            ctx.globalAlpha = 0.3;
            // ctx.fillStyle = '#201026';
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

        let offset = 50;
        let radius = 100 * ( instance.scale + clamp( Math.abs( instance.x ), 0, 1 ) * -0.15 );

        ctx.save();
        {

            let x = instance.x * ( ctx.canvas.width * 0.5 );
            let y = instance.y * ( ctx.canvas.height * 0.5 );

            let sharpness = clamp( ( Math.abs( instance.x ) + Math.abs( instance.y ) ) / 2, 0, 1 );

            ctx.globalCompositeOperation = 'lighter';

            let gradient = ctx.createRadialGradient(
                x + offset * instance.x,
                y + offset * instance.y,
                radius * 1.1,
                x,
                y,
                0
            );
            gradient.addColorStop( 0, '#000' );
            gradient.addColorStop( 0.2 - 0.05 * sharpness, instance.colour );
            gradient.addColorStop( 1, instance.colour );

            ctx.fillStyle = gradient;


            // drawPolygon(
            //     ctx,
            //     instance.x * ( ctx.canvas.width * 0.5 ),
            //     instance.y * ( ctx.canvas.height * 0.5 ),
            //     radius + ( radius_max - radius ) * pos,
            //     9,
            //     instance.rot * TWO_PI * 0.1 + ( pos * PI * 0.1 )
            // );

            drawCircle(
                ctx,
                x,
                y,
                radius
            );

            ctx.globalAlpha = this.cursor_speed * instance.alpha * 0.985 + 0.015 * Math.random();
            ctx.fill();

        }
        ctx.restore();
    }

});
