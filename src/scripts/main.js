import { _, $ } from './common';
import HomePage from './pages/home_page';

import detect_ie from './utils/dom/detect_ie';

import clamp from './utils/math/clamp';

export default function () {


    const BASE_WIDTH = 1440;
    const MAX_WIDTH_MOBILE = 599;

    const IE = detect_ie();

    const TIME_START = Date.now();

    let app_config, window_data, mouse_data, gyro_data;
    let ui;
    let pages;
    let flow_list, flow_length = 0;

    start();


    // Setup
    // -----

    function start() {

        ui = {

            window   : $( window ),
            document : $( document ),
            html     : $( document.documentElement ),
            root     : $( '.js-root' )
        };

        app_config = {

            IS_MOBILE: window.innerWidth <= MAX_WIDTH_MOBILE,
            IS_IOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
            IS_SAFARI: navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1,
            IS_IE: IE.flag,
            IS_IE_EDGE: IE.flag && IE.version === "Edge",
            IS_IE_11: IE.flag && IE.version === "11",
            IS_IE10_OR_BELOW: IE.flag && IE.version === "<=10"
        };

        window_data = {

            width: 0,
            height: 0,

            ratio: 0,
            scale: 0,

            doc_height: 0,
            scroll: 0,

            time: 0,
            time_elapsed: 0
        };

        mouse_data = {

            x: 0,
            y: 0,

            n_x: 0,
            n_y: 0
        };

        gyro_data = {

            available: false,

            // raw
            a: 0,
            b: 0,
            g: 0,

            // starting
            s_a: 0,
            s_b: 0,
            s_g: 0,

            // normalised
            n_a: 0,
            n_b: 0,
            n_g: 0
        };

        // Set up children
        flow_list = [];
        createPages();
        flow_length = flow_list.length;

        // Bind events
        addEvents();

        // Initial resize
        onResize();

        // Start anim frame
        _.defer( function () { window.requestAnimationFrame( onAnimFrame ); } );
    }

    function createPages() {

        pages = {

            home: createPage( HomePage, ui.root.find( '.js-home' ) ),
        };
    }

    function addEvents() {

        ui.window.on( 'load', onLoad );
        ui.window.on( 'resize', onResize );
        ui.window.on( 'scroll', onScroll );

        ui.document.on( 'mousemove', onMouseMove );
        ui.document.on( 'touchstart', onTouchStart );
        ui.document.on( 'touchmove', onTouchMove );

        ui.window.on( 'deviceorientation', onDeviceOrientation );
    }


    // Helpers
    // -------

    function createPage(PageObject, node = null, options = {}) {

        let page = _.create( PageObject );

        page.init({

            app_config: app_config,
            window_data: window_data,
            mouse_data: mouse_data,
            gyro_data: gyro_data,
            node: node,
            local_config: options
        });

        flow_list.push( page );

        return page;
    }

    function flow(name) {

        for ( var i = 0; i < flow_length; i++ ) {

            flow_list[ i ][ name ]( arguments );
        }
    }


    // Handlers
    // --------

    function onLoad() {

    }

    function onResize() {

        // Dimensions
        window_data.width = ui.window.width();
        window_data.height = ui.window.height();
        window_data.ratio = window_data.width / window_data.height;
        window_data.doc_height = ui.document.height();

        // Scale
        window_data.scale = window_data.width / BASE_WIDTH;
        ui.html[0].style.fontSize = 10 * window_data.scale + 'px';

        // State
        app_config.IS_MOBILE = window_data.width <= MAX_WIDTH_MOBILE;

        flow( 'resize' );
    }

    function onScroll() {

        window_data.scroll = window_data.scroll_top / ( window_data.doc_height - window_data.height );

        flow( 'scroll' );
    }

    function onMouseMove(e) {

        mouse_data.x = e.clientX;
        mouse_data.y = e.clientY;

        mouse_data.n_x = ( mouse_data.x / window_data.width ) * 2 - 1;
        mouse_data.n_y = ( mouse_data.y / window_data.height ) * 2 - 1;

        flow( 'mouseMove' );
    }

    function onTouchStart(e) {

        e.clientX = e.touches[ 0 ].clientX;
        e.clientY = e.touches[ 0 ].clientY;

        onMouseMove( e );
    }

    function onTouchMove(e) {

        e.clientX = e.touches[ 0 ].clientX;
        e.clientY = e.touches[ 0 ].clientY;

        onMouseMove( e );
    }

    function onDeviceOrientation(e) {

        // Initial state
        if ( !gyro_data.available && e.alpha && e.beta && e.gamma ) {

            gyro_data.available = true;
            gyro_data.s_a = e.alpha;
            gyro_data.s_b = e.beta;
            gyro_data.s_g = e.gamma;
        }

        // Raw values
        gyro_data.a = e.alpha;
        gyro_data.b = e.beta;
        gyro_data.g = e.gamma;

        // Normalise and adjust for starting values
        gyro_data.n_a = clamp( ( gyro_data.a - gyro_data.s_a ) / 90, -1, 1 );
        gyro_data.n_b = clamp( ( gyro_data.b - gyro_data.s_b ) / 90, -1, 1 );
        gyro_data.n_g = clamp( ( gyro_data.g - gyro_data.s_g ) / 90, -1, 1 );

        flow( 'accelChange' );
    }

    function onAnimFrame(t) {

        window_data.time = Date.now();
        window_data.time_elapsed = window_data.time - TIME_START;

        flow( 'animFrame' );

        window.requestAnimationFrame( onAnimFrame );
    }

}