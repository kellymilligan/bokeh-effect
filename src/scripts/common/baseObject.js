import { _, $ } from '../common';

export default {


    appConfig: null,
    windowData: null,
    mouseData: null,

    node: null,


    init(options) {

        this.appConfig = options.appConfig;
        this.windowData = options.windowData;
        this.mouseData = options.mouseData;

        this.node = options.node;

        this.setup( options );
    },

    setup(options) {},

    createChild( childObject, node = null, options = {} ) {

        let child = Object.create( childObject );

        child.init({

            appConfig: this.appConfig,
            windowData: this.windowData,
            mouseData: this.mouseData,
            node: node,
            localConfig: options
        });

        return child;
    },

    // Trickled to from parent
    resize() { this.onResize(); },
    mouseMove() { this.onMouseMove(); },
    animFrame() { this.onAnimFrame(); },

    // Abstract handlers
    onResize() {},
    onMouseMove() {},
    onAnimFrame() {}

};