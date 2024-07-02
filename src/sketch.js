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
    ROYAL_BLUE: "#4169e1"
}

// panels
let normPanel;
let ctrlPanel;
let actionPanel;

function setup() {
    xT = windowWidth/2;
    yT = windowHeight/2;

    createCanvas(windowWidth, windowHeight);
    map = new PentagramMap();
    polygon = new Polygon(map);

    // instantiate panels
    ctrlPanel = new CtrlPanel(10, 10, polygon, map);
    normPanel = new NormalizationPanel(10, ctrlPanel.y+ctrlPanel.h+10, map);
    actionPanel = new ActionPanel(10, normPanel.y+normPanel.h+10, map, polygon);
}

function draw() {
    background(color.CYAN);
    polygon.show();

    // title
    noStroke();
    textAlign(CENTER, CENTER);
    textFont("Georgia", 20);
    fill(color.BLACK);
    text("Pentagram Map Simulator", xT, 20);
    
    ctrlPanel.show();
    normPanel.show();
    actionPanel.show();
}

function mouseClicked() {
    ctrlPanel.buttonMouseAction();
    normPanel.buttonMouseAction();
    actionPanel.buttonMouseAction();

    Test.debug();
}

function mouseDragged() {
    // dragging vertices
    polygon.dragVertex();
}

function keyPressed() {
    // applying the map
    if (key === ' ') {
        polygon.vertices = map.act(polygon.cloneVertices());
    } else if (key === 'z' || key === 'Z') {
        if (map.canRevert()) {
            polygon.vertices = map.revert();
        }
    }

    // changing the number of vertices of a polygon
    if (keyCode === UP_ARROW) { // up arrow
        polygon.setDefault(polygon.numVertex+1);
        ctrlPanel.updateNumVertices(polygon.numVertex);
    } else if (keyCode === DOWN_ARROW){ 
        // the number of vertices has to > 4
        polygon.setDefault(Math.max(polygon.numVertex-1,5)); 
        ctrlPanel.updateNumVertices(polygon.numVertex);
        // TODO: may adopt Schwartz 2024 notations
    }
}

// TODO: need to add buttons for changing number of edges


