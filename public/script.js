const hashData = data => {
	const sha1 = CryptoJS.algo.SHA1.create();
	sha1.update(data);

	return sha1.finalize().toString(CryptoJS.enc.Hex);
};

const webGLDebugData = () => {
	const canvas = document.createElement("canvas");
	const ctx1 = canvas.getContext("webgl"),
		ctx2 = canvas.getContext("experimental-webgl");

	return setDebugData(ctx1) || setDebugData(ctx2);
};

const setDebugData = ctx => {
	try {
		if (
			ctx.getSupportedExtensions().indexOf("WEBGL_debug_renderer_info") >=
			0
		) {
			const ext = ctx.getExtension("WEBGL_debug_renderer_info");
			return ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL);
		}
	} catch (e) {}

	return null;
};

const createWebGLImageAndReturnData = () => {
	var a;
	try {
		var b = document.createElement("canvas");
		b.style.cssText = "border: 2px solid navy";
		(b.width = 256),
			(b.height = 128),
			(a =
				b.getContext("webgl2", {
					preserveDrawingBuffer: !0,
				}) ||
				b.getContext("experimental-webgl2", {
					preserveDrawingBuffer: !0,
				}) ||
				b.getContext("webgl", {
					preserveDrawingBuffer: !0,
				}) ||
				b.getContext("experimental-webgl", {
					preserveDrawingBuffer: !0,
				}) ||
				b.getContext("moz-webgl", {
					preserveDrawingBuffer: !0,
				}));
	} catch (e) {
		console.warn("WebGL Image Hash", e);
	}
	if (null == a) return a;
	try {
		var d = a.createBuffer();
		a.bindBuffer(a.ARRAY_BUFFER, d);
		var e = new Float32Array([-0.3, 0.03, 0, 0.7, -0.5, 0, 0.37, 0.8, 0]);
		a.bufferData(a.ARRAY_BUFFER, e, a.STATIC_DRAW),
			(d.itemSize = 3),
			(d.numItems = 3);
		var f = a.createProgram(),
			g = a.createShader(a.VERTEX_SHADER);
		a.shaderSource(
			g,
			"attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"
		),
			a.compileShader(g);
		var h = a.createShader(a.FRAGMENT_SHADER);
		a.shaderSource(
			h,
			"precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"
		),
			a.compileShader(h),
			a.attachShader(f, g),
			a.attachShader(f, h),
			a.linkProgram(f),
			a.useProgram(f),
			(f.vertexPosAttrib = a.getAttribLocation(f, "attrVertex")),
			(f.offsetUniform = a.getUniformLocation(f, "uniformOffset")),
			a.enableVertexAttribArray(f.vertexPosArray),
			a.vertexAttribPointer(
				f.vertexPosAttrib,
				d.itemSize,
				a.FLOAT,
				!1,
				0,
				0
			),
			a.uniform2f(f.offsetUniform, 1, 1),
			a.drawArrays(a.TRIANGLE_STRIP, 0, d.numItems);
	} catch (e) {
		console.warn("Draw WebGL Image", e);
	}
	var info;
	try {
		var j = new Uint8Array(131072);
		if (
			(a.readPixels(0, 0, 256, 128, a.RGBA, a.UNSIGNED_BYTE, j),
			(info = JSON.stringify(j).replace(/,?"[0-9]+":/g, "")),
			"" == info.replace(/^{[0]+}$/g, ""))
		)
			throw (err = "JSON.stringify only ZEROes");
		return j;
	} catch (e) {
		console.warn("WebGL Image readPixels Hash", e);
	}

	return null;
};

const getCanvasDataURI = () => {
	try {
		const canvas = document.createElement("canvas");
		canvas.height = 60;
		canvas.width = 400;
		canvas.style.display = "inline";

		const canvasContext = canvas.getContext("2d");
		canvasContext.textBaseline = "alphabetic";
		canvasContext.fillStyle = "#f60";
		canvasContext.fillRect(125, 1, 62, 20);
		canvasContext.fillStyle = "#069";
		canvasContext.font = "11pt no-real-font-123";
		canvasContext.fillText(
			"Cwm fjordbank glyphs vext quiz, \ud83d\ude03",
			2,
			15
		);
		canvasContext.fillStyle = "rgba(102, 204, 0, 0.7)";
		canvasContext.font = "18pt Arial";
		canvasContext.fillText(
			"Cwm fjordbank glyphs vext quiz, \ud83d\ude03",
			4,
			45
		);

		const uri = canvas.toDataURL();
		if (uri && uri !== "data:,") {
			return uri;
		}
	} catch (e) {
		console.warn("getCanvasDataURI", e);
	}

	return null;
};

const run_pxi_fp = async () => {
	let pxi_output = 0;
	try {
		let context;
		if (
			((context = new (window.OfflineAudioContext ||
				window.webkitOfflineAudioContext)(1, 44100, 44100)),
			!context)
		) {
			return null;
		}

		// Create oscillator
		const pxi_oscillator = context.createOscillator();
		pxi_oscillator.type = "triangle";
		pxi_oscillator.frequency.value = 1e4;

		// Create and configure compressor
		const pxi_compressor = context.createDynamicsCompressor();
		pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
		pxi_compressor.knee && (pxi_compressor.knee.value = 40);
		pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
		pxi_compressor.reduction && (pxi_compressor.reduction.value = -20);
		pxi_compressor.attack && (pxi_compressor.attack.value = 0);
		pxi_compressor.release && (pxi_compressor.release.value = 0.25);

		// Connect nodes
		pxi_oscillator.connect(pxi_compressor);
		pxi_compressor.connect(context.destination);

		// Start audio processing
		pxi_oscillator.start(0);
		context.startRendering();

		return await new Promise(resolve => {
			context.oncomplete = event => {
				try {
					pxi_output = 0;
					let acc = "";
					for (let i = 0; i < event.renderedBuffer.length; i++) {
						acc += event.renderedBuffer
							.getChannelData(0)
							[i].toString();
					}

					for (let i = 4500; 5e3 > i; i++) {
						pxi_output += Math.abs(
							event.renderedBuffer.getChannelData(0)[i]
						);
					}

					resolve({ buffer: acc, checksum: pxi_output.toString() });
				} finally {
					pxi_compressor.disconnect();
				}
			};
		});
	} catch (e) {}

	return null;
};

// function getIframeRects() {
// 	if (!document.getElementById("rects-iframe")) {
// 		const iframe = document.createElement("iframe");
// 		iframe.src = `data:text/html;charset=utf-8,${encodeURIComponent(RECT_HTML)}`;
// 		iframe.id = "rects-iframe";
// 		document.body.appendChild(iframe);
// 	}
	
// 	function ucFirst(a) {
// 		return a.charAt(0).toUpperCase() + a.substr(1, a.length - 1);
// 	}
// 	var e = ["", "", ""],
// 		d = [],
// 		f = "";
// 	for (var iframe = document.getElementById("rects-iframe").contentWindow.document, h = 0; h < 3; h++) {
// 		console.log(iframe)

// 		var rect = iframe.getElementById("rect" + h);
// 		(d[h] = rect.getClientRects()[0]),
// 			(rect.style.border = "1px #eee solid");
// 		var box = iframe.getElementById("box" + h);
// 		box.style.display = "block";
// 		box.top = d[h].top;
// 		box.left = d[h].left;
// 		box.width = d[h].width;
// 		box.height = d[h].height;
// 		box.borderColor = ["red", "green", "blue"][h];
// 	}
// 	iframe.getElementById("self").classList.add("on");

// 	for (var i in d[0])
// 		if ("function" != typeof d[0][i]) {
// 			for (var h = 0; h < 3; h++) e[h] += d[h][i];
// 			f +=
// 				"<tr><td>" +
// 				ucFirst(i) +
// 				'</td><td class="br2">' +
// 				d[0][i] +
// 				'</td><td class="br">' +
// 				ucFirst(i) +
// 				'</td><td class="br2">' +
// 				d[1][i] +
// 				'</td><td class="br">' +
// 				ucFirst(i) +
// 				"</td><td>" +
// 				d[2][i] +
// 				"</td></tr>";
// 		}

// 	return e;
// }

const glDebugRenderer = webGLDebugData();
const readPixels = hashData(JSON.stringify(createWebGLImageAndReturnData()));
const canvas = hashData(getCanvasDataURI());
const pxiResult = await run_pxi_fp();
const pxiChecksum = pxiResult ? hashData(pxiResult.checksum) : null;
const pxiFullBufferHash = pxiResult ? hashData(pxiResult.buffer) : null;
// const getClientRects = getIframeRects();

console.log("glDebugRenderer", glDebugRenderer);
console.log("canvas", canvas);
console.log("readPixels", readPixels);
console.log("pxiChecksum", pxiChecksum);
console.log("pxiFullBufferHash", pxiFullBufferHash);
// console.log("getClientRects", getClientRects);

const iv = CryptoJS.lib.WordArray.random(16);
console.log(iv)

const encrypted = CryptoJS.AES.encrypt(JSON.stringify({
	glDebugRenderer,
	canvas,
	readPixels,
	pxiChecksum,
	pxiFullBufferHash,
	// getClientRects
}), CryptoJS.enc.Hex.parse(KEY), { iv });

fetch(POST_URL, { method: "POST", body: `${CryptoJS.enc.Latin1.stringify(iv)}${CryptoJS.enc.Latin1.stringify(encrypted.ciphertext)}` });