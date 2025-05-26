import Cube from './cube.js'

const canvas = document.getElementById('canvas');

/** @type {WebGLRenderingContext} */
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGl not supported. User Chrome bro');
}

/** @type {Cube} */
const cube = new Cube(1);
const vertexData = cube.vertexData;

// USEFULL FUNCTIONS
// =================
// Construct an Array by repeating `pattern` n times
function repeat(n, pattern) {
    return [...Array(n)].reduce(sum => sum.concat(pattern), []);
}

const uvData = repeat(6, [
    // start 0,0 move CW (Clock-wise)
    1, 1, // top right
    1, 0, // bottom right
    0, 1, // top left

    0, 1, // top left
    1, 0, // bottom right
    0, 0  // bottom left
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const uvBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);

// RESOURCE LOADING
// ================
function loadTexture(url, onload) {
    const texture = gl.createTexture();
    const image = new Image();

    image.onload = e => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        onload();
    };

    image.src = url;
    return texture;
}

const brick = loadTexture(`textures/brick 16 - 256x256.png`, () => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, brick);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUV;

uniform mat4 matrix;

void main(){
    vUV = uv;
    gl_Position = matrix * vec4(position, 1);
}    
`);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Vertex shader compile error:', gl.getShaderInfoLog(vertexShader));
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
    precision mediump float;

    varying vec2 vUV;
    uniform sampler2D textureID;

    void main() {
        gl_FragColor = texture2D(textureID, vUV);
    }    
    `);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader compile error:', gl.getShaderInfoLog(fragmentShader));
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
    }

    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const uvLocation = gl.getAttribLocation(program, `uv`);
    gl.enableVertexAttribArray(uvLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    gl.enable(gl.DEPTH_TEST);

    const uniformLocations = {
        matrix: gl.getUniformLocation(program, `matrix`),
        textureID: gl.getUniformLocation(program, 'textureID'),
    };

    function animate() {
        requestAnimationFrame(animate);

        //cube.rotate(Math.PI/2, 'z');
        //cube.translate(0.001, 0.001, 0);
        cube.rotate(0.01, 'y')

        gl.uniformMatrix4fv(uniformLocations.matrix, false, cube.modelMatrix)
        gl.uniform1i(uniformLocations.textureID, 0);
        gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
    }

    animate();

});
