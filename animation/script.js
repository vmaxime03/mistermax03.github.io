const colors = [
                "rgb(250,250,250)",
                "rgb(200,200,200)",
                "rgb(150150,150)",
                "rgb(100,100,100)",
                "rgb(50 ,50 ,50 )",
                "rgb(0,  0,  0, )"
            ];


window.addEventListener("load", () => {
    window.onresize = () => createGrid();
    createGrid();
});

const grid = document.getElementById("tiles");
let columns = Math.floor(document.body.clientWidth / 50);
let rows = Math.floor(document.body.clientHeight / 50);

let gridArray;
const delay = 50;

const Corners = {
    TOPRIGHT: 12,
    TOPLEFT : 14,
    BOTTOMRIGHT : 19,
    BOTTOMLEFT  : 20,
};

class Tile {
    constructor(tile, timeoutID, state) {
        this.tile = tile;
        this.timeoutID = timeoutID;
        this.state = state;
    }
}

const tileHandler = (x, y) => {
    return (event) => {
    console.log("clic");
    changeColor(x, y);
    setTimeout(propager, delay, x, y);
    }
}

const changeColor = (x, y) => {
    let t = gridArray[y][x];
    if (t.state < colors.length) {
        console.log("colorchange")
        t.tile.style.backgroundColor = colors[t.state++];
        setTimeout(changeColor, delay, x, y);
    } else {
        t.state= 0;
    }
}

const inbounds = (x,y)  => {
    return ((x >= 0 && x <= columns) && (y >= 0 && y<= rows))
}

const propager = (x,y) => {
    lineColorChange(x,y, 1, 0);  
    lineColorChange(x,y, -1, 0);  
    lineColorChange(x,y, 0, 1);   
    lineColorChange(x,y, 0, -1);  
    if (inbounds(x+1, y+1)) propagerCorner(x+1, y+1, Corners.BOTTOMRIGHT);
    if (inbounds(x+1, y-1)) propagerCorner(x+1, y-1, Corners.TOPRIGHT);
    if (inbounds(x-1, y+1)) propagerCorner(x-1, y+1, Corners.BOTTOMLEFT);
    if (inbounds(x-1, y-1)) propagerCorner(x-1, y-1, Corners.TOPLEFT);
}

const propagerCorner =  (x, y, corner) => {
    changeColor(x, y)
    switch (corner) {
        case Corners.TOPLEFT :
            if (inbounds(x-1, y+1)) propagerCorner(x-1, y+1, Corners.TOPLEFT);
            lineColorChange(x, y, -1, 0);
            lineColorChange(x, y, 0, 1)
            break;
        case Corners.TOPRIGHT : 
            if (inbounds(x+1, y+1)) propagerCorner(x+1, y+1, Corners.TOPRIGHT);
            lineColorChange(x, y, 1, 0);
            lineColorChange(x, y, 0, 1)
            break;
        case Corners.BOTTOMLEFT :
            if (inbounds(x-1, y-1)) propagerCorner(x-1, y-1, Corners.BOTTOMLEFT);
            lineColorChange(x, y, -1, 0);
            lineColorChange(x, y, 0, -1)
            break;
        case Corners.BOTTOMRIGHT :
            if (inbounds(x+1, y-1)) propagerCorner(x+1, y-1, Corners.BOTTOMRIGHT);
            lineColorChange(x, y, 1, 0);
            lineColorChange(x, y, 0, -1)
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

    columns = Math.floor(document.body.clientWidth / 50);
    rows = Math.floor(document.body.clientHeight / 50);
    
    gridArray = new Array(rows);
    
    for(let y=0; y< rows; y++) {
        let line = grid.appendChild(document.createElement("tr"));
        gridArray[y] = new Array(columns);
        for(let x=0; x< columns; x++) {
            let tile = line.appendChild(document.createElement("td"));
            tile.classList.add("tile");
            tile.dataset.x = x;
            tile.dataset.y = y;
            gridArray[y][x] = new Tile(tile, 0, 0);
            tile.addEventListener("click", tileHandler(x,y));

            tile.innerText = `${x}-${y}`
        }
    }

    console.log(gridArray)

}




