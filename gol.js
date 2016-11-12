// Set default values
var nCols = 20;
var nRows = 20;
document.getElementById("num-cols").value = nCols;
document.getElementById("num-rows").value = nRows;
reformGrid(nCols, nRows);

// recreate grid
function reformGrid(cols, rows) {
    nCols = cols;
    nRows = rows;
    console.log("C: " + String(nCols));
    console.log("R: " + String(nRows));

    var grid = document.getElementById("grid");

    var cellWidth = 1 / cols * 100;
    console.log("cellWidth: " + String(cellWidth));

    var cellHeight = 1 / rows * 100;
    console.log("cellHeight: " + String(cellHeight));

    // Clear grid 
    while (grid.lastChild) {
      grid.removeChild(grid.lastChild);
    }

    // Insert row divs
    for (r = 0; r < rows; r++) {
        var thisRow = document.createElement("div");
        thisRow.className = "grid-row";
        thisRow.style.height = String(cellHeight) + "%";
        grid.appendChild(thisRow);

        // Insert cell divs
        for (c = 0; c < cols; c++) {
            var thisCell = document.createElement("div");
            thisCell.classList.add("cell");
            thisCell.id = "r" + String(r) + "-c" + String(c)
            thisCell.style.width = String(cellWidth) + "%";
            thisCell.style.height = "100%";
            thisCell.onclick = function() { this.classList.toggle("alive"); };
            //thisCell.onclick = function() { getNewStatus(this.id); };
            thisRow.appendChild(thisCell);



        }

    }

    // default values
    checkerGrid();
}


// variables for tracking evolution
var isRunning = false; //tracks whether the thing is running
var interval; //holds the interval which will need to be cleared

// Stop continuous evolution
function stopEvolving() {
    console.log("Ending evolution.");
    clearInterval(interval);
    var button = document.getElementById("startButton");
    isRunning = false;
    button.value = "stopped";
    button.innerHTML = "Start evolving";
    document.getElementById("speed").disabled = false;
}

// Start/stop evolution based on state
function toggleEvolve(button) {
    console.log(button.value);

    if (button.value === "stopped") {
        isRunning = true;
        button.value = "running";
        button.innerHTML = "Stop evolving";
        var slider = document.getElementById("speed");
        var speed = slider.value;
        console.log("Beginning evolution... (", speed, "ms)");
        slider.disabled = true;
        interval = setInterval(function() { updateGrid(); }, speed);
    } else {
        stopEvolving();
    }

}


// Evolve once
function updateGrid() {
    console.log("Updating grid");
    var allCells = document.getElementsByClassName("cell");
    var newStatuses = {}
    for (var i = 0; i < allCells.length; i++) {
        //iterate once to get the new statuses
        var thisId = allCells[i].id;
        newStatuses[thisId] = getNewStatus(thisId);
    }
    for (var i = 0; i < allCells.length; i++) {
        //iterate again to set new statuses
        var thisCell = allCells[i];
        var willLive = newStatuses[thisCell.id];
        thisCell.classList.toggle("alive", willLive); //adds if willLive == true, removes if false
    }

}

// next status of a cell depending on neighbors
function getNewStatus(cellId) {
    var pals = countAliveNeighbors(cellId);
    var cell = getCell(cellId);
    var isAlive = cell.classList.contains("alive");

    if (isAlive) { //cell is alive
        if (pals < 2 || pals > 3) { // too few || too many
            //console.log("Cell " + cellId + " dies")
            isAlive = false; //cell dies
        } else {
            //console.log("Cell " + cellId + " stays alive")
        }
    } else { //cell is dead
        if (pals === 3) {
            //console.log("Cell " + cellId + " is born")
            isAlive = true; //cell is born
        } else {
            //console.log("Cell " + cellId + " stays dead")
        }
    }

    return isAlive;
}



// Count the number of living neighboring cells, for a given cell
function countAliveNeighbors(cellId) {
    var neighborList = findNeighbors(cellId);
    var liveOnes = 0;
    neighborList.forEach( function(cellId) {
        var neighbor = getCell(cellId);
        if (neighbor === null) {
            console.Log("ERROR at " + cellId);
            return;
        }
        if (neighbor.classList.contains("alive")) {
            liveOnes += 1;
        }
    });
    //console.log("liveOnes: ", liveOnes);
    return liveOnes;
}

// cell IDs of neighbors of a cell
function findNeighbors(cellId) {
    var coords = parseCellId(cellId);
    //console.log("coords", coords);

    var deltaList = [   [-1,-1],[-1,0], [-1,1],
				        [0,-1],         [0,1],
				        [1,-1], [1,0],  [1,1]
                    ];

    var neighborList = []; //list of IDs

    deltaList.forEach( function(dels) {
        // newR = oldR + delR
        var newR = coords[0] + dels[0];
        var newC = coords[1] + dels[1];
        if (newR < 0 || newC < 0 || newR >= nRows || newC >= nCols) {
            //calculated cell is off the grid (doesn't exist)
            //console.log("Cell doesn't exist: ", getCellId([newR, newC]));
        } else {
            var newId = getCellId([newR, newC]);
            neighborList.push(newId);
        }
    });

    //console.log(neighborList);
    return neighborList;
}

// row and column numbers
function parseCellId(cellId) {
    var splitted = cellId.split("-");
    //console.log(splitted);
    var thisR = parseInt(splitted[0].slice(1));
    var thisC = parseInt(splitted[1].slice(1));
    //console.log("thisR: ", thisR, " thisC: ", thisC);
    return [thisR, thisC];
}

// cell ID string returned
function getCellId(coordList) {
    return "r" + String(coordList[0]) + "-c" + String(coordList[1]);
}

// Return the <div> element with the given ID
function getCell(cellId) {
    return document.getElementById(cellId);
}

// Clear grid
function clearGrid() {
    stopEvolving();
    var allCells = document.getElementsByClassName("cell");
    for (var i = 0; i < allCells.length; i++) {
        allCells[i].classList.remove("alive");
    }
}

// Chekered grid
function checkerGrid() {
    stopEvolving();
    var allCells = document.getElementsByClassName("cell");
    for (var i = 0; i < allCells.length; i++) {
        var thisCell = allCells[i];
        var coords = parseCellId(thisCell.id);
        var r = coords[0], c = coords[1];
        if (r % 2 === 0 && c % 2 === 0 || r % 2 === 1 && c %2 === 1) {
            thisCell.classList.add("alive");
        } else {
            thisCell.classList.remove("alive");
        }
    }
}

// Make grid camoflauge
function camo() {
    stopEvolving();
    var allCells = document.getElementsByClassName("cell");
    for (var i = 0; i < allCells.length; i++) {
        var camoBoo = Math.random() >= 0.5;
        allCells[i].classList.toggle("alive", camoBoo);
    }
}
