// const colors = ["rgb(0,0,0)",
//                 "rgb(50,50,50)", 
//                 "rgb(100,100,100)",
//                 "rgb(150,150,150)",
//                 "rgb(200,200,200)",
//                 "rgb(250,250,250)"  
//             ];

class Color {
    constructor (r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }
}
const fade = (from, target, nbcolors) => {
    let r = new Array(nbcolors);
    for (let i = 1; i <= nbcolors; i++) {
        r[i-1] = `rgb(${from.red+((target.red-from.red)/nbcolors*i)},${from.green+((target.green-from.green)/nbcolors*i)},${from.blue+((target.blue-from.blue)/nbcolors*i)})`
    }
    return r;
}

let from = new Color(0,0,0);
let target = new Color(255,255,255);
let colors = fade(from, target, 6);


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


const Corners = {
    TOPRIGHT: "tr",
    TOPLEFT : "tl",
    BOTTOMRIGHT : "br",
    BOTTOMLEFT  : "bl",
};

class Tile {
    constructor(tile) {
        this.tile = tile;
        this.state = 0;
    }
}

const tileHandler = (x, y) => {
    return (event) => {
        from = target;
        target = new Color(Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256));
        
        colors = fade(from, target, 6);
        changeColor(x, y);
        setTimeout(propager, delay, x, y);
    }
}

const changeColor = (x, y) => {
    let t = gridArray[y][x];
    
    if (t.state < colors.length) {
        t.tile.style.backgroundColor = colors[t.state++];
        setTimeout(changeColor, colorChangeDelay, x, y);
    } else {
        t.state = 0;
    }
} 


const inbounds = (x,y)  => {
    return ((x >= 0 && x < columns) && (y >= 0 && y< rows))
}

const propager = (x,y) => {
    lineColorChange(x,y, 1, 0);  
    lineColorChange(x,y, -1, 0);  
    lineColorChange(x,y, 0, 1);   
    lineColorChange(x,y, 0, -1);  

    if (inbounds(x+1, y+1)) setTimeout(propagerCorner, delay, x+1, y+1, Corners.BOTTOMRIGHT);
    if (inbounds(x-1, y-1)) setTimeout(propagerCorner, delay, x-1, y-1, Corners.TOPLEFT);

    if (inbounds(x+1, y-1)) setTimeout(propagerCorner, delay, x+1, y-1, Corners.TOPRIGHT);
    if (inbounds(x-1, y+1)) setTimeout(propagerCorner, delay, x-1, y+1, Corners.BOTTOMLEFT);
    
}

const propagerCorner =  (x, y, corner) => {
    changeColor(x, y);
    switch (corner) {
        case Corners.TOPLEFT :
            setTimeout(lineColorChange, delay, x, y, -1, 0);
            setTimeout(lineColorChange, delay, x, y, 0, -1);
            if (inbounds(x-1, y-1)) setTimeout(propagerCorner, delay*2, x-1, y-1, Corners.TOPLEFT);
            break;
        case Corners.TOPRIGHT : 
            setTimeout(lineColorChange, delay, x, y, 1, 0);
            setTimeout(lineColorChange, delay, x, y, 0, -1);
            if (inbounds(x+1, y-1)) setTimeout(propagerCorner, delay*2, x+1, y-1, Corners.TOPRIGHT);
            break;
        case Corners.BOTTOMLEFT :
            setTimeout(lineColorChange, delay, x, y, -1, 0);
            setTimeout(lineColorChange, delay, x, y, 0, 1);
            if (inbounds(x-1, y+1)) setTimeout(propagerCorner, delay*2, x-1, y+1, Corners.BOTTOMLEFT);
            break;
        case Corners.BOTTOMRIGHT :
            setTimeout(lineColorChange, delay, x, y, 1, 0);
            setTimeout(lineColorChange, delay, x, y, 0, 1);
            if (inbounds(x+1, y+1)) setTimeout(propagerCorner, delay*2, x+1, y+1, Corners.BOTTOMRIGHT);
            break;
    }
}

const lineColorChange = (x, y, dirx, diry) => {
    if (inbounds(x+dirx, y+diry)) {
        changeColor(x+dirx, y+diry);
        setTimeout(lineColorChange, delay, x+dirx, y+diry, dirx, diry);
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

            // tile.innerText = `${x}-${y}`
        }
    }

    console.log(gridArray)

}




