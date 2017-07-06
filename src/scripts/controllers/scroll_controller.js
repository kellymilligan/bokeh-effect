/*
  A singleton scroll controller for handling the window's scrollbar.
*/

const DEBUG = false;

class ScrollController {

    constructor() {

        if ( DEBUG ) console.log( 'ScrollController initialised.' );

        this.activated = false;

        this._window = window;
        this._document = document;
        this._body = document.body;
        this._expander = document.createElement( 'div' );

        this._position = 0;
        this._height = 0;

        this._position_stack = [];

        this._onWindowScroll = this._onWindowScroll.bind( this );
    }

    // Accessors

    getPosition() {

        return this._position;
    }

    getHeight() {

        return this._height;
    }

    // Bindings

    _attachEvents() {

        if ( DEBUG ) console.log( 'ScrollController._attachEvents' );

        this._window.addEventListener( 'scroll', this._onWindowScroll, false );
    }

    _detachEvents() {

        if ( DEBUG ) console.log( 'ScrollController._detachEvents' );

        this._window.removeEventListener( 'scroll', this._onWindowScroll, false );
    }

    _onWindowScroll() {

        let y = this._fetchScrollPosition();

        if ( DEBUG ) console.log( 'ScrollController._onWindowScroll: ', y );

        this._updatePosition( y );
    }

    // Internal state

    _activate( height ) {

        if ( DEBUG ) console.log( 'ScrollController._activate - requested...' );

        if ( this.activated ) { return; }
        this.activated = true;

        if ( DEBUG ) console.log( 'ScrollController._activate - ACTIVATED!' );

        this._attachEvents();
        this._updateHeight( height );
        this._body.appendChild( this._expander );
    }

    _deactivate() {

        if ( DEBUG ) console.log( 'ScrollController._deactivate - requested...' );

        if ( !this.activated ) { return; }
        this.activated = false;

        if ( DEBUG ) console.log( 'ScrollController._deactivate - DEACTIVATED!' );

        this._detachEvents();
        this._updateHeight( 0 );
        this._body.removeChild( this._expander );
    }

    // Helpers

    _fetchScrollPosition() {

        return this._window.pageYOffset || this._document.documentElement.scrollTop;
    }

    _updatePosition(y) {

        if ( y === undefined ) { console.warn( 'ScrollController._updatePosition called without the "y" argument' ); }

        this._position = y;
        this._window.scrollTo( 0, y );
    }

    _updateHeight(h) {

        if ( h === undefined ) { console.warn( 'ScrollController._updateHeight called without the "h" argument' ); }

        this._height = h;
        this._expander.style.height = h + 'px';
    }

    // Public methods
    // -------------------------------------------------------------------------

    capture( height ) {

        // Store the previous scroll position
        this._position_stack.push( this._fetchScrollPosition() );

        // Start listening to scroll and update the expander
        this._activate( height );
    }

    release (revert = true) {

        // Stop listening to scroll and remove the expander
        this._deactivate();

        // Return the scroll position to where it was before capture
        if ( revert ) { this._position_stack.pop(); }
    }

    resize( height ) {

        if ( !this.activated ) { return; }

        // Update the expander
        this._updateHeight( height );
    }

}

let instance = new ScrollController();
export default function () { return instance };