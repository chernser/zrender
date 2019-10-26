// --------------------------------- Very few predefined shaders -----------------------
const _zDefaultVertexShader = `
    attribute vec4 vertexPosition;

    uniform mat4 modelView;
    uniform mat4 projection;


    void main() {
        // gl_Position = projection * modelView * vertexPos;
        gl_Position = projection * modelView * vertexPosition;
    }

`;

const _zDefaultPixelShader = ` 
    precision highp float;   
    uniform vec4 fillColor;
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
        gl_FragColor = fillColor;
    }
`;


// -------------------------------- Descriptor for the shaders ----------------

const DEFAULT_SHADER_P_INFO = {
    sources: {
        vertexShader: _zDefaultVertexShader,
        fragmentShader: _zDefaultPixelShader
    },
    uniforms: ["modelView", "projection", "fillColor"],
    attrs: ["vertexPosition"]
};
// -------------------------------- End Of Data -------------------------------

// SRShaderLibrary - manages collection of shaders. Can load shader remotely 
class SRShaderLibrary { 

    /**
     * Constructs library with specified webgl context
     * @param {WebGLRenderingContext} glCtx 
     */
    constructor(glCtx) {
        this._shadersByName = {};
        this.glCtx = glCtx;

        this.registerShader("default", DEFAULT_SHADER_P_INFO);
    }

    compileShader(vsSource, psSource) {
        const vertexShader = this.loadShader(this.glCtx.VERTEX_SHADER, vsSource);
        const pixelShader = this.loadShader(this.glCtx.FRAGMENT_SHADER, psSource);

        const shaderP = this.glCtx.createProgram();
        this.glCtx.attachShader(shaderP, vertexShader);
        this.glCtx.attachShader(shaderP, pixelShader);
        this.glCtx.linkProgram(shaderP);

        if (!this.glCtx.getProgramParameter(shaderP, this.glCtx.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + this.glCtx.getProgramInfoLog(shaderP));
            return null;
        }
        return shaderP;
    }

    loadShader(type, source) {
        const shader = this.glCtx.createShader(type);
        this.glCtx.shaderSource(shader, source);
        this.glCtx.compileShader(shader);

        if (!this.glCtx.getShaderParameter(shader, this.glCtx.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + this.glCtx.getShaderInfoLog(shader));
            this.glCtx.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createShader(vsSource, psSource, attributes, uniforms) {
        const shaderP = this.compileShader(vsSource, psSource);
        const shaderPInfo = {
            program: shaderP,
            attribLocations: {
                // vertexPosition: this.glCtx.getAttribLocation(shaderP, 'vertexPos')
            },

            uniformLocations: {
                // projectionMatrix: this.glCtx.getUniformLocation(shaderP, 'projection'),
                // modelViewMatrix: this.glCtx.getUniformLocation(shaderP, 'modelView')
            }
        }

        // TODO: check if array 
        for (var attr of attributes) {
            console.log("Getting attribute ", attr, " location");
            shaderPInfo.attribLocations[attr] = this.glCtx.getAttribLocation(shaderP, attr); 
        }

        for (var uni of uniforms) {
            console.log("Getting uniform ", uni, " location");
            shaderPInfo.uniformLocations[uni] = this.glCtx.getUniformLocation(shaderP, uni);
        }

        return shaderPInfo;
    }

    // registerShader - adds shader to the library. Also loads and inits it.    
    registerShader(name, shaderInfo) {
        console.log("registering shader: ", name, " info: ", shaderInfo);
        // TODO: check if same shader program has another name
        this._shadersByName[name] = this.createShader(shaderInfo.sources.vertexShader,
            shaderInfo.sources.fragmentShader, shaderInfo.attrs, shaderInfo.uniforms);
    }

    // getShaderPair - returns compiled and ready to use shader program info with location information 
    getShaderProgram(name) {
        console.log("Looking for shader with name ", name, " known shaders: ", this._shadersByName);
        return this._shadersByName[name];    
    }
}