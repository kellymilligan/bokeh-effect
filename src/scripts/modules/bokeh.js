import { BaseObject } from '../common';

import Tween from '../utils/math/tween';

import { TWO_PI, PI, HALF_PI } from '../utils/math/constants';
import * as Easing from '../utils/math/easing';
import drawCircle from '../utils/canvas/draw_circle';
import simpleEase from '../utils/math/simple_ease';
import distance from '../utils/math/distance_2d';
import clamp from '../utils/math/clamp';
import sign from '../utils/math/sign';

import LOGO_BASE64 from './logo';

const MIN_INSTANCES = 20;
const MAX_INSTANCES = 150;

// Add more instances the wider the screen is, based on 100 at 1440px wide
const INSTANCES = clamp( Math.round( 100 * ( window.innerWidth / 1440 ) ), MIN_INSTANCES, MAX_INSTANCES );

const COLOURS = [
    // RED
    {
        ratio: 0.8,
        pool: [
            '#f01f1f',
            '#f01f5a',
            '#ff002a',
            '#ed1111',
        ]
    },
    // YELLOW
    {
        ratio: 0.85,
        pool: [
            '#fccd4a',
            '#ffc113',
        ]
    },
    // WHITE
    {
        ratio: 0.95,
        pool: [
            '#fcfaf4',
            '#f9f3db',
            '#f8eec8',
            '#f5dea2',
        ]
    },
    // OTHER
    {
        ratio: 1.0,
        pool: [
            '#ff4c00', // orange
            '#f86b2f', // orange
            '#0f4aaa', // blue
            '#407fbd', // blue
            '#3b895f', // green
            '#ffc113', // cyan
        ]
    }
];


export default Object.assign( Object.create( BaseObject ), {


    canvas: null,
    ctx: null,

    pixel_ratio: 1,

    instances: null,
    instance_count: 0,

    cursor_speed: 0,
    cursor_prev_x: 0,
    cursor_prev_y: 0,

    logo_image: null,
    logo_width: 0,
    logo_height: 0,

    sequence_tween: null,
    sequence_progress: 0,
    sequence_alpha: 0,


    // Setup
    // -----

    setup() {

        this.canvas = document.createElement( 'canvas' );
        this.ctx = this.canvas.getContext( '2d' );

        this.node.appendChild( this.canvas );

        this.setupLogo();
        this.setupInstances();

        this.canvas.style.position = 'fixed';
        this.canvas.style.left = 0;
        this.canvas.style.top = 0;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = 99999;

        this.resize();

        setTimeout( () => {
            this.runSequence();
        }, 500 );
    },

    setupLogo() {

        let SCALE = 0.25;

        this.logo_image = document.createElement( 'img' );
        this.logo_image.src = LOGO_BASE64;
        // Use fixed dimensions as naturalWidth/Height sometimes returning as zero
        this.logo_width = 512 * SCALE; // this.logo_image.naturalWidth * SCALE;
        this.logo_height = 481 * SCALE; // this.logo_image.naturalHeight * SCALE;
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

                x_target: x_start - 0.15,
                y_target: y_start - 0.15,

                x: x_start - 0.15,
                y: y_start - 0.15,

                scale: 0.9 + Math.random() * 0.2,

                alpha: 1,

                colour: this.getColour( COLOURS )
            };

            this.instances.push( instance );
        }

        this.instance_count = this.instances.length;
    },

    destroy() {

        this.instances = [];
        this.logo_image = null;
        this.ctx = null;
        this.canvas = null;
    },


    // Sequencing
    // ----------

    runSequence() {

        this.sequence_tween = new Tween(
            6000,
            'easeInOutCubic',
            (value, progress) => { this.sequence_progress = progress; },
            () => {

                this.sequence_tween = null;
                this.parent_destroy();
            }
        );

        this.sequence_tween.start();
    },


    // Handlers
    // --------

    onResize() {

        this.pixel_ratio = window.devicePixelRatio ? Math.min( window.devicePixelRatio, 2 ) : 1;

        this.canvas.width = this.window_data.width;// * this.pixel_ratio;
        this.canvas.height = this.window_data.height;// * this.pixel_ratio;

        this.canvas.style.width = this.window_data.width + 'px';
        this.canvas.style.height = this.window_data.height + 'px';

        // this.ctx.scale( this.pixel_ratio, this.pixel_ratio );
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

        let sequence_pos = this.sequence_progress * 2 - 1;

        this.sequence_alpha = Easing.easeOutCubic( 1 - Math.abs( sequence_pos ) );

        this.cursor_speed += 0.03 * distance( this.mouse_data.n_x, this.mouse_data.n_y, this.cursor_prev_x, this.cursor_prev_y );
        this.cursor_speed = Math.min( this.cursor_speed, 0.12 );
        this.cursor_prev_x = this.mouse_data.n_x;
        this.cursor_prev_y = this.mouse_data.n_y;

        this.cursor_speed *= 0.98;

        // Update isntances
        for ( let i = 0; i < this.instance_count; i++ ) {

            let instance = this.instances[ i ];
            let magnitude = this.gyro_data.available ? 1 : 0.15;

            let input_x = this.gyro_data.available ? this.gyro_data.n_g : this.mouse_data.n_x;
            let input_y = this.gyro_data.available ? this.gyro_data.n_b : this.mouse_data.n_y;

            let interactive_x = instance.x_start + magnitude * input_x * -1 * ( 0.3 + 0.7 * Math.abs( instance.x_start ) );
            let interactive_y = instance.y_start + ( magnitude / this.window_data.ratio ) * input_y * ( 0.5 + Math.abs( instance.y_start ) * 0.5 );

            let sequence_x = Easing.easeOutCubic( Math.abs( sequence_pos ) ) * sign( sequence_pos );
            let sequence_y = Easing.easeOutCubic( Math.abs( sequence_pos ) ) * sign( sequence_pos );

            instance.x_target = interactive_x + sequence_x * 0.2;
            instance.y_target = interactive_y + sequence_y * 0.2;

            instance.x = simpleEase( instance.x, instance.x_target, 0.02, true );
            instance.y = simpleEase( instance.y, instance.y_target, 0.02, true );

            instance.alpha = Math.max( 1 - distance( instance.x, instance.y, instance.x_start, instance.y_start ) * 2, 0 );
        }
    },

    draw(ctx, time) {

        // Trails
        ctx.save();
        {

            ctx.globalAlpha = 0.3;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        }
        ctx.restore();

        // Artwork
        ctx.save();
        {

            // set coordinate space to center
            ctx.translate( this.window_data.width * 0.5, this.window_data.height * 0.5 );

            // Bokeh flares
            for ( let i = 0; i < this.instance_count; i++ ) {

                this.drawBokeh( ctx, this.instances[ i ], time );
            }

            // Hakkasan logo
            this.drawLogo( ctx, time );

        }
        ctx.restore();

        this.drawFader( ctx );
    },

    drawBokeh(ctx, instance, time) {

        let offset = 50;
        let radius = 100 * ( instance.scale
            // Scale to x position
            + clamp( Math.abs( instance.x ), 0, 1 ) * -0.15
            // Scale to x position and sequence alpha
            + ( 1 - this.sequence_alpha ) * 0.6 * Math.abs( instance.x ) );

        ctx.save();
        {

            let x = instance.x * ( this.window_data.width * 0.5 );
            let y = instance.y * ( this.window_data.height * 0.5 );

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

            drawCircle(
                ctx,
                x,
                y,
                radius
            );

            ctx.globalAlpha = this.sequence_alpha * ( ( this.cursor_speed + 0.07 * this.sequence_alpha ) * instance.alpha * 0.98 + 0.02 * Math.random() );
            ctx.fill();

        }
        ctx.restore();
    },

    drawLogo(ctx, time) {

        ctx.save();
        {

            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.25 * this.sequence_alpha;
            ctx.drawImage( this.logo_image, this.logo_width * -0.5, this.logo_height * -0.5, this.logo_width, this.logo_height );

        }
        ctx.restore();
    },

    drawFader( ctx ) {

        // This fade helps to round off the residual trails from the multiply composite above.
        // Using this we can fade to a full #000 black at the very end.

        const FADE_RANGE = 0.2;

        if ( this.sequence_progress > ( 1 - FADE_RANGE ) ) {

            ctx.save();
            {

                ctx.fillStyle = 'black';
                ctx.globalCompositeOperation = 'darken';
                ctx.globalAlpha = Easing.easeInCubic( Math.max( this.sequence_progress - ( 1 - FADE_RANGE ), 0 ) / FADE_RANGE );
                ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

            }
            ctx.restore();
        }
    },


    // Helpers
    // -------

    getColour(palette) {

        let pool_selector = Math.random();
        let pool_ratio = 0;

        for ( let i = 0; i < palette.length; i++ ) {

            let group = palette[ i ];

            if ( pool_selector <= group.ratio ) {

                return group.pool[ Math.floor( Math.random() * group.pool.length ) ];
            }
        }
    }

});