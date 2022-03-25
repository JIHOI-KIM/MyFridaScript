// SetTransPort 
const BaseName = "discord_voice.node"
const offset = 0x00157c60

console.log("Script Loaded")

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);
var func1_offset = 0x002477b0;
//var func1_offset = 0x0011d800;
var func1 = addr_base.add(func1_offset);
var func2_offset = 0x0024c4a0;
var func2 = addr_base.add(func2_offset);

Interceptor.attach( addr_func, {
	onEnter: function(args) {
		var temp = Memory.readPointer(args[0]);
		console.log(temp)
		console.log(temp.sub(addr_base));
		var ba = Memory.readByteArray(args[0], 0x20);
		console.log(ba)
	},
	onLeave: function(ret) {
		console.log(" ");
	}
});

Interceptor.attach(func1 , {
	onEnter: function(args){
//		console.log("Called Func1");
	},
	onLeave: function(ret){

	}
});

Interceptor.attach(func2 , {
	onEnter: function(args){
//		console.log("Called Func2");
	},
	onLeave: function(ret){

	}
});
