import { mat4 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';

export default class Cube {
    constructor(size = 1) {
        this.size = size / 2; // metade do size para centralizar na origem
        this.vertexData = this.create()
        this.modelMatrix = mat4.create();
    }

    create() {
        const s = this.size;
        // Define cada face usando os 4 cantos dela
        // Ordem dos vértices de cada face (sentido anti-horário)
        const faces = [
            // Front
            [
                [s, s, s], // top right
                [s, -s, s], // bottom right
                [-s, s, s], // top left
                [-s, -s, s], // bottom left
            ],
            // Back
            [
                [-s, s, -s],
                [-s, -s, -s],
                [s, s, -s],
                [s, -s, -s],
            ],
            // Left
            [
                [-s, s, s],
                [-s, -s, s],
                [-s, s, -s],
                [-s, -s, -s],
            ],
            // Right
            [
                [s, s, -s],
                [s, -s, -s],
                [s, s, s],
                [s, -s, s],
            ],
            // Top
            [
                [s, s, s],
                [s, s, -s],
                [-s, s, s],
                [-s, s, -s],
            ],
            // Bottom
            [
                [s, -s, s],
                [s, -s, -s],
                [-s, -s, s],
                [-s, -s, -s],
            ]
        ];

        const vertexData = [];
        // Para cada face, crie 2 triângulos (6 vértices)
        for (const f of faces) {
            // Triângulo 1: 0-1-2
            vertexData.push(...f[0], ...f[1], ...f[2]);
            // Triângulo 2: 2-1-3
            vertexData.push(...f[2], ...f[1], ...f[3]);
        }
        return vertexData;
    }

    translate(x, y, z) {
        mat4.translate(this.modelMatrix, this.modelMatrix, [x, y, z]);
    }

    scale(x, y, z) {
        mat4.scale(this.modelMatrix, this.modelMatrix, [x, y, z]);
    }

    rotate(rad, axis) {
        
        let axisVector = [0, 0, 1]
        if (axis === 'x') {
            axisVector = [1, 0, 0]
        } else if (axis === 'y') {
            axisVector = [0, 1, 0]
        } else if (axis === 'z') {
            axisVector = [0, 0, 1]
        }

        mat4.rotate(this.modelMatrix, this.modelMatrix, rad, axisVector);
    }
}
