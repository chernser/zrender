


// SRCore_BaseComponent - defines basic properties and methods for rendering 
class SRCore_BaseComponent {

    // Returns buffers information. 
    // Object of three fields: position, texture?, color?
    get vertices() { return this._vertices }

    // Returns translation matrix for current component.
    //  Should take in account alignment and parent's translation matrix 
    get translateMtx() { return this._translateMtx } 

    // Returns shader information 
    // shaderInfo.vertexShaderName
    // shaderInfo.fragmentShaderName
    get shaderInfo() { return this._shaderInfo }
}

const SR_DEFAULT_RECT_ARRAY =  [
    -1.0, 1.0, 
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0,
];

const SR_DEFAULT_SHADER_INFO = {
    vertexShaderName: "default_vs_01",
    fragmentShaderName: "default_fs_01"
};

// SRContainer - defines properties of UI container. It is more than just component 
class SRContainer extends SRCore_BaseComponent { 

    constructor() {
        super();
        this._vertices = [...SR_DEFAULT_RECT_ARRAY];
        this._shaderInfo = "default";
    }

    // setRectSize - sets container rect size. 
    setRectSize(width, height) { 
        this._width = width;
        this._height = height; 
        this._vertices[0] = -0.1 * width;
        this._vertices[2] = 0;
        this._vertices[4] = -0.1 * width;
        this._vertices[6] = 0;

        this._vertices[1] = 0.1 * height;
        this._vertices[3] = 0.1 * height;
        this._vertices[5] = 0;
        this._vertices[7] = 0;
    }

    set style(style) { this._style = style; }

    // sets color to fill the container rectangle. used mainly for development.
    set color(color) { this._color = color; }
    get color() { return this._color; }

    set sibling(container) { this._sibling = container; }
    get sibling() { return this._sibling; }

}