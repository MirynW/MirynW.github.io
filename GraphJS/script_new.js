/*
*************************************************************************
*   *******    *        ****    ******         *       *                *
*   *          *       *    *   **    *       * *      *                *
*   *    ***   *       *    *   ******       *   *     *                *
*   *     *    *       *    *   **    *     *******    *                *
*   *******    ******   ****    *******    *       *   *******          *
*************************************************************************
*/

var graphList;      // Will hold reference to the canvas objects that are created in the DOM
var DBAPIKEY;       // Will hold the database api key
var functionList;   // Will hold our user defined functions
var value = 0;

// Canvas container
var render_container;
var class_graph_style = "canvas_graph";
var class_parent_div = "canvas_container";
var class_ui = "canvas_ui";

var map = new Map();

/* Default Globals */
const MIN_DEFAULT = 0;
const MAX_DEFAULT = 100;
const GRAPH_WIDTH = 500;
const GRAPH_HEIGHT = 300;



//Template code for creating a new canvas
var mycanvas = document.createElement("canvas");
mycanvas.id = "mycanvas";
document.body.appendChild(mycanvas);

g = document.createElement('div');
g.setAttribute("id", "Div1");



/* 
    Initialize Everything here:
        Essentially the main function
*/
window.onload = function() {
	//canvas = document.getElementById('canvas_graph');
    //canvasContext = canvas.getContext('2d');
    
    // Get important DOM elements
    render_container = document.getElementById('render_container');

    // Set up mouse and keyboard inputs
    
    // Await user commands

}


/*
General User Input

*/

/*
Add a new graph
*/

function newGraph() {
    let d1 = new Range();
    let value = new Graph()
    map.set(key, value);

    /* Creating Parent Object */    
    let parent_div = document.createElement("div");
    let id = "g_node_" + graph_number;
    parent_div.setAttribute("id", id);
    parent_div.setAttribute("class", class_parent_div);

    /* Creating Canvas Object */
    let graph = document.createElement("canvas");
    // Set attribute tags - id, class, width, height ->resizeable?
    id = "g_node_canvas_" + graph_number;
    graph.setAttribute("id", id);
    graph.setAttribute("class", class_graph_style);
    graph.setAttribute("width", GRAPH_WIDTH);
    graph.setAttribute("height", GRAPH_HEIGHT);

    /* Creating User Interface Object */
    id = "g_node_ui_" + graph_number;
    let ui = document.createElement("div");
    ui.setAttribute("id", id);
    ui.setAttribute("class", class_ui);

    /*
    Form:
        Data/Api/Func:(type:, data:)
        New Plot(+) -> Access through either clicking button or pressing enter while in previous field.
    
    */



    
    document.body.appendChild(mycanvas);
    
    g = document.createElement('div');
    g.setAttribute("id", "Div1");




}

function deleteGraph(id) {

}

