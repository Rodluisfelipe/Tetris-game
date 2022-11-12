var myAudio = document.getElementById("myAudio");

function togglePlay() {
    return myAudio.paused ? myAudio.play() : myAudio.pause();
};
document.getElementById('tetris').style.border = '0px solid transparent';

document.getElementById("start_game").addEventListener("click", function () {

    document.getElementById('tetris').style.border = 'solid .2em #fff';
    document.getElementById('start_game').style.display = "none";

    document.getElementById('demo-img').style.display = "none";
    document.getElementById('restart_game').style.display = "block";

});
document.getElementById("restart_game").addEventListener("click", function () {
    player.pos.y = 0;
    merge(arena, player);
    dropInterval = 500;
    document.getElementById('levels').innerText = "Level 1";
});

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');


    context.shadowColor = 'black';
    context.shadowOffsetX = 0.5;
    context.shadowOffsetY = 0.5;

    context.scale(20, 20);

    function arenaSweep() {
        let rowCount = 1;
        outer: for (let y = arena.length - 1; y > 0; --y) {
            for (let x = 0; x < arena[y].length; ++x) {
                if (arena[y][x] === 0) {
                    continue outer;
                }
            }

            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            ++y;

            player.score += rowCount * 10;
            rowCount *= 2;
        }
    };
    function collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];

        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {

                    return true;
                }
            }
        }
        return false;
    };

    function createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    };

    function draw() {
        context.fillStyle = '#e3e3e3';
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawMatrix(arena, {
            x: 0,
            y: 0
        });
        drawMatrix(player.matrix, player.pos);
    }

    function createPiece(type) {
        if (type === 'I') {
            return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
        } else if (type === 'L') {
            return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
        } else if (type === 'J') {
            return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
        } else if (type === 'O') {
            return [
            [4, 4],
            [4, 4],
        ];
        } else if (type === 'Z') {
            return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
        } else if (type === 'S') {
            return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
        } else if (type === 'T') {
            return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
        }
    };


    function drawMatrix(matrix, offset) {
      matrix.forEach((row, y) => {
           row.forEach((value, x) => {
                if (value !== 0) {
                     context.fillStyle = colors[value];
                    context.fillRect(x +
                        offset.x,
                        y + offset.y,
                        1, 1);
                }
            });
        });
    };

    const arena = createMatrix(12, 20);
    const player = {
        pos: {
            x: 0,
            y: 0
        },
        matrix: null,
        score: 0,
    };

    function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            // On récupère les positions
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    };
    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
            }
        }
       if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }


    function playerRotate(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);

       while (collide(arena, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }