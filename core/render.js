
class _zRender {

    constructor(glCtx, destViewH, destViewW) {
        console.log("init render");
        this.glCtx = glCtx;
        this.shaderLib = new SRShaderLibrary(glCtx);

        this.fov = 45 * Math.PI / 180;
        this.aspect = destViewH / destViewW;
        // this.aspect = 1;
        this.nearPlane = 10.0;
        this.farPlane = 100.0;

        console.log("render: ", this);
        this.updateProjectionMatrix();
        this.updateTranslateMatrix();
    }

    updateProjectionMatrix() {


        this.projectionMatrix = mat4.create();

        mat4.perspective(this.projectionMatrix,
            this.fov,
            this.aspect,
            this.nearPlane,
            this.farPlane);

        console.log("projectionMatrix: ", this.projectionMatrix);
    }


    updateTranslateMatrix() {
        this.modelViewMatrix = mat4.create();

        mat4.translate(this.modelViewMatrix,
            this.modelViewMatrix,
            [0.0, 0.0, -10.0])
    }


    drawFrame(shaderPInfo, buffers) {

        console.log("Drawing frame with prog: ", shaderPInfo, " and buffers: ", buffers);
        this.glCtx.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        this.glCtx.clearDepth(1.0);                 // Clear everything
        this.glCtx.enable(this.glCtx.DEPTH_TEST);           // Enable depth testing
        this.glCtx.depthFunc(this.glCtx.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        this.glCtx.clear(this.glCtx.COLOR_BUFFER_BIT | this.glCtx.DEPTH_BUFFER_BIT);

        const numComponents = 2;  // pull out 2 values per iteration
        const type = this.glCtx.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, buffers.position);

        this.glCtx.vertexAttribPointer(
            shaderPInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        this.glCtx.enableVertexAttribArray(
            shaderPInfo.attribLocations.vertexPosition);


        // Tell WebGL to use our program when drawing

        this.glCtx.useProgram(shaderPInfo.program);

        // Set the shader uniforms

        this.glCtx.uniformMatrix4fv(
            shaderPInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
        this.glCtx.uniformMatrix4fv(
            shaderPInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);

        {
            const offset = 0;
            const vertexCount = 4;
            this.glCtx.drawArrays(this.glCtx.TRIANGLE_STRIP, offset, vertexCount);
            this.glCtx.flush();
            // offset = 4;
            // this.glCtx.drawArrays(this.glCtx.LINE_STRIP, offset, vertexCount);
            // this.glCtx.flush();
        }

    } // render frame 



    /**
     * renderContainer - renders container and all its children 
     * @param {SRContainer} container 
     */
    renderScreen(rootContainer) {
        console.log("Rendering root container", rootContainer);
        this._fillScreen();

        
        var nextContainer = rootContainer;
        while (typeof nextContainer != 'undefined' && nextContainer != null) {
            var shaderPInfo = this.shaderLib.getShaderProgram(nextContainer.shaderInfo);
            this._createModelBuffer(nextContainer);
            this._bindData(nextContainer, shaderPInfo);
            this._finallyRender();
            nextContainer = nextContainer.sibling;
        }
    }

    _createModelBuffer(baseComponent) {
        // // create model buffer 
        const buffer = this.glCtx.createBuffer();
        this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, buffer);
        this.glCtx.bufferData(this.glCtx.ARRAY_BUFFER,
            new Float32Array(baseComponent.vertices),
            this.glCtx.STATIC_DRAW);
    }

    _bindData(container, shaderPInfo) {
        console.log("bindData Info: ", shaderPInfo);
        const numComponents = 2;  // pull out 2 values per iteration
        const type = this.glCtx.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        // this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, buffers.position);

        // pass vertex attributes
        this.glCtx.vertexAttribPointer(
            shaderPInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);

        this.glCtx.enableVertexAttribArray(
            shaderPInfo.attribLocations.vertexPosition);


        // set shader program 
        this.glCtx.useProgram(shaderPInfo.program);


        // uniform 
        this.glCtx.uniformMatrix4fv(
            shaderPInfo.uniformLocations.projection,
            false,
            this.projectionMatrix);
        this.glCtx.uniformMatrix4fv(
            shaderPInfo.uniformLocations.modelView,
            false,
            this.modelViewMatrix);
        this.glCtx.uniform4f(shaderPInfo.uniformLocations.fillColor, container.color[0],
            container.color[1], container.color[2], container.color[3]);
    }

    _finallyRender() {
        const offset = 0;
        const vertexCount = 4;
        this.glCtx.drawArrays(this.glCtx.TRIANGLE_STRIP, offset, vertexCount);
        this.glCtx.flush();
    }

    _fillScreen() {
        this.glCtx.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        this.glCtx.clearDepth(1.0);                 // Clear everything
        this.glCtx.enable(this.glCtx.DEPTH_TEST);           // Enable depth testing
        this.glCtx.depthFunc(this.glCtx.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        this.glCtx.clear(this.glCtx.COLOR_BUFFER_BIT | this.glCtx.DEPTH_BUFFER_BIT);

    }
}