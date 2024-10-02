let polygon;
let map;

// window
let polygonWindow;
// let planeWindow;
let shapePolygon;

// plotting vertices
let xT;
let yT;

// colors used
const color = {
    BLACK: "#000000",
    WHITE: "#ffffff",
    RED: "#ff0000",
    ORANGE: "#ffa500",
    YELLOW: "#ffff00",
    GREEN: "#00bb00",
    BLUE: "#0000ff",
    VIOLET: "#ee82ee",
    PURPLE: "#800080",
    CYAN: "#00ffff", 
    CADET_BLUE: "#5f9ea0",
    ROYAL_BLUE: "#4169e1", 
    KHAKI: "#f0e68c",
    INDIGO: "#4b0082",
    GRAY: "#808080"
}

// panels
let ctrlPanel;
let coordPanel;
let actionPanel;
let trajPanel;
let infoPanel;

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new Map31();
    polygon = new DispPolygon(map);
    polygon.canDrag = true;
    polygon.vertexSize = 6;
    shapePolygon = new TwistedPolygon(map);
    shapePolygon.canDrag = true;

    // create windows
    shapeWindow = new PolygonWindow(10, 500, 300, 300, shapePolygon, "Edit Shape", [polygon], color.INDIGO);
    // planeWindow = new PlaneWindow(2*xT-310, 500, 300, 300, shapePolygon, "Plane", [polygon], [1, 3]);

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, shapePolygon, [polygon]);
    coordPanel = new CoordPanel(10, ctrlPanel.y+ctrlPanel.h+10, shapePolygon, [polygon]);
    actionPanel = new ActionPanel(10, coordPanel.y+coordPanel.h+10, map, polygon);
    actionPanel.showPanel = false;
    trajPanel = new TrajectoryPanel(10, actionPanel.y+actionPanel.h+10, polygon);
    infoPanel = new InfoPanel(2*xT - 210, 10, polygon, map);
}

function draw() {
    background(color.WHITE);
    polygon.show();

    shapeWindow.show();
    
    // showing panels
    ctrlPanel.show();
    coordPanel.show();
    actionPanel.show();
    trajPanel.show();
    infoPanel.show();

    if (mouseIsPressed) {
        try {
            coordPanel.mousePressedAction();
        }
        catch (err) {
            console.log(err);
        }
    }
        
}

function mouseClicked() {
    // panel actions
    ctrlPanel.buttonMouseAction();
    coordPanel.buttonMouseAction();
    actionPanel.buttonMouseAction();
    trajPanel.buttonMouseAction();
    infoPanel.buttonMouseAction();

    // update alignment of panels
    coordPanel.y = ctrlPanel.y+ctrlPanel.h+10;
    actionPanel.y = coordPanel.y+coordPanel.h+10;
    trajPanel.y = actionPanel.y+actionPanel.h+10;
    coordPanel.updateButtonPositions();
    actionPanel.updateButtonPositions();
    trajPanel.updateButtonPositions();
    
    // window actions
    shapeWindow.mouseAction();
}

function mouseDragged() {
    // dragging vertices
    shapeWindow.mouseDragAction();
}

function keyPressed() {
    // applying the map
    if (key === ' ') {
        try {
            polygon.cornerCoords = map.act(polygon.cornerCoords.slice());
            polygon.updateInfo();
        }
        catch (err) {
            console.error(err);
        }
    } else if (key === 'z' || key === 'Z') {
        if (map.canRevert()) {
            const prev = map.revert();
            polygon.cornerCoords = prev[0];
            map.numIterations = prev[1];
        }
    }

    if (key === 'p') {
        // print the orbit
        let repl = "x,y,z\n";
        for (let i = 0; i < polygon.trajectory[0].length; i++) {
            repl = repl + polygon.trajectory[0][i][0].toString() + "," + polygon.trajectory[0][i][1].toString() + "," + polygon.trajectory[0][i][2].toString() + "\n";
        }
        console.log(repl);
    }

    if (key === 'P') {
        // print the vertices
        let repl = "i,x,y,z\n";
        for (let i = 0; i < polygon.trailingVertices.length; i++) {
            repl = repl + (i-2-polygon.numTrailing).toString() + ',' + polygon.trailingVertices[i][0].toString() + "," + polygon.trailingVertices[i][1].toString() + "," + polygon.trailingVertices[i][2].toString() + "\n";
        }
        for (let i = 0; i < polygon.verticesToShow.length; i++) {
            repl = repl + (i-2).toString() + ',' + polygon.verticesToShow[i][0].toString() + "," + polygon.verticesToShow[i][1].toString() + "," + polygon.verticesToShow[i][2].toString() + "\n";
        }
        console.log(repl);
    }

    // window toggle dragging
    if (key === 'w' || key === 'W') {
        shapeWindow.toggleDrag();
    }
    
    // action panel activation
    if (key === 'a' || key === 'A') {
        actionPanel.mapAction();
    }

    // control panel rate
    if (key === 'q') {
        coordPanel.rate -= 1;
    }
    if (key === 'e') {
        coordPanel.rate += 1;
    }

    // changing the number of vertices to show
    if (keyCode === RIGHT_ARROW && polygon.numVertexToShow < 100){ 
        polygon.numVertexToShow++;
        shapePolygon.numVertexToShow++;
        polygon.updateInfo();
        shapePolygon.updateInfo();
    } 
    if (keyCode === LEFT_ARROW && polygon.numVertexToShow > polygon.n+4) { 
        polygon.numVertexToShow--;
        shapePolygon.numVertexToShow--;
        polygon.updateInfo();
        shapePolygon.updateInfo();
    }

    // changing trailing vertices
    if (keyCode === UP_ARROW && polygon.numTrailing < 100) {
        polygon.numTrailing++;
        polygon.updateInfo();
    } 
    if (keyCode === DOWN_ARROW && polygon.numTrailing > 0) {
        polygon.numTrailing--;
        polygon.updateInfo();
    }
}