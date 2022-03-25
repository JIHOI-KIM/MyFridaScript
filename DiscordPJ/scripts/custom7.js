//  Pthread_Create
const BaseName = "libpthread.so.0"
const offset = 0x000098d0

console.log("Script Loaded")

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);

Interceptor.attach( addr_func, {
	onEnter: function(args) {
	},
	onLeave: function(ret) {
		console.log("Pthread onLeave: " + ret);
		return ret;
	}
});
