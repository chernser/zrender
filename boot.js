
//https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch25.html

console.log("function for local context");

function logGLCall(functionName, args) {
    console.log("gl." + functionName + "(" +
        WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
}

const canvas = document.getElementById("main_canvas");
console.log(window.innerHeight, window.innerWidth);

window.onresize = function () {
    console.log(window.innerHeight, window.innerWidth);
};
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"), undefined, logGLCall);

// const gl = canvas.getContext("webgl");


console.log("gl context: ", gl);


// create container rectangle and fill with some color
const rootContainer = new SRContainer();
rootContainer.setRectSize(-15, 30);
rootContainer.color = [1.0, 0.0, 0.5, 1.0]; // RGBA 

const rightContainer = new SRContainer();
rightContainer.setRectSize(-25, 5);
rightContainer.color = [1.0, 0.5, 1.0, 0.5];

rootContainer.sibling = rightContainer;
console.log(rootContainer);

const render = new _zRender(gl, canvas.clientWidth, canvas.clientHeight);
render.renderScreen(rootContainer);
