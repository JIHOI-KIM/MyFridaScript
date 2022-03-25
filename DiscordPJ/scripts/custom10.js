const BaseName = "discord_voice.node"
const offset = 0x001573e0

console.log("Script Loaded")

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);
var logpath = "/home/Sandbox/discord/myfrida/workbench/"
var count = 0

Interceptor.attach( addr_func, {
	onEnter: function(args) {

		count = count+1
		var len = args[2] >>> 0
		var packet = Memory.readByteArray(args[1], len)
		
		console.log("RemoteUser: " + args[0])
		console.log("Buffer: " + args[1])
		console.log(Memory.readByteArray(args[1],len))
		console.log("Length: " + args[2])
		console.log("ReceivedAt: " + args[3])
			
		var name = logpath + "log" + count + "_" + len + ".bin"
		var fp = new File(name, 'wb')
		fp.write(packet)
		fp.close()

	},
	onLeave: function(ret) {
	}
});
