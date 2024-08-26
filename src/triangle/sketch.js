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

let repl = 'e0,e1,e2,e3,e4,e5,e0_\n';

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new TriangleMap();
    polygon = new TwistedTriangle(map);
    polygon.canDrag = true;
    polygon.vertexSize = 6;
    shapePolygon = new TwistedTriangle(map);
    shapePolygon.canDrag = true;

    // create windows
    shapeWindow = new PolygonWindow(10, 500, 500, 400, shapePolygon, "Edit Shape", [polygon], color.INDIGO);
    // planeWindow = new PlaneWindow(2*xT-310, 500, 300, 300, shapePolygon, "Plane", [polygon], [1, 3]);

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, shapePolygon, [polygon]);
    actionPanel = new ActionPanel(10, ctrlPanel.y+ctrlPanel.h+10, map, polygon);
    actionPanel.showPanel = false;
    trajPanel = new TrajectoryPanel(10, actionPanel.y+actionPanel.h+10, polygon);
    infoPanel = new InfoPanel(2*xT - 210, 10, polygon, map);
    modulePanel = new ModulePanel("Triangle");

    // draw markers
    markers = new Array();
    markerCoords = new Array();
}

function draw() {
    background(color.BLACK);
    polygon.show();
    // for investigation purposes
    // polygon.showLines();

    // show markers 
    for (let i = 0; i < markers.length; i++) {
        noStroke();
        fill(color.ROYAL_BLUE);
        circle(markers[i][0], markers[i][1], 4);
    }

    // // showing windows
    // shapeWindow.show();
    // // planeWindow.show();

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
    
    // // window actions
    // shapeWindow.mouseAction();
    // // planeWindow.mouseAction();
}

function mouseDragged() {
    // // dragging vertices
    // shapeWindow.mouseDragAction();
    // // planeWindow.mouseDragAction();
    polygon.dragVertexExperimental();
    // polygon.dragVertex();
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

        /**
         * Helper method to display a list
         * @param {Array<number>} lst 
         * @param {string} [str=''] 
         */
        function disp(lst, str='') {
            for (let i = 0; i < lst.length; i++) {
                lst[i] = MathHelper.round(lst[i], 5);
            }
            console.log(str, lst);
        }

        // print the next three iterations of the map
        const e = polygon.energyCoords;
        const x3 = map.applyFactor(polygon.cornerCoords.slice(), 3);
        const x33 = map.applyFactor(x3, 3);
        const x_ = map.applyFactor(x3, 1);
        const x3_ = map.applyFactor(x_, 3);
        const x__ = map.applyFactor(x3_, 1);
        const e3 = Geometry.translate21To31(x3);
        const e33 = Geometry.translate21To31(x33);
        const e_ = Geometry.translate21To31(x_);
        const e3_ = Geometry.translate21To31(x3_);
        const e__ = Geometry.translate21To31(x__);
        disp(e, "E:");
        disp(e3, "E':");

        console.log(e[1]-e[0]);

        // console.log(repl);
    }

    // window toggle dragging
    if (key === 'w' || key === 'W') {
        // shapeWindow.toggleDrag();
        // // planeWindow.toggleDrag();
    }
    
    // action panel activation
    if (key === 'a' || key === 'A') {
        actionPanel.mapAction();
    }

    // record info for the map
    if (key === 's' || key === 'S') {
        const e = polygon.energyCoords;
        const x3 = map.applyFactor(polygon.cornerCoords.slice(), 3);
        const e3 = Geometry.translate21To31(x3);
        const e_ = e3[0];
        // record in repl
        for (let i = 0; i < 6; i++) {
            repl = repl + e[i].toString() + ',';
        }
        repl = repl + e_.toString() + '\n';
    }

    // changing the number of vertices to show
    if (keyCode === UP_ARROW && polygon.numVertexToShow < 100) { 
        polygon.numVertexToShow += 1;
        shapePolygon.numVertexToShow += 1;
    } else if (keyCode === DOWN_ARROW && polygon.numVertexToShow > 7){ 
        polygon.numVertexToShow -= 1;
        shapePolygon.numVertexToShow -= 1;
    }

    // control panel rate
    if (key === 'q') {
        ctrlPanel.rate -= 1;
    }
    if (key === 'e') {
        ctrlPanel.rate += 1;
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
        repl = 'e0,e1,e2,e3,e4,e5,e0_\n';
    }

    // update information of the polygon
    polygon.updateInfo();
    shapePolygon.updateInfo();
}