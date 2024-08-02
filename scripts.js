const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

let gridWidth = parseInt(document.getElementById('gridWidth').value);
let gridHeight = parseInt(document.getElementById('gridHeight').value);
let cellSize = parseInt(document.getElementById('cellSize').value);

canvas.width = gridWidth;
canvas.height = gridHeight;

let rectangles = [];
let baseIndex = parseInt(document.getElementById('baseIndex').value);

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle='#e8e8e8'
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for (let y = 0; y < canvas.width; y += cellSize) {
        for (let x = 0; x < canvas.height; x += cellSize) {
            ctx.strokeRect(y, x, cellSize, cellSize);
        }
    }
}
function drawRectangles() {
    rectangles.forEach(rect => {
        ctx.globalAlpha = rect.alpha;
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.y1 * cellSize, rect.x1 * cellSize, (rect.y2 - rect.y1) * cellSize, (rect.x2 - rect.x1) * cellSize);
    });
    ctx.globalAlpha = 1.0; // Reset alpha
}

function updateEditIndexOptions() {
    const editIndexSelect = document.getElementById('editIndex');
    editIndexSelect.innerHTML = '';
    rectangles.forEach((_, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = index + 1;
        editIndexSelect.appendChild(option);
        editIndexSelect.value=index+1;
    });
    
}

function updateEditInputs() {
    const index = parseInt(document.getElementById('editIndex').value) - 1;
    if (index >= 0 && index < rectangles.length) {
        const rect = rectangles[index];
        document.getElementById('x').value = rect.x1 + baseIndex;
        document.getElementById('y').value = rect.y1 + baseIndex;
        document.getElementById('z').value = rect.x2 + baseIndex - 1;
        document.getElementById('t').value = rect.y2 + baseIndex - 1;
        document.getElementById('color').value = rect.color;
        document.getElementById('alpha').value = rect.alpha;
    }
}

function addRectangle() {
    const x1 = parseInt(document.getElementById('x').value) - baseIndex;
    const y1 = parseInt(document.getElementById('y').value) - baseIndex;
    var x2 = parseInt(document.getElementById('z').value) - baseIndex;
    var y2 = parseInt(document.getElementById('t').value) - baseIndex;
    x2++,y2++;
    const color = document.getElementById('color').value || '#000000';
    const alpha = parseFloat(document.getElementById('alpha').value) || 1.0;

    rectangles.push({ x1, y1, x2, y2, color, alpha });
    updateEditIndexOptions();
    render();
}

function editRectangle() {
    const index = parseInt(document.getElementById('editIndex').value) - 1;
    if (index >= 0 && index < rectangles.length) {
        const x1 = parseInt(document.getElementById('x').value) - baseIndex || rectangles[index].x1;
        const y1 = parseInt(document.getElementById('y').value) - baseIndex || rectangles[index].y1;
        var x2 = parseInt(document.getElementById('z').value) - baseIndex || rectangles[index].x2;
        var y2 = parseInt(document.getElementById('t').value) - baseIndex || rectangles[index].y2;
        x2++,y2++;
        const color = document.getElementById('color').value || rectangles[index].color;
        const alpha = parseFloat(document.getElementById('alpha').value) || rectangles[index].alpha;

        rectangles[index] = { x1, y1, x2, y2, color, alpha };
        render();
    }
}

function removeRectangle() {
    const index = parseInt(document.getElementById('removeIndex').value) - 1;
    if (index >= 0 && index < rectangles.length) {
        rectangles.splice(index, 1);
    }
    updateEditIndexOptions();
    render();
}

function removeAllRectangles() {
    rectangles = [];
    updateEditIndexOptions();
    render();
}

function updateGridSettings() {
    gridWidth = parseInt(document.getElementById('gridWidth').value);
    gridHeight = parseInt(document.getElementById('gridHeight').value);
    cellSize = parseInt(document.getElementById('cellSize').value);
    baseIndex = parseInt(document.getElementById('baseIndex').value);

    canvas.width = gridWidth;
    canvas.height = gridHeight;

    render();
}

function render() {
    drawGrid();
    drawRectangles();
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const y = Math.floor((e.clientX - rect.left) / cellSize);
    const x = Math.floor((e.clientY - rect.top) / cellSize);
    const info = document.getElementById('info');

    info.style.display = 'block';
    info.style.left = `${e.clientX + 10}px`;
    info.style.top = `${e.clientY + 10}px`;
    info.textContent = `Position: (${x + baseIndex}, ${y + baseIndex})`;

    const foundRectangle = rectangles.findIndex(r => 
        x >= r.x1 && x < r.x2 && y >= r.y1 && y < r.y2
    );

    if (foundRectangle !== -1) {
        info.textContent += `\nRectangle Index: ${foundRectangle + baseIndex}`;
    }
});

canvas.addEventListener('mouseout', () => {
    const info = document.getElementById('info');
    info.style.display = 'none';
});

document.getElementById('addRectangle').addEventListener('click', addRectangle);
document.getElementById('editRectangle').addEventListener('click', editRectangle);
document.getElementById('removeRectangle').addEventListener('click', removeRectangle);
document.getElementById('removeAllRectangles').addEventListener('click', removeAllRectangles);
document.getElementById('gridWidth').addEventListener('change', updateGridSettings);
document.getElementById('gridHeight').addEventListener('change', updateGridSettings);
document.getElementById('cellSize').addEventListener('change', updateGridSettings);
document.getElementById('baseIndex').addEventListener('change', updateGridSettings);
document.getElementById('editIndex').addEventListener('change', updateEditInputs);

updateEditIndexOptions();
render();
