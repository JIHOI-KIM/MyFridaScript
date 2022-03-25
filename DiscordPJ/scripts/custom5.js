// On Incomming RTP Video
const BaseName = "discord_voice.node"
const offset = 0x001572d0

console.log("Script Loaded")

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);

Interceptor.attach( addr_func, {
	onEnter: function(args) {
		var dataLen = args[3] >>> 0;
		console.log("\ndataLen: " + dataLen.toString(10))
		var data = Memory.readByteArray(args[2], dataLen)
		console.log(data)
	},
	onLeave: function(ret) {
		return ret;
	}
});
