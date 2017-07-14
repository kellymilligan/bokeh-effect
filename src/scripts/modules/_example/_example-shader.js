import { _, $, BaseObject } from '../../common';

import * as THREE from 'three';

import VertexShader from 'raw!../../shaders/example-v.shader';
import FragmentShader from 'raw!../../shaders/example-f.shader';

export default _.assign( _.create( BaseObject ), {


    renderer: null,
    scene: null,
    camera: null,

    uniforms: null,

    material: null,
    mesh: null,


    setup() {

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize( this.window_data.width, this.window_data.height );
        this.renderer.setClearColor( 'rgb(37, 26, 48)', 1 );

        this.scene = new THREE.Scene();

        // this.camera = new THREE.PerspectiveCamera( 75, width / height, 1, 1000 );
        // this.camera.position.z = 100;

        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

        this.node.append( this.renderer.domElement );

        this.setupShader();

        this.resize();
        this.render();
    },

    setupShader() {

        this.uniforms = {
            time: { type: 'f', value: 1.0 },
            resolution: { type: 'v2', value: new THREE.Vector2() }
        };

        this.material = new THREE.ShaderMaterial(
        {
            uniforms: this.uniforms,
            vertexShader: VertexShader,
            fragmentShader: FragmentShader
        });

        this.mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), this.material );

        this.scene.add( this.mesh );
    },

    onResize() {

        this.uniforms.resolution.value = new THREE.Vector2( this.window_data.width, this.window_data.height );

        this.camera.aspect = this.window_data.ratio;
        this.camera.updateProjectionMatrix();

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.window_data.width, this.window_data.height );
    },

    onMouseMove() {

    },

    onAnimFrame() {

        this.render();
    },

    render() {

        this.uniforms.time.value = this.time;

        this.renderer.render( this.scene, this.camera );
    }

});