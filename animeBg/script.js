import anime from "anime.es.js";

const wrapper = document.getElementById("tiles");

const colors = [
                "rgb(255,0,0)",
                "rgb(255,0,0)",
                "rgb(255,0,0)",
                "rgb(255,0,0)",
                "rgb(255,0,0)",
            ];

let count = -1;

let columns = Math.floor(document.body.clientWidth / 50),
    rows = Math.floor(document.body.clientHeight / 50);

const handdleOnClick = index => {
    anime({
        target: ".tile", 
        backgroundColor: colors[count % (colors.length -1)],
        delay: anime.stagger(50, {
            grid: [columns, rows],
            from: index
        })
    })
}


const createTile = index => {
    const tile = document.createElement("div");

    tile.classList.add("tile");
    
    tile.onclick = e => handdleOnClick(index)

    return tile
}

const createTiles = quantity => {
    Array.from(Array(quantity)).map((tile,index) => {
        wrapper.appendChild(createTile(index));
    })
}

const createGrid = () => {
    wrapper.innerHTML = "";

    columns = Math.floor(document.body.clientWidth / 50);
    rows = Math.floor(document.body.clientHeight / 50);
    
    wrapper.style.setProperty("--columns", columns);
    wrapper.style.setProperty("--rows", rows);

    createTiles(columns * rows);
}


window.onresize = () => createGrid();

createGrid(columns * rows)
