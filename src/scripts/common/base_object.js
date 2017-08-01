export default {


    app_config: null,
    window_data: null,
    mouse_data: null,
    gyro_data: null,

    node: null,

    flow_list: null,
    flow_length: 0,


    init(options) {

        this.app_config = options.app_config;
        this.window_data = options.window_data;
        this.mouse_data = options.mouse_data;
        this.gyro_data = options.gyro_data;

        this.node = options.node;

        this.flow_list = [];

        this.setup( options );
    },

    // Abstract
    setup(options) {},

    createChild(ChildObject, node = null, options = {}) {

        let child = Object.create( ChildObject );

        child.init({

            app_config: this.app_config,
            window_data: this.window_data,
            mouse_data: this.mouse_data,
            gyro_data: this.gyro_data,
            node: node,
            local_config: options
        });

        this.flow_list.push( child );
        this.flow_length = this.flow_list.length;

        return child;
    },

    flow(name) {

        for ( var i = 0; i < this.flow_length; i++ ) {

            this.flow_list[ i ][ name ]( arguments );
        }
    },

    // Abstract
    beforeDestroy() {},

    destroy() {

        this.flow( 'destroy' );
        this.flow_list = null;

        this.app_config = null;
        this.window_data = null;
        this.mouse_data = null;
        this.gyro_data = null;
        this.node = null;
    },

    // Received from parent, pass to children
    resize() { this.flow( 'resize' ); this.onResize(); },
    scroll() { this.flow( 'scroll' ); this.onScroll(); },
    accelChange() { this.flow( 'accelChange' ); this.onAccelChange(); },
    mouseMove() { this.flow( 'mouseMove' ); this.onMouseMove(); },
    animFrame() {this.flow( 'animFrame' );  this.onAnimFrame(); },

    // Abstract handlers
    onResize() {},
    onScroll() {},
    onAccelChange() {},
    onMouseMove() {},
    onAnimFrame() {}

};