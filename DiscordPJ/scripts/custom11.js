const BaseName = "discord_voice.node"
const offset = 0x0024b840

console.log("Script Loaded")

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);
var flag = 0
var logpath = "/home/Sandbox/discord/myfrida/workbench/"

console.log(addr_base);
Interceptor.attach( addr_func, {
	onEnter: function(args) {
		if(flag < 1)
		{
			flag = flag+1;
			console.log(this.context.rdi);
			var vTable = Memory.readPointer(this.context.rdi);
			console.log(vTable)
			console.log(Memory.readByteArray(vTable,32))
			var L1 = Memory.readPointer(vTable.add(8))
			console.log(Memory.readByteArray(L1, 32))
		}
	},
	onLeave: function(ret) {
	}
});
