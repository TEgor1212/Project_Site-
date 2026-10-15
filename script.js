const canvas = document.getElementById('tetris-board');
const ctx = canvas ? canvas.getContext('2d') : null;
const nextCanvas = document.getElementById('next-piece-canvas');
const nextCtx = nextCanvas ? nextCanvas.getContext('2d') : null;

const COLS = 10, ROWS = 20, BLOCK_SIZE = 30;

const COLORS = [
    null, '#00f0f0', '#0000f0', '#f0a000', '#f0f000',
    '#00f000', '#a000f0', '#f00000'
];

const SHAPES = [
    [],
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[2,0,0],[2,2,2],[0,0,0]],
    [[0,0,3],[3,3,3],[0,0,0]],
    [[4,4],[4,4]],
    [[0,5,5],[5,5,0],[0,0,0]],
    [[0,6,0],[6,6,6],[0,0,0]],
    [[7,7,0],[0,7,7],[0,0,0]]
];

let board, score, level, lines, gameOver, isPaused;
let dropCounter = 0, dropInterval = 1000, lastTime = 0;
let currentPiece, nextPiece;

function initGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0; level = 1; lines = 0;
    gameOver = false; isPaused = false;
    dropInterval = 1000; dropCounter = 0;
    currentPiece = createPiece();
    nextPiece = createPiece();
    updateScore();
    drawNextPiece();
    const go = document.getElementById('game-over');
    const ps = document.getElementById('pause-screen');
    if (go) go.classList.add('hidden');
    if (ps) ps.classList.add('hidden');
}

function createPiece() {
    const type = Math.floor(Math.random() * 7) + 1;
    return {
        shape: SHAPES[type].map(row => [...row]),
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2),
        y: 0
    };
}

function drawBlock(c, x, y, color, size = BLOCK_SIZE) {
    c.fillStyle = color;
    c.fillRect(x * size, y * size, size, size);
    c.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    c.lineWidth = 2;
    c.strokeRect(x * size, y * size, size, size);
    c.fillStyle = 'rgba(255, 255, 255, 0.2)';
    c.fillRect(x * size + 2, y * size + 2, size / 3, size / 3);
}

function drawBoard() {
    if (!ctx) return;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) drawBlock(ctx, x, y, COLORS[board[y][x]]);
        }
    }
    
    if (currentPiece) {
        currentPiece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) drawBlock(ctx, currentPiece.x + dx, currentPiece.y + dy, COLORS[value]);
            });
        });
    }
}

function drawNextPiece() {
    if (!nextCtx) return;
    nextCtx.fillStyle = '#0a0a1a';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (nextPiece) {
        const ox = (4 - nextPiece.shape[0].length) / 2;
        const oy = (4 - nextPiece.shape.length) / 2;
        nextPiece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) drawBlock(nextCtx, ox + dx, oy + dy, COLORS[value], 25);
            });
        });
    }
}

function collide(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const bx = piece.x + x, by = piece.y + y;
                if (bx < 0 || bx >= COLS || by >= ROWS) return true;
                if (by >= 0 && board[by][bx]) return true;
            }
        }
    }
    return false;
}

function merge(piece) {
    piece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value) board[piece.y + dy][piece.x + dx] = value;
        });
    });
}

function rotate(piece) {
    const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
    return { ...piece, shape: rotated };
}

function clearLines() {
    let cleared = 0;
    outer: for (let y = ROWS - 1; y >= 0; y--) {
        for (let x = 0; x < COLS; x++) if (!board[y][x]) continue outer;
        board.splice(y, 1)[0].fill(0);
        board.unshift(board.pop());
        cleared++;
        y++;
    }
    if (cleared > 0) {
        lines += cleared;
        score += cleared * 100 * level + (cleared === 4 ? 800 : 0);
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        updateScore();
    }
}

function updateScore() {
    const s = document.getElementById('score');
    const l = document.getElementById('level');
    const ln = document.getElementById('lines');
    if (s) s.textContent = score;
    if (l) l.textContent = level;
    if (ln) ln.textContent = lines;
}

function drop() {
    currentPiece.y++;
    if (collide(currentPiece)) {
        currentPiece.y--;
        merge(currentPiece);
        clearLines();
        currentPiece = nextPiece;
        nextPiece = createPiece();
        drawNextPiece();
        if (collide(currentPiece)) {
            gameOver = true;
            document.getElementById('final-score').textContent = score;
            document.getElementById('game-over').classList.remove('hidden');
        }
    }
    dropCounter = 0;
}

function hardDrop() {
    while (!collide(currentPiece)) currentPiece.y++;
    currentPiece.y--;
    merge(currentPiece);
    clearLines();
    currentPiece = nextPiece;
    nextPiece = createPiece();
    drawNextPiece();
    if (collide(currentPiece)) {
        gameOver = true;
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.remove('hidden');
    }
    dropCounter = 0;
}

function move(dir) {
    currentPiece.x += dir;
    if (collide(currentPiece)) currentPiece.x -= dir;
}

function rotatePiece() {
    const rotated = rotate(currentPiece);
    if (!collide(rotated)) currentPiece.shape = rotated.shape;
}

function restartGame() {
    initGame();
    lastTime = performance.now();
    requestAnimationFrame(update);
}

function update(time = 0) {
    if (gameOver || isPaused) return;
    const dt = time - lastTime;
    lastTime = time;
    dropCounter += dt;
    if (dropCounter > dropInterval) drop();
    drawBoard();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (!canvas || gameOver) return;
    
    if (event.key === 'p' || event.key === 'P' || event.key === 'з' || event.key === 'З') {
        isPaused = !isPaused;
        const ps = document.getElementById('pause-screen');
        if (ps) ps.classList.toggle('hidden', !isPaused);
        if (!isPaused) {
            lastTime = performance.now();
            update();
        }
        return;
    }
    
    if (isPaused) return;
    
    switch (event.key) {
        case 'ArrowLeft': move(-1); break;
        case 'ArrowRight': move(1); break;
        case 'ArrowDown': drop(); break;
        case 'ArrowUp': rotatePiece(); break;
        case ' ': event.preventDefault(); hardDrop(); break;
    }
    drawBoard();
});

const saveBtn = document.getElementById('save-score-btn');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        if (score === 0) {
            alert('Сыграйте сначала!');
            return;
        }
        const name = prompt('Введите ваше имя:');
        if (!name) return;
        
        const records = JSON.parse(localStorage.getItem('tetris-records') || '[]');
        records.push({ name, score, level, date: new Date().toLocaleDateString('ru-RU') });
        records.sort((a, b) => b.score - a.score);
        localStorage.setItem('tetris-records', JSON.stringify(records.slice(0, 10)));
        alert('Рекорд сохранён!');
    });
}

if (canvas && nextCanvas) {
    initGame();
    lastTime = performance.now();
    requestAnimationFrame(update);
}
