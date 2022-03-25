const BaseName = "discord_voice.node"
const offset = 0x00169250

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);

Interceptor.attach( addr_func, {
	onEnter: function(args) {
		var dataPtr = Memory.readPointer(args[2])
		console.log(dataPtr)
		var data = Memory.readByteArray(dataPtr, 0x30)
		console.log(data)
	},
	onLeave: function(ret) {
		return ret;
	}
});
