// SetTransPort 
const BaseName = "discord_voice.node"
const offset = 0x00126800
const offset2 = 0x001269e0

console.log("Script Loaded")

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);

// PacketReceived
var addr_func2 = addr_base.add(offset2);


Interceptor.attach( addr_func, {
	onEnter: function(args) {
		console.log("SetTransPort args[0] : " + args[0]);
		console.log("SetTransPort args[1] : " + args[1]);
	},
	onLeave: function(ret) {
	}
});


Interceptor.attach( addr_func2, {
	onEnter: function(args) {
		console.log("PacketReceived");
	},
	onLeave: function(ret) {
	}
});



