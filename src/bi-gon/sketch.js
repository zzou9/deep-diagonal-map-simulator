let polygon;
let map;

// plotting vertices
let xT;
let yT;

// colors used
const color = {
    BLACK: "#000000",
    WHITE: "#ffffff",
    RED: "#ff0000",
    GREEN: "#00bb00",
    BLUE: "#0000ff",
    CYAN: "#00ffff", 
    CADET_BLUE: "#5f9ea0",
    ROYAL_BLUE: "#4169e1", 
    KHAKI: "#f0e68c"
}

// panels
let ctrlPanel;
let actionPanel;
let trajPanel;
let infoPanel;
let shapePanel;
let modulePanel;

// markers
let markers

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new TwistedMap();
    polygon = new TwistedBigon(map);
    polygon.canDrag = true;

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, polygon, map);
    actionPanel = new ActionPanel(10, ctrlPanel.y+ctrlPanel.h+10, map, polygon);
    trajPanel = new TrajectoryPanel(10, actionPanel.y+actionPanel.h+10, polygon);
    infoPanel = new InfoPanel(2*xT - 210, 10, polygon, map);
    shapePanel = new ShapePanel(2*xT - 210, infoPanel.y+infoPanel.h+10, polygon, map);
    modulePanel = new ModulePanel(xT-175, 40, "Bi-gon", color.BLACK);

    // draw markers
    markers = new Array();
}

function draw() {
    background(color.BLACK);
    polygon.show();

    // show markers 
    for (let i = 0; i < markers.length; i++) {
        noStroke();
        fill(color.ROYAL_BLUE);
        circle(markers[i][0], markers[i][1], 4);
    }

    // title
    noStroke();
    textAlign(CENTER, CENTER);
    textFont("Georgia", 20);
    fill(color.WHITE);
    text("Pentagram Map Simulator", xT, 20);
    
    ctrlPanel.show();
    actionPanel.show();
    trajPanel.show();
    infoPanel.show();
    shapePanel.show();
    modulePanel.show();

    if (mouseIsPressed) {
        try {
            ctrlPanel.mousePressedAction();
        }
        catch (err) {
            console.log(err);
        }
    }
        
}

function mouseClicked() {
    ctrlPanel.buttonMouseAction();
    actionPanel.buttonMouseAction();
    if (actionPanel.isRunning) {
        ctrlPanel.disableInscribe();
    }
    trajPanel.buttonMouseAction();
    infoPanel.buttonMouseAction();
    shapePanel.buttonMouseAction();
    modulePanel.buttonMouseAction();

    // update alignment of panels
    actionPanel.y = ctrlPanel.y+ctrlPanel.h+10;
    trajPanel.y = actionPanel.y+actionPanel.h+10;
    shapePanel.y = infoPanel.y+infoPanel.h+10;
    actionPanel.updateButtonPositions();
    trajPanel.updateButtonPositions();
    shapePanel.updateButtonPositions();
}

function mouseDragged() {
    // dragging vertices
    polygon.dragVertex();
}

function keyPressed() {
    // applying the map
    if (key === ' ') {
        try {
            ctrlPanel.disableInscribe();
            polygon.cornerCoords = map.act(polygon.cornerCoords.slice());
            polygon.updateInfo();
        }
        catch (err) {
            console.error(err);
        }
    } else if (key === 'z' || key === 'Z') {
        if (map.canRevert()) {
            ctrlPanel.disableInscribe();
            const prev = map.revert();
            polygon.cornerCoords = prev[0];
            map.numIterations = prev[1];
        }
    }

    if (key === 'p') {
        const x = polygon.cornerCoords;
        // console.log(x[0]*x[1]*x[2]*x[3]);
        // console.log("(x0 * x2) / (x1 * x3):", x[0]*x[2] / (x[1]*x[3]));
        // console.log("x1 * x3:", x[1]*x[3]);
        // console.log("x0 * x2:", x[0]*x[2]);

        // const T = polygon.monodromy;
        // console.log(MathHelper.eigenvalue3(T));

        console.log(polygon.hasDegenerateOrbit());
    }
    
    // action panel activation
    if (key === 'a' || key === 'A') {
        actionPanel.mapAction();
    }

    // changing the number of vertices to show
    if (keyCode === UP_ARROW && polygon.numVertexToShow < 20) { 
        polygon.numVertexToShow += 1;
        polygon.updateVertices();
    } else if (keyCode === DOWN_ARROW && polygon.numVertexToShow > 6){ 
        polygon.numVertexToShow -= 1;
        polygon.updateVertices();
    }

    // changing the diagonals of the map
    if (keyCode === LEFT_ARROW && map.l > 2) {
        map.l--;
        map.k = map.l - 1;
        map.numIterations = 0;
        actionPanel.updateDiagonalAndSpacing();
    } else if (keyCode === RIGHT_ARROW) {
        map.l++;
        map.k = map.l - 1;
        map.numIterations = 0;
        actionPanel.updateDiagonalAndSpacing();
    }

    // markers
    if (key === 'w' || key === 'W') {
        // add marker
        markers.push([mouseX, mouseY]);
    }
    if (key === 'c' || key === 'C') {
        // clear all markers
        markers = new Array();
    }

    // update information of the polygon
    polygon.updateInfo();
}