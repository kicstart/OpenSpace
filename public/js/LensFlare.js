/**
 * @author Mikael Emtinger
 */
 
THREE.LensFlare = function ( texture, size, distance, blending ) {

	THREE.Object3D.call( this );

	this.positionScreen = new THREE.Vector3();
	this.lensFlares = [];
	this.customUpdateCallback = undefined;

	if( texture !== undefined ) {

		this.add( texture, size, distance, blending );

	}

};

THREE.LensFlare.prototype = new THREE.Object3D();
THREE.LensFlare.prototype.constructor = THREE.LensFlare;
THREE.LensFlare.prototype.supr = THREE.Object3D.prototype;


/*
 * Add: adds another flare 
 */

THREE.LensFlare.prototype.add = function( texture, size, distance, blending ) {

	if( size === undefined ) size = -1;
	if( distance === undefined ) distance = 0;
	if( blending === undefined ) blending = THREE.BillboardBlending;

	distance = Math.min( distance, Math.max( 0, distance ));

	this.lensFlares.push( { texture: texture, 			// THREE.Texture
		                    size: size, 				// size in pixels (-1 = use texture.width)
		                    distance: distance, 		// distance (0-1) from light source (0=at light source)
		                    x: 0, y: 0, z: 0,			// screen position (-1 => 1) z = 0 is ontop z = 1 is back 
		                    scale: 1, 					// scale
		                    rotation: 1, 				// rotation
		                    opacity: 1,					// opacity
		                    blending: blending } );		// blending

};


/*
 * Update lens flares update positions on all flares based on the screen position
 * Set myLensFlare.customUpdateCallback to alter the flares in your project specific way.
 */

THREE.LensFlare.prototype.updateLensFlares = function() {

	var f, fl = this.lensFlares.length;
	var flare;
	var vecX = -this.positionScreen.x * 2;
	var vecY = -this.positionScreen.y * 2; 


	for( f = 0; f < fl; f++ ) {

		flare = this.lensFlares[ f ];

		flare.x = this.positionScreen.x + vecX * flare.distance;
		flare.y = this.positionScreen.y + vecY * flare.distance;

		flare.wantedRotation = flare.x * Math.PI * 0.25;
		flare.rotation += ( flare.wantedRotation - flare.rotation ) * 0.25;

	}

};

THREE.LensFlarePlugin = function () {
    function a(a) {
        var c = b.createProgram(),
            d = b.createShader(b.FRAGMENT_SHADER),
            h = b.createShader(b.VERTEX_SHADER);
        b.shaderSource(d, a.fragmentShader);
        b.shaderSource(h, a.vertexShader);
        b.compileShader(d);
        b.compileShader(h);
        b.attachShader(c, d);
        b.attachShader(c, h);
        b.linkProgram(c);
        return c
    }
    var b, c, d = {};
    this.init = function (e) {
        b = e.context;
        c = e;
        d.vertices = new Float32Array(16);
        d.faces = new Uint16Array(6);
        e = 0;
        d.vertices[e++] = -1;
        d.vertices[e++] = -1;
        d.vertices[e++] = 0;
        d.vertices[e++] = 0;
        d.vertices[e++] = 1;
        d.vertices[e++] = -1;
        d.vertices[e++] = 1;
        d.vertices[e++] = 0;
        d.vertices[e++] = 1;
        d.vertices[e++] = 1;
        d.vertices[e++] = 1;
        d.vertices[e++] = 1;
        d.vertices[e++] = -1;
        d.vertices[e++] = 1;
        d.vertices[e++] = 0;
        d.vertices[e++] = 1;
        e = 0;
        d.faces[e++] = 0;
        d.faces[e++] = 1;
        d.faces[e++] = 2;
        d.faces[e++] = 0;
        d.faces[e++] = 2;
        d.faces[e++] = 3;
        d.vertexBuffer = b.createBuffer();
        d.elementBuffer = b.createBuffer();
        b.bindBuffer(b.ARRAY_BUFFER, d.vertexBuffer);
        b.bufferData(b.ARRAY_BUFFER, d.vertices, b.STATIC_DRAW);
        b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, d.elementBuffer);
        b.bufferData(b.ELEMENT_ARRAY_BUFFER, d.faces, b.STATIC_DRAW);
        d.tempTexture = b.createTexture();
        d.occlusionTexture = b.createTexture();
        b.bindTexture(b.TEXTURE_2D, d.tempTexture);
        b.texImage2D(b.TEXTURE_2D, 0, b.RGB, 16, 16, 0, b.RGB, b.UNSIGNED_BYTE, null);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
        b.bindTexture(b.TEXTURE_2D, d.occlusionTexture);
        b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, 16, 16, 0, b.RGBA, b.UNSIGNED_BYTE, null);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
        b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS) <= 0 ? (d.hasVertexTexture = !1, d.program = a(THREE.ShaderFlares.lensFlare)) : (d.hasVertexTexture = !0, d.program = a(THREE.ShaderFlares.lensFlareVertexTexture));
        d.attributes = {};
        d.uniforms = {};
        d.attributes.vertex = b.getAttribLocation(d.program, "position");
        d.attributes.uv = b.getAttribLocation(d.program, "uv");
        d.uniforms.renderType = b.getUniformLocation(d.program, "renderType");
        d.uniforms.map = b.getUniformLocation(d.program, "map");
        d.uniforms.occlusionMap = b.getUniformLocation(d.program, "occlusionMap");
        d.uniforms.opacity = b.getUniformLocation(d.program, "opacity");
        d.uniforms.color = b.getUniformLocation(d.program, "color");
        d.uniforms.scale = b.getUniformLocation(d.program, "scale");
        d.uniforms.rotation = b.getUniformLocation(d.program, "rotation");
        d.uniforms.screenPosition = b.getUniformLocation(d.program, "screenPosition");
        d.attributesEnabled = !1
    };
    this.render = function (a, g, f, h) {
        var a = a.__webglFlares,
            i, l, k = a.length,
            o, p, m, r = new THREE.Vector3,
            n = h / f,
            q = f * 0.5,
            t = h * 0.5,
            v = 16 / h,
            z = new THREE.Vector2(v * n, v),
            u = new THREE.Vector3(1, 1, 0),
            B = new THREE.Vector2(1, 1),
            A = d.uniforms;
        i = d.attributes;
        b.useProgram(d.program);
        if (!d.attributesEnabled) b.enableVertexAttribArray(d.attributes.vertex), b.enableVertexAttribArray(d.attributes.uv), d.attributesEnabled = !0;
        b.uniform1i(A.occlusionMap, 0);
        b.uniform1i(A.map, 1);
        b.bindBuffer(b.ARRAY_BUFFER, d.vertexBuffer);
        b.vertexAttribPointer(i.vertex, 2, b.FLOAT, !1, 16, 0);
        b.vertexAttribPointer(i.uv, 2, b.FLOAT, !1, 16, 8);
        b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, d.elementBuffer);
        b.disable(b.CULL_FACE);
        b.depthMask(!1);
        for (l = 0; l < k; l++) if (v = 16 / h, z.set(v * n, v), i = a[l], r.set(i.matrixWorld.n14, i.matrixWorld.n24, i.matrixWorld.n34), g.matrixWorldInverse.multiplyVector3(r), g.projectionMatrix.multiplyVector3(r), u.copy(r), B.x = u.x * q + q, B.y = u.y * t + t, d.hasVertexTexture || B.x > 0 && B.x < f && B.y > 0 && B.y < h) {
            b.activeTexture(b.TEXTURE1);
            b.bindTexture(b.TEXTURE_2D, d.tempTexture);
            b.copyTexImage2D(b.TEXTURE_2D, 0, b.RGB, B.x - 8, B.y - 8, 16, 16, 0);
            b.uniform1i(A.renderType, 0);
            b.uniform2f(A.scale, z.x, z.y);
            b.uniform3f(A.screenPosition, u.x, u.y, u.z);
            b.disable(b.BLEND);
            b.enable(b.DEPTH_TEST);
            b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0);
            b.activeTexture(b.TEXTURE0);
            b.bindTexture(b.TEXTURE_2D, d.occlusionTexture);
            b.copyTexImage2D(b.TEXTURE_2D, 0, b.RGBA, B.x - 8, B.y - 8, 16, 16, 0);
            b.uniform1i(A.renderType, 1);
            b.disable(b.DEPTH_TEST);
            b.activeTexture(b.TEXTURE1);
            b.bindTexture(b.TEXTURE_2D, d.tempTexture);
            b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0);
            i.positionScreen.copy(u);
            i.customUpdateCallback ? i.customUpdateCallback(i) : i.updateLensFlares();
            b.uniform1i(A.renderType, 2);
            b.enable(b.BLEND);
            o = 0;
            for (p = i.lensFlares.length; o < p; o++) if (m = i.lensFlares[o], m.opacity > 0.0010 && m.scale > 0.0010) u.x = m.x, u.y = m.y, u.z = m.z, v = m.size * m.scale / h, z.x = v * n, z.y = v, b.uniform3f(A.screenPosition, u.x, u.y, u.z), b.uniform2f(A.scale, z.x, z.y), b.uniform1f(A.rotation, m.rotation), b.uniform1f(A.opacity, m.opacity), b.uniform3f(A.color, m.color.r, m.color.g, m.color.b), c.setBlending(m.blending), c.setTexture(m.texture, 1), b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0)
        }
        b.enable(b.CULL_FACE);
        b.enable(b.DEPTH_TEST);
        b.depthMask(!0)
    }
};
if (THREE.WebGLRenderer) THREE.AnaglyphWebGLRenderer = function (a) {
    THREE.WebGLRenderer.call(this, a);
    this.autoUpdateScene = !1;
    var b = this,
        c = this.setSize,
        d = this.render,
        e = new THREE.PerspectiveCamera,
        g = new THREE.PerspectiveCamera,
        f = new THREE.Matrix4,
        h = new THREE.Matrix4,
        i, l, k, o;
    e.matrixAutoUpdate = g.matrixAutoUpdate = !1;
    var a = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    },
        p = new THREE.WebGLRenderTarget(512, 512, a),
        m = new THREE.WebGLRenderTarget(512, 512, a),
        r = new THREE.PerspectiveCamera(53, 1, 1, 1E4);
    r.position.z = 2;
    var a = new THREE.ShaderMaterial({
        uniforms: {
            mapLeft: {
                type: "t",
                value: 0,
                texture: p
            },
            mapRight: {
                type: "t",
                value: 1,
                texture: m
            }
        },
        vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1.0 - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
        fragmentShader: "uniform sampler2D mapLeft;\nuniform sampler2D mapRight;\nvarying vec2 vUv;\nvoid main() {\nvec4 colorL, colorR;\nvec2 uv = vUv;\ncolorL = texture2D( mapLeft, uv );\ncolorR = texture2D( mapRight, uv );\ngl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;\n}"
    }),
        n = new THREE.Scene;
    n.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), a));
    n.add(r);
    this.setSize = function (a, d) {
        c.call(b, a, d);
        p.width = a;
        p.height = d;
        m.width = a;
        m.height = d
    };
    this.render = function (a, c) {
        a.updateMatrixWorld();
        if (i !== c.aspect || l !== c.near || k !== c.far || o !== c.fov) {
            i = c.aspect;
            l = c.near;
            k = c.far;
            o = c.fov;
            var v = c.projectionMatrix.clone(),
                z = 125 / 30 * 0.5,
                u = z * l / 125,
                B = l * Math.tan(o * Math.PI / 360),
                A;
            f.n14 = z;
            h.n14 = -z;
            z = -B * i + u;
            A = B * i + u;
            v.n11 = 2 * l / (A - z);
            v.n13 = (A + z) / (A - z);
            e.projectionMatrix.copy(v);
            z = -B * i - u;
            A = B * i - u;
            v.n11 = 2 * l / (A - z);
            v.n13 = (A + z) / (A - z);
            g.projectionMatrix.copy(v)
        }
        e.matrixWorld.copy(c.matrixWorld).multiplySelf(h);
        e.position.copy(c.position);
        e.near = c.near;
        e.far = c.far;
        d.call(b, a, e, p, !0);
        g.matrixWorld.copy(c.matrixWorld).multiplySelf(f);
        g.position.copy(c.position);
        g.near = c.near;
        g.far = c.far;
        d.call(b, a, g, m, !0);
        n.updateMatrixWorld();
        d.call(b, n, r)
    }
};
if (THREE.WebGLRenderer) THREE.CrosseyedWebGLRenderer = function (a) {
    THREE.WebGLRenderer.call(this, a);
    this.autoClear = !1;
    var b = this,
        c = this.setSize,
        d = this.render,
        e, g, f = new THREE.PerspectiveCamera;
    f.target = new THREE.Vector3(0, 0, 0);
    var h = new THREE.PerspectiveCamera;
    h.target = new THREE.Vector3(0, 0, 0);
    b.separation = 10;
    if (a && a.separation !== void 0) b.separation = a.separation;
    this.setSize = function (a, d) {
        c.call(b, a, d);
        e = a / 2;
        g = d
    };
    this.render = function (a, c) {
        this.clear();
        f.fov = c.fov;
        f.aspect = 0.5 * c.aspect;
        f.near = c.near;
        f.far = c.far;
        f.updateProjectionMatrix();
        f.position.copy(c.position);
        f.target.copy(c.target);
        f.translateX(b.separation);
        f.lookAt(f.target);
        h.projectionMatrix = f.projectionMatrix;
        h.position.copy(c.position);
        h.target.copy(c.target);
        h.translateX(-b.separation);
        h.lookAt(h.target);
        this.setViewport(0, 0, e, g);
        d.call(b, a, f);
        this.setViewport(e, 0, e, g);
        d.call(b, a, h, !1)
    }
};
THREE.ShaderFlares = {
    lensFlareVertexTexture: {
        vertexShader: "uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility = (       visibility.r / 9.0 ) *\n( 1.0 - visibility.g / 9.0 ) *\n(       visibility.b / 9.0 ) *\n( 1.0 - visibility.a / 9.0 );\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
        fragmentShader: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D map;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"
    },
    lensFlare: {
        vertexShader: "uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
        fragmentShader: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"
    }
};

modifyRenderer = function(renderer){
  renderer.renderPlugins = []
  renderer.addPlugin = function(a){
    a.init(this);
    this.renderPlugins.push(a);
  };
  renderer.render = function (a, b, c, d) {
        var e, g, f, h, i = a.lights,
            n = a.fog;
        fa = -1;
        this.autoUpdateObjects && this.initWebGLObjects(a);
        b.parent === void 0 && (console.warn("DEPRECATED: Camera hasn't been added to a Scene. Adding it..."), a.add(b));
        this.autoUpdateScene && a.updateMatrixWorld();
        this.shadowMapEnabled && this.shadowMapAutoUpdate && p(a, b);
        R.info.render.calls = 0;
        R.info.render.vertices = 0;
        R.info.render.faces = 0;
        b.matrixWorldInverse.getInverse(b.matrixWorld);
        b.matrixWorldInverse.flattenToArray(aa);
        b.projectionMatrix.flattenToArray(P);
        J.multiply(b.projectionMatrix, b.matrixWorldInverse);
        l(J);
        U(c);
        (this.autoClear || d) && this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil);
        h = a.__webglObjects;
        d = 0;
        for (e = h.length; d < e; d++) if (g = h[d], f = g.object, g.render = !1, f.visible && (!(f instanceof THREE.Mesh) || !f.frustumCulled || k(f))) {
            f.matrixWorld.flattenToArray(f._objectMatrixArray);
            B(f, b, !0);
            var K = g,
                q = K.object,
                t = K.buffer,
                v = void 0,
                v = v = void 0,
                v = q.material;
            if (v instanceof THREE.MeshFaceMaterial) {
                if (v = t.materialIndex, v >= 0) v = q.geometry.materials[v], v.transparent ? (K.transparent = v, K.opaque = null) : (K.opaque = v, K.transparent = null)
            } else if (v) v.transparent ? (K.transparent = v, K.opaque = null) : (K.opaque = v, K.transparent = null);
            g.render = !0;
            if (this.sortObjects) f.renderDepth ? g.z = f.renderDepth : (Y.copy(f.position), J.multiplyVector3(Y), g.z = Y.z)
        }
        this.sortObjects && h.sort(o);
        h = a.__webglObjectsImmediate;
        d = 0;
        for (e = h.length; d < e; d++) if (g = h[d], f = g.object, f.visible) f.matrixAutoUpdate && f.matrixWorld.flattenToArray(f._objectMatrixArray), B(f, b, !0), f = g.object.material, f.transparent ? (g.transparent = f, g.opaque = null) : (g.opaque = f, g.transparent = null);
        a.overrideMaterial ? (this.setBlending(a.overrideMaterial.blending), F(a.overrideMaterial.depthTest), H(a.overrideMaterial.depthWrite), E(a.overrideMaterial.polygonOffset, a.overrideMaterial.polygonOffsetFactor, a.overrideMaterial.polygonOffsetUnits), m(a.__webglObjects, !1, "", b, i, n, !0, a.overrideMaterial), r(a.__webglObjectsImmediate, "", b, i, n, !1, a.overrideMaterial)) : (this.setBlending(THREE.NormalBlending), m(a.__webglObjects, !0, "opaque", b, i, n, !1), r(a.__webglObjectsImmediate, "opaque", b, i, n, !1), m(a.__webglObjects, !1, "transparent", b, i, n, !0), r(a.__webglObjectsImmediate, "transparent", b, i, n, !0));
        if (a.__webglSprites.length) {
            f = M.attributes;
            i = M.uniforms;
            n = S / ea;
            d = [];
            e = ea * 0.5;
            h = S * 0.5;
            g = !0;
            j.useProgram(M.program);
            O = M.program;
            W = pa = oa = -1;
            wa || (j.enableVertexAttribArray(M.attributes.position), j.enableVertexAttribArray(M.attributes.uv), wa = !0);
            j.disable(j.CULL_FACE);
            j.enable(j.BLEND);
            j.depthMask(!0);
            j.bindBuffer(j.ARRAY_BUFFER, M.vertexBuffer);
            j.vertexAttribPointer(f.position, 2, j.FLOAT, !1, 16, 0);
            j.vertexAttribPointer(f.uv, 2, j.FLOAT, !1, 16, 8);
            j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, M.elementBuffer);
            j.uniformMatrix4fv(i.projectionMatrix, !1, P);
            j.activeTexture(j.TEXTURE0);
            j.uniform1i(i.map, 0);
            f = 0;
            for (K = a.__webglSprites.length; f < K; f++) if (q = a.__webglSprites[f], q.visible && q.opacity !== 0) q.useScreenCoordinates ? q.z = -q.position.z : (q._modelViewMatrix.multiplyToArray(b.matrixWorldInverse, q.matrixWorld, q._modelViewMatrixArray), q.z = -q._modelViewMatrix.n34);
            a.__webglSprites.sort(o);
            f = 0;
            for (K = a.__webglSprites.length; f < K; f++) q = a.__webglSprites[f], q.visible && q.opacity !== 0 && q.map && q.map.image && q.map.image.width && (q.useScreenCoordinates ? (j.uniform1i(i.useScreenCoordinates, 1), j.uniform3f(i.screenPosition, (q.position.x - e) / e, (h - q.position.y) / h, Math.max(0, Math.min(1, q.position.z)))) : (j.uniform1i(i.useScreenCoordinates, 0), j.uniform1i(i.affectedByDistance, q.affectedByDistance ? 1 : 0), j.uniformMatrix4fv(i.modelViewMatrix, !1, q._modelViewMatrixArray)), t = q.map.image.width / (q.scaleByViewport ? S : 1), d[0] = t * n * q.scale.x, d[1] = t * q.scale.y, j.uniform2f(i.uvScale, q.uvScale.x, q.uvScale.y), j.uniform2f(i.uvOffset, q.uvOffset.x, q.uvOffset.y), j.uniform2f(i.alignment, q.alignment.x, q.alignment.y), j.uniform1f(i.opacity, q.opacity), j.uniform3f(i.color, q.color.r, q.color.g, q.color.b), j.uniform1f(i.rotation, q.rotation), j.uniform2fv(i.scale, d), q.mergeWith3D && !g ? (j.enable(j.DEPTH_TEST), g = !0) : !q.mergeWith3D && g && (j.disable(j.DEPTH_TEST), g = !1), R.setBlending(q.blending), R.setTexture(q.map, 0), j.drawElements(j.TRIANGLES, 6, j.UNSIGNED_SHORT, 0));
            j.enable(j.CULL_FACE);
            j.enable(j.DEPTH_TEST);
            j.depthMask(sa)
        }
        if (this.renderPlugins.length) {
            d = 0;
            for (e = this.renderPlugins.length; d < e; d++) this.renderPlugins[d].render(a, b, ea, S), O = null, W = sa = pa = oa = -1
        }
        c && c.minFilter !== THREE.NearestFilter && c.minFilter !== THREE.LinearFilter && (c instanceof THREE.WebGLRenderTargetCube ? (j.bindTexture(j.TEXTURE_CUBE_MAP, c.__webglTexture), j.generateMipmap(j.TEXTURE_CUBE_MAP), j.bindTexture(j.TEXTURE_CUBE_MAP, null)) : (j.bindTexture(j.TEXTURE_2D, c.__webglTexture), j.generateMipmap(j.TEXTURE_2D), j.bindTexture(j.TEXTURE_2D, null)))
    };
};
