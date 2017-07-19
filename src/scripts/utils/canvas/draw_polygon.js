/*
    Draw a symmetrical polygon on the provided canvas 2d context

    ctx           Context2D     Canvas context to draw to
    x             Number        X position at centre of circle
    y             Number        Y position at centre of circle
    r             Number        Radius of circle
    n             Number        Number of points that form the polygon, minimum of 3

    theta         Number        optional - Angle of rotation on the polygon in radians or degrees
    deg           Boolean       optional - Flag whether theta is passed in as degrees

*/

import pointOnCircle from '../math/point_on_circle';

export default function (

    ctx, x, y, r, n,

    theta = 0,
    deg = false

) {

    // Restrict point count to a minimum of 3
    n = Math.max( n, 3 );

    // Convert to radians if flagged as degrees
    if ( deg === true ) { theta = ( Math.PI / 180 ) * theta; }

    let points = [];

    // Find points on circle
    for ( let i = 0; i < n; i++ ) {

        // Start at -90 degrees to align first point to top
        let a = ( Math.PI * -0.5 ) + theta + ( ( 2 * Math.PI ) / n ) * i;

        let point = pointOnCircle( x, y, r, a );

        points.push( point.x );
        points.push( point.y );
    }

    // Draw polygon
    ctx.beginPath();
    ctx.moveTo( points[0], points[1] );

    for ( let i = 2, l = points.length; i < l - 1; i += 2 ) {

        ctx.lineTo( points[ i ], points[ i + 1 ] );
    }

    ctx.closePath();

};
