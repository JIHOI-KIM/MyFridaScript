// On Incomming RTP Video
const BaseName = "discord_voice.node"
const offset = 0x002eea40

console.log("Script Loaded")

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);

Interceptor.attach( addr_func, {
	onEnter: function(args) {
		console.log(this.threadId);
	},
	onLeave: function(ret) {
		return ret;
	}
});
