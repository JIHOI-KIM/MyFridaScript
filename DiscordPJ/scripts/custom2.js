//ON INCOMMING

const BaseName = "discord_voice.node"
const offset = 0x001572d0

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);

Interceptor.attach( addr_func, {
	onEnter: function(args) {
		var dataLen = args[2] >>> 0;
		console.log("\ndataLen: " + dataLen.toString(10))
		var data = Memory.readByteArray(args[1], 32)
		console.log(data)
	},
	onLeave: function(ret) {
		return ret;
	}
});
