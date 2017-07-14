import glMatrix from 'gl-matrix';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

export function getRotationXMatrix(radians) {

    return mat4.fromXRotation( mat4.create(), radians );
}

export function getRotationYMatrix(radians) {

    return mat4.fromYRotation( mat4.create(), radians );
}

export function getRotationZMatrix(radians) {

    return mat4.fromZRotation( mat4.create(), radians );
}

export function getScaleMatrix(scaleX = 1, scaleY = 1, scaleZ = 1) {

    return mat4.fromScaling( mat4.create(), vec3.fromValues( scaleX, scaleY, scaleZ ) );
}

export function getTranslationMatrix(x = 0, y = 0, z = 0) {

    return mat4.fromTranslation( mat4.create(), vec3.fromValues( x, y, z ) );
}

export function getSkewXMatrix(radians) {

    return mat4.fromValues( 1, 0, 0, 0, Math.tan( radians ), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 );
}

export function getSkewYMatrix(radians) {

     return mat4.fromValues( 1, Math.tan(radians), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 );
}

export function getIdentityMatrix() {

    return mat4.create();
}

export function getResultMatrix(matrices) {

    if ( matrices.length === 1 ) { return matrices[0]; }

    var result = mat4.create();

    for ( let i = 0, len = matrices.length; i < len; i++ ) {

        var current = matrices[ i ];
        mat4.multiply( result, result, current );
    }

    return result;
}

export function getTransformString(m, num_decimals = 5) {

    return 'matrix3d(' +
        m[ 0 ].toFixed( num_decimals ) + ',' + m[ 1 ].toFixed( num_decimals ) + ',' + m[ 2 ].toFixed( num_decimals ) + ',' + m[ 3 ].toFixed( num_decimals ) + ',' +
        m[ 4 ].toFixed( num_decimals ) + ',' + m[ 5 ].toFixed( num_decimals ) + ',' + m[ 6 ].toFixed( num_decimals ) + ',' + m[ 7 ].toFixed( num_decimals ) + ',' +
        m[ 8 ].toFixed( num_decimals ) + ',' + m[ 9 ].toFixed( num_decimals ) + ',' + m[ 10 ].toFixed( num_decimals ) + ',' + m[ 11 ].toFixed( num_decimals ) + ',' +
        m[ 12 ].toFixed( num_decimals ) + ',' + m[ 13 ].toFixed( num_decimals ) + ',' + m[ 14 ].toFixed( num_decimals ) + ',' + m[ 15 ].toFixed( num_decimals ) +
    ')';
}