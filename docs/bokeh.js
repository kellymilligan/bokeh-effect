function clamp( val, min, max ) {
    return Math.min( Math.max( val, min ), max );
}

function distance( p1x, p1y, p2x, p2y ) {
    const dx = p2x - p1x;
    const dy = p2y - p1y;
    return Math.sqrt( dx * dx + dy * dy );
}

function simpleEase( current, target, ease_factor = 0.1, reduce = false ) {
    if ( reduce && Math.abs( target - current ) < 0.0002 ) { return target; }
    return current + ( target - current ) * ease_factor;
}

function drawCircle( ctx, x, y, r ) {
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.closePath();
}

const COUNT = 120;
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

class Bokeh {

    constructor() {

        this.onMouseMove = this.onMouseMove.bind( this );
        this.onResize = this.onResize.bind( this );
        this.onAnimFrame = this.onAnimFrame.bind( this );

        this.bounds = {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.innerWidth / window.innerHeight,
            dpr: window.devicePixelRatio,
            cursor: {
                speed: 0,
                prevX: 0,
                prevY: 0,
                x: 0,
                y: 0,
                normalX: 0,
                normalY: 0
            }
        };

        this.canvas = document.createElement( 'canvas' );
        this.ctx = this.canvas.getContext( '2d' );

        this.canvas.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
        `;

        document.body.append( this.canvas );

        this.setupInstances();

        window.addEventListener( 'mousemove', this.onMouseMove );
        window.addEventListener( 'resize', this.onResize );
        this.onResize();

        window.requestAnimationFrame( this.onAnimFrame );
    }

    setupInstances() {

        this.instances = [];

        for ( var i = 0; i < COUNT; i++ ) {

            let xStart = Math.random() * 3 - 1.5;
            let yStart = Math.random() * 3 - 1.5;

            let instance = {

                timeOffset: Math.random() * Date.now(),

                xStart: xStart,
                yStart: yStart,

                xTarget: xStart,
                yTarget: yStart,

                x: xStart,
                y: yStart,

                scale: 0.9 + Math.random() * 0.2,

                alpha: 1,

                colour: COLOURS[ Math.floor( Math.random() * COLOURS.length ) ]
            };

            this.instances.push( instance );
        }
    }

    // Handlers
    // --------

    onResize() {

        this.bounds.dpr = window.devicePixelratio || 1;
        this.bounds.width = window.innerWidth;
        this.bounds.height = window.innerHeight;

        this.canvas.width = this.bounds.width * this.bounds.dpr;
        this.canvas.height = this.bounds.height * this.bounds.dpr;

        this.canvas.style.width = this.bounds.width + 'px';
        this.canvas.style.height = this.bounds.height + 'px';

        this.ctx.scale( this.bounds.dpr, this.bounds.dpr );
    }

    onMouseMove( e ) {

        this.bounds.cursor.x = e.clientX;
        this.bounds.cursor.y = e.clientY;

        this.bounds.cursor.normalX = ( this.bounds.cursor.x / this.bounds.width ) * 2 - 1;
        this.bounds.cursor.normalY = ( this.bounds.cursor.y / this.bounds.height ) * 2 - 1;
    }

    onAnimFrame() {

        window.requestAnimationFrame( this.onAnimFrame );

        this.bounds.cursor.speed += 0.05 * distance( this.bounds.cursor.normalX, this.bounds.cursor.normalY, this.bounds.cursor.prevX, this.bounds.cursor.prevY );
        this.bounds.cursor.speed = Math.min( this.bounds.cursor.speed, 0.15 );
        this.bounds.cursor.prevX = this.bounds.cursor.normalX;
        this.bounds.cursor.prevY = this.bounds.cursor.normalY;
        this.bounds.cursor.speed *= 0.98;

        this.update();
        this.draw( this.ctx, performance.now() );
    }

    // Animate
    // -------

    update() {

        // Update isntances
        for ( let i = 0; i < COUNT; i++ ) {

            let instance = this.instances[ i ];
            let magnitude = 0.5;

            instance.xTarget = instance.xStart + magnitude * this.bounds.cursor.normalX * ( 0.3 + 0.7 * Math.abs( instance.xStart ) );
            instance.yTarget = instance.yStart + ( magnitude / this.bounds.ratio ) * this.bounds.cursor.normalY * ( 0.5 + Math.abs( instance.yStart ) * 0.5 );

            instance.x = simpleEase( instance.x, instance.xTarget, 0.02, true );
            instance.y = simpleEase( instance.y, instance.yTarget, 0.02, true );

            instance.alpha = Math.max( 1 - distance( instance.x, instance.y, instance.xStart, instance.yStart ) * 2, 0 );
        }
    }

    draw( ctx, time ) {

        // Trails
        ctx.save();
        {

            ctx.globalAlpha = 0.3;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        }
        ctx.restore();

        // Bokeh flares
        ctx.save();
        {

            // set coordinate space to center
            ctx.translate( ctx.canvas.width * 0.5, ctx.canvas.height * 0.5 );

            for ( let i = 0; i < COUNT; i++ ) {

                this.drawBokeh( ctx, this.instances[ i ], time );
            }

        }
        ctx.restore();
    }

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

            drawCircle(
                ctx,
                x,
                y,
                radius
            );

            ctx.globalAlpha = this.bounds.cursor.speed * instance.alpha * 0.985 + 0.015 * Math.random();
            ctx.fill();

        }
        ctx.restore();
    }

}

new Bokeh();
