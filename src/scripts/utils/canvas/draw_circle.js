/*

    Draw a circle on the provided canvas 2d context.
    By default a full, closed-path circle is drawn.

    ctx         context2D       Canvas context to draw to
    x           Number          X position at centre of circle
    y           Number          Y position at centre of circle
    r           Number          Radius of circle

    c           Boolean         optional - Close path flag
    sA          Number          optional - Start angle (in Radians)
    eA          Number          optional - End angle (in Radians)
    aC          Boolean         optional - Anti-clockwise flag
    deg         Boolean         optional - Flag whether angle is passed in as degrees

*/

export default function (

    ctx, x, y, r,

    c = true,
    sA = 0,
    eA = Math.PI * 2,
    aC = false,
    deg = false

) {

    // Convert to radians if flagged as degrees
    sA = deg === true ? sA * ( Math.PI / 180 ) : sA;
    eA = deg === true ? eA * ( Math.PI / 180 ) : eA;

    // Draw circle
    ctx.beginPath();
    ctx.arc( x, y, r, sA, eA, aC );
    if ( c ) { ctx.closePath(); }

}