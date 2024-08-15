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
    GREEN: "#00bb00",
    BLUE: "#0000ff",
    CYAN: "#00ffff", 
    CADET_BLUE: "#5f9ea0",
    ROYAL_BLUE: "#4169e1", 
    KHAKI: "#f0e68c",
    PURPLE: "#800080",
    INDIGO: "#4b0082",
    GRAY: "#808080",
    ORANGE: "#ffa500"
}

// panels
let ctrlPanel;
let actionPanel;
let trajPanel;
let infoPanel;
let modulePanel;

// markers
let markers;
let markerCoords;

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new TwistedMap();
    polygon = new TwistedBigon(map);
    polygon.canDrag = true;
    polygon.vertexSize = 6;
    shapePolygon = new TwistedBigon(map);
    shapePolygon.canDrag = true;

    // create windows
    shapeWindow = new PolygonWindow(10, 500, 300, 300, shapePolygon, "Edit Shape", [polygon], color.INDIGO);
    // planeWindow = new PlaneWindow(2*xT-310, 500, 300, 300, shapePolygon, "Plane", [polygon], [1, 3]);

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, shapePolygon, [polygon]);
    actionPanel = new ActionPanel(10, ctrlPanel.y+ctrlPanel.h+10, map, polygon);
    actionPanel.showPanel = false;
    trajPanel = new TrajectoryPanel(10, actionPanel.y+actionPanel.h+10, polygon);
    infoPanel = new InfoPanel(2*xT - 210, 10, polygon, map);
    modulePanel = new ModulePanel(xT-175, 40, "Bi-gon", color.BLACK);

    // draw markers
    markers = new Array();
    markerCoords = new Array();
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

    // showing windows
    shapeWindow.show();
    // planeWindow.show();

    // title
    noStroke();
    textAlign(CENTER, CENTER);
    textFont("Georgia", 20);
    fill(color.WHITE);
    text("Pentagram Map Simulator", xT, 20);
    
    // showing panels
    ctrlPanel.show();
    actionPanel.show();
    trajPanel.show();
    infoPanel.show();
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
    // panel actions
    ctrlPanel.buttonMouseAction();
    actionPanel.buttonMouseAction();
    if (actionPanel.isRunning) {
        ctrlPanel.disableInscribe();
    }
    trajPanel.buttonMouseAction();
    infoPanel.buttonMouseAction();
    modulePanel.buttonMouseAction();

    // update alignment of panels
    actionPanel.y = ctrlPanel.y+ctrlPanel.h+10;
    trajPanel.y = actionPanel.y+actionPanel.h+10;
    actionPanel.updateButtonPositions();
    trajPanel.updateButtonPositions();
    
    // window actions
    shapeWindow.mouseAction();
    // planeWindow.mouseAction();
}

function mouseDragged() {
    // dragging vertices
    shapeWindow.mouseDragAction();
    // planeWindow.mouseDragAction();
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
        // const x = polygon.cornerCoords;
        // console.log(x[0]*x[1]*x[2]*x[3]);
        // console.log("(x0 * x2) / (x1 * x3):", x[0]*x[2] / (x[1]*x[3]));
        // console.log("x1 * x3:", x[1]*x[3]);
        // console.log("x0 * x2:", x[0]*x[2]);

        // const T = polygon.monodromy;
        // console.log(MathHelper.eigenvalue3(T));

        // // print the marked coordinates 
        // let repl = '';
        // for (let i = 0; i < markerCoords.length; i++) {
        //     repl = repl + markerCoords[i][0].toString() + ',' + markerCoords[i][1].toString() + '\n';
        // }
        // console.log(repl);
        // polygon.printTrajectory();

        // // try the map
        // let xPrime = map.applyFactor(polygon.cornerCoords.slice(), 3);
        // let vertices = Reconstruct.reconstruct3(xPrime, 12);
        // let ePrime = Geometry.getEnergyCoords(vertices, 3, 1);
        // let eCoords = [ePrime[6], ePrime[7], ePrime[8], ePrime[9]];

        // console.log(eCoords);
        // let xDblPrime = map.applyMap(map.applyFactor(xPrime, 1), 1, false);
        // let vertices2 = Reconstruct.reconstruct3(xDblPrime, 12);
        // let eDblPrime = Geometry.getEnergyCoords(vertices2, 3, 1);
        // let eCoords2 = [eDblPrime[6], eDblPrime[7], eDblPrime[8], eDblPrime[9]];
        // console.log(eCoords2);

        // let repl = polygon.energyCoords[0].toString() + ", " + eCoords[0].toString() + ", " + eCoords[2].toString();
        // console.log(repl);

        // // try swapping coordinates
        // const x = polygon.cornerCoords;
        // console.log(Geometry.translate21To31(x));
        // const e = polygon.energyCoords;
        // console.log(Geometry.translate31To21Bigon(e));

        // // try (3, 1) coordinate map
        // const x = polygon.cornerCoords;
        // console.log(Geometry.bigon31(x));
        // const e = polygon.energyCoords;
        // const e_ = Geometry.betaTwoBigon(e);
        // const e__ = Geometry.betaOneBigon(e_);
        // console.log(e__);

        console.log(polygon.getInvariantsFrom31());
    }

    // window toggle dragging
    if (key === 'w' || key === 'W') {
        shapeWindow.toggleDrag();
        // planeWindow.toggleDrag();
    }
    
    // action panel activation
    if (key === 'a' || key === 'A') {
        actionPanel.mapAction();
    }

    // changing the number of vertices to show
    if (keyCode === UP_ARROW && polygon.numVertexToShow < 100) { 
        polygon.numVertexToShow += 1;
        shapePolygon.numVertexToShow += 1;
    } else if (keyCode === DOWN_ARROW && polygon.numVertexToShow > 6){ 
        polygon.numVertexToShow -= 1;
        shapePolygon.numVertexToShow -= 1;
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
    if (key === 'r' || key === 'R') {
        // add marker
        markers.push([mouseX, mouseY]);
        markerCoords.push([polygon.cornerCoords[2], polygon.cornerCoords[3]]);
    }
    if (key === 'c' || key === 'C') {
        // clear all markers
        markers = new Array();
        markerCoords = new Array();
    }

    // update information of the polygon
    polygon.updateInfo();
    shapePolygon.updateInfo();
}