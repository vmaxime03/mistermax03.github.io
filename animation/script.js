class Color {
    constructor (r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }
    getCssRGB () {
        return `rgb(${this.red},${this.green},${this.blue})`
    }
}
const getRandomColor= () => {
    return new Color(Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256));
}
const fade = (from, target, nbcolors) => {
    let r = new Array(nbcolors);
    for (let i = 1; i <= nbcolors; i++) {
        r[i-1] = new Color(Math.floor(from.red+((target.red-from.red)/nbcolors*i)),
                            Math.floor(from.green+((target.green-from.green)/nbcolors*i)),
                            Math.floor(from.blue+((target.blue-from.blue)/nbcolors*i)));
    }
    return r;
}

let from = new Color(0,0,0);
let target = new Color(255,255,255);


const grid = document.getElementById("tiles");
let columns = Math.floor(document.body.clientWidth / 50);
let rows = Math.floor(document.body.clientHeight / 50);

let gridArray;
const delay = 50;
const colorChangeDelay = 100
const tileWidth = 30

window.addEventListener("load", () => {
    window.onresize = () => createGrid();
    createGrid();
});


class Tile {
    constructor(tile) {
        this.tile = tile;
        this.state = 0;
        this.colors = null;
    }
}

const tileHandler = (x, y) => {
    return (event) => {
        let colors = fade(from, target, 6);
        from = target;
        target = getRandomColor();
        changeColor(x, y, colors);
        setTimeout(propagatev2, delay, x, y, colors);
    }
}

const changeColor = (x, y, colors, first=true) => {
    let t = gridArray[y][x];
    if (first) {
        t.colors = colors;
    }
    if (t.state < t.colors.length) {
        t.tile.style.backgroundColor = t.colors[t.state++].getCssRGB();
        setTimeout(changeColor, colorChangeDelay, x, y, colors, false);
    } else {
        t.state = 0;
    }
} 


const inbounds = (x,y)  => {
    return ((x >= 0 && x < columns) && (y >= 0 && y< rows))
}

const propagatev2 = (x, y, colors, r=1) => {
    let pdx = 1;
    let pdy = r;
    let ndx = -1;
    let ndy = -r;
    while (dx < dy) {
        if (inbounds(x+dx, y+dy)) changeColor(x+dx, y+dy, colors);
        if (inbounds(x+dx, y-dy)) changeColor(x+dx, y-dy, colors);
        if (inbounds(x-dx, y+dy)) changeColor(x-dx, y+dy, colors);
        if (inbounds(x-dx, y-dy)) changeColor(x-dx, y-dy, colors);

        //if (inbounds(x+dy, y+dx)) changeColor(x+dy, y+dx, colors);
        //if (inbounds(x+dy, y-dx)) changeColor(x+dy, y-dx, colors);
        //if (inbounds(x-dy, y+dx)) changeColor(x-dy, y+dx, colors);
        //if (inbounds(x-dy, y-dx)) changeColor(x-dy, y-dx, colors);
        dx++;
        dy--;
    }
    if (inbounds(x+dx, y+dy)) setTimeout(propagatev2, delay, x, y, colors, ++r);
    console.log("rec");
}

const propagatev3 = (x, y, colors) => {
    let r = 0;
    lineColorChange(x, y, 1, 0, colors);
    lineColorChange(x, y, -1, 0, colors);
    lineColorChange(x, y, 0, 1, colors);
    lineColorChange(x, y, 0, -1, colors);


    while (x+r < rows || x-r < columns) {
        if (inbounds(x+r, y)) lineColorChange(x+r, y, 0, 1, colors);
        if (inbounds(x+r, y)) lineColorChange(x+r, y, 0, -1, colors);
        if (inbounds(x-r, y)) lineColorChange(x-r, y, 0, 1, colors);
        if (inbounds(x-r, y)) lineColorChange(x-r, y, 0, -1, colors);
    }
}


const lineColorChange = (x, y, dirx, diry, colors) => {
    if (inbounds(x+dirx, y+diry)) {
        changeColor(x+dirx, y+diry, colors);
        setTimeout(lineColorChange, delay, x+dirx, y+diry, dirx, diry, colors);
    }

}


const createGrid = () => {
    grid.innerHTML = "";

    columns = Math.floor(document.body.clientWidth / tileWidth);
    rows = Math.floor(document.body.clientHeight / tileWidth);
    
    gridArray = new Array(rows);
    
    for(let y=0; y< rows; y++) {
        let line = grid.appendChild(document.createElement("tr"));
        gridArray[y] = new Array(columns);
        for(let x=0; x< columns; x++) {
            let tile = line.appendChild(document.createElement("td"));
            tile.classList.add("tile");
            tile.style.width = `${tileWidth}px`;
            tile.style.height = `${tileWidth}px`;
            tile.dataset.x = x;
            tile.dataset.y = y;
            gridArray[y][x] = new Tile(tile);
            tile.addEventListener("click", tileHandler(x,y));

            tile.innerText = `${x}-${y}`
        }
    }
}




