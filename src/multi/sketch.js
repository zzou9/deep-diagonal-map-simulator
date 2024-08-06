// polygons and maps
let polygon;
let map1Polygon;
let map2Polygon;
let map1;
let map2;
let map3;
let mapPolygons;
let maps;

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
    INDIGO: "#4b0082"
}

// canvas and window
let shapeWindow;
let map1Window;
let map2Window;

// panels
let ctrlPanel;
let actionPanel;
let trajPanel;
let infoPanel;
let modulePanel;
let shapePanel;

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    // main canvas
    createCanvas(windowWidth, windowHeight);

    // map instance
    map1 = new TwistedMap();
    map2 = new TwistedMap(l=5, k=1);
    map3 = new TwistedMap(l=5, k=3);

    // multiple mapPolygons


    // instantiate mapPolygons
    polygon = new TwistedBigon(map1, (xT + yT)/20);
    map1Polygon = new TwistedBigon(map1, (xT + yT)/20);
    map2Polygon = new TwistedBigon(map2, (xT + yT)/20);
    map3Polygon = new TwistedBigon(map3, (xT + yT)/20);

    polygon.canDrag = true;
    polygon.showTrajectory1 = false;
    polygon.showTrajectory2 = false;

    mapPolygons = [map1Polygon, map2Polygon, map3Polygon];
    maps = [map1, map2, map3];

    // instantiate windows
    shapeWindow = new PolygonWindow(230, 600, 300, 300, polygon, "Edit Shape", mapPolygons, color.INDIGO);
    map1Window = new MapWindow(230, 80, 500, 500, map1Polygon, "Map 1");
    map2Window = new MapWindow(740, 80, 500, 500, map2Polygon, "Map 2");
    map3Window = new MapWindow(1250, 80, 500, 500, map3Polygon, "Map 2");
    

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, polygon, mapPolygons);
    actionPanel = new ActionPanel(10, ctrlPanel.y+ctrlPanel.h+10, maps, mapPolygons);
    trajPanel = new TrajectoryPanel(10, actionPanel.y+actionPanel.h+10, mapPolygons);
    infoPanel = new InfoPanel(2*xT - 210, 10, polygon, map1);
    modulePanel = new ModulePanel(xT-175, 40, "Multi", color.BLACK);
    // shapePanel = new ShapePanel(2*xT - 210, infoPanel.y+infoPanel.h+10, polygon, map);
}

function draw() {
    // show background
    background(color.ROYAL_BLUE);

    // show window
    shapeWindow.show();
    map1Window.show();
    map2Window.show();
    map3Window.show();

    // title
    noStroke();
    textAlign(CENTER, CENTER);
    textFont("Georgia", 20);
    fill(color.WHITE);
    text("Pentagram Map Simulator", xT, 20);
    
    // show panels
    ctrlPanel.show();
    actionPanel.show();
    trajPanel.show();
    infoPanel.show();
    modulePanel.show();
    // shapePanel.show();

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
    // shapePanel.buttonMouseAction();

    // update alignment of panels
    actionPanel.y = ctrlPanel.y+ctrlPanel.h+10;
    trajPanel.y = actionPanel.y+actionPanel.h+10;
    // shapePanel.y = infoPanel.y+infoPanel.h+10;
    actionPanel.updateButtonPositions();
    trajPanel.updateButtonPositions();
    // shapePanel.updateButtonPositions();

    // window actions
    shapeWindow.mouseAction();
    map1Window.mouseAction();
    map2Window.mouseAction();
    map3Window.mouseAction();
}

function mouseDragged() {
    // // dragging vertices
    // polygon.dragVertex();

    // window drag action
    shapeWindow.mouseDragAction();
    map1Window.mouseDragAction();
    map2Window.mouseDragAction();
    map3Window.mouseDragAction();
}

function keyPressed() {
    // applying the map
    if (key === ' ') {
        try {
            ctrlPanel.disableInscribe();
            map1Polygon.cornerCoords = map1.act(map1Polygon.cornerCoords.slice());
            map1Polygon.updateInfo();
            map2Polygon.cornerCoords = map2.act(map2Polygon.cornerCoords.slice());
            map2Polygon.updateInfo();
            map3Polygon.cornerCoords = map3.act(map3Polygon.cornerCoords.slice());
            map3Polygon.updateInfo();
        }
        catch (err) {
            console.error(err);
        }
    } else if (key === 'z' || key === 'Z') {
        if (map1.canRevert()) {
            const prev = map1.revert();
            map1Polygon.cornerCoords = prev[0];
            map1.numIterations = prev[1];
        }
        if (map2.canRevert()) {
            const prev = map2.revert();
            map2Polygon.cornerCoords = prev[0];
            map2.numIterations = prev[1];
        }
        if (map3.canRevert()) {
            const prev = map3.revert();
            map3Polygon.cornerCoords = prev[0];
            map3.numIterations = prev[1];
        }
    }

    // action panel activation
    if (key === 'a' || key === 'A') {
        actionPanel.mapAction();
    }

    // window toggle dragging
    if (key === 'w' || key === 'W') {
        shapeWindow.toggleDrag();
        map1Window.toggleDrag();
        map2Window.toggleDrag();
        map3Window.toggleDrag();
    }

    // printing in the console
    if (key === 'p') {
        // console.log(x[0]*x[1]*x[2]*x[3]);
        // console.log("(x0 * x2) / (x1 * x3):", x[0]*x[2] / (x[1]*x[3]));
        // console.log("x1 * x3:", x[1]*x[3]);
        // console.log("x0 * x2:", x[0]*x[2]);

        // const T = polygon.monodromy;
        // console.log(MathHelper.eigenvalue3(T));

        // console.log(polygon.hasDegenerateOrbit());
    }

    // changing the number of vertices to show
    if (keyCode === UP_ARROW && polygon.numVertexToShow < 100) { 
        polygon.numVertexToShow += 1;
        map1Polygon.numVertexToShow += 1;
        map2Polygon.numVertexToShow += 1;
        map3Polygon.numVertexToShow += 1;
    } else if (keyCode === DOWN_ARROW && polygon.numVertexToShow > 6){ 
        polygon.numVertexToShow -= 1;
        map1Polygon.numVertexToShow -= 1;
        map2Polygon.numVertexToShow -= 1;
        map3Polygon.numVertexToShow -= 1;
    }

    // // changing the diagonals of the map
    // if (keyCode === LEFT_ARROW && map1.l > 2) {
    //     map1.l--;
    //     map1.k = map1.l - 1;
    //     map1.numIterations = 0;
    // } else if (keyCode === RIGHT_ARROW) {
    //     map1.l++;
    //     map1.k = map1.l - 1;
    //     map1.numIterations = 0;
    // }

    // update information of the polygon
    polygon.updateInfo();
    map1Polygon.updateInfo();
    map2Polygon.updateInfo();
    map3Polygon.updateInfo();
}