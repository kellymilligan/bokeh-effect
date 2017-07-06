import { _, $ } from './common';
import HomePage from './pages/home_page';

import detect_ie from './utils/dom/detect_ie';

export default function () {


    const BASE_WIDTH = 1440;
    const MAX_WIDTH_MOBILE = 599;

    const IE = detect_ie();

    let appConfig, windowData, mouseData, ui;

    let pages, trickleList;
    let trickleLength = 0;

    start();


    // Setup
    // -----

    function start() {

        ui = {

            window   : $(window),
            document : $(document),
            html     : $(document.documentElement),
            root     : $('.js-root')
        };

        appConfig = {

            IS_MOBILE: window.innerWidth <= MAX_WIDTH_MOBILE,
            IS_IOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
            IS_SAFARI: navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1,
            IS_IE: IE.flag,
            IS_IE_EDGE: IE.flag && IE.version === "Edge",
            IS_IE_11: IE.flag && IE.version === "11",
            IS_IE10_OR_BELOW: IE.flag && IE.version === "<=10"
        };

        windowData = {

            width: 0,
            height: 0,
            ratio: 0,
            scale: 0,
            time: 0
        };

        mouseData = {

            x: 0,
            y: 0,
            nX: 0,
            nY: 0
        };

        // Set up children
        trickleList = [];

        createPages();

        trickleLength = trickleList.length;

        // Bind events
        addEvents();

        // Initial resize
        onResize();

        // Start anim frame
        _.defer( function () { window.requestAnimationFrame( onAnimFrame ); } );
    }

    function createPages() {

        pages = {

            home: Object.create( HomePage )
        };

        pages.home.init({ 'node': ui.root.find('.js-home'), 'appConfig': appConfig, 'windowData': windowData, 'mouseData': mouseData });

        _.each( pages, (page) => trickleList.push( page ) );
    }

    function addEvents() {

        ui.window.on( 'load', onLoad );
        ui.window.on( 'resize', onResize );

        ui.document.on( 'mousemove', onMouseMove );
        ui.document.on( 'touchstart', onTouchStart );
        ui.document.on( 'touchmove', onTouchMove );
    }


    // Handlers
    // --------

    function onLoad() {

    }

    function onResize() {

        windowData.width = ui.window.width();
        windowData.height = ui.window.height();
        windowData.ratio = windowData.width / windowData.height;
        windowData.scale = windowData.width / BASE_WIDTH;

        ui.html[0].style.fontSize = 10 * windowData.scale + 'px';

        trickle( 'resize' );
    }

    function onMouseMove(e) {

        mouseData.x = e.clientX;
        mouseData.y = e.clientY;

        mouseData.nX = ( mouseData.x / windowData.width ) * 2 - 1;
        mouseData.nY = ( mouseData.y / windowData.height ) * 2 - 1;

        trickle( 'mouseMove' );
    }

    function onTouchStart(e) {

        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;

        onMouseMove( e );
    }

    function onTouchMove(e) {

        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;

        onMouseMove( e );
    }

    function onAnimFrame(t) {

        windowData.time = Date.now();

        trickle( 'animFrame' );

        window.requestAnimationFrame( onAnimFrame );
    }


    // Trickle
    // -------

    function trickle(name) {

        for ( var i = 0; i < trickleLength; i++ ) {

            trickleList[ i ][ name ]( arguments );
        }
    }

}