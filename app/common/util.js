const stream = require('stream');
exports.toSream = buf => {
	const bufferStream = new stream.PassThrough();
	// 将Buffer写入
	bufferStream.end(buf);
	return bufferStream;
	// 进一步使用
	// bufferStream.pipe(process.stdout)
};
exports.toArrayBuffer = buf => {
	const ab = new ArrayBuffer(buf.length);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; ++i) {
		view[i] = buf[i];
	}
	return ab;
};
exports.toBuffer = ab => {
	const buf = new Buffer(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; ++i) {
		buf[i] = view[i];
	}
	return buf;
};
