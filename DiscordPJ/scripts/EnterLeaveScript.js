// SCRIPT INPUTS
// String Values
const EnterLeaveScript_name = '%s';
const EnterLeaveScript_base = '%s';
// Direct Values
const EnterLeaveScript_offset = %s;
const EnterLeaveScript_onEnterFlag = %s;
const EnterLeaveScript_onLeaveFlag = %s;

// RENDER SCRIPT
var EnterLeaveScript_BaseName = EnterLeaveScript_base;
var EnterLeaveScript_addr_base = Module.findBaseAddress(EnterLeaveScript_BaseName);
console.log("[+EnterLeaveScript.js] Base Address " + EnterLeaveScript_addr_base);

var EnterLeaveScript_addr_func = EnterLeaveScript_addr_base.add(EnterLeaveScript_offset)
console.log("[+EnterLeaveScript.js] Func Address " + EnterLeaveScript_addr_func);

Interceptor.attach( EnterLeaveScript_addr_func, {
	onEnter: function(args) {
		if(EnterLeaveScript_onEnterFlag)
		{
			console.log("[+"+ EnterLeaveScript_name + "] onEnter");
		}
	},
	onLeave: function(ret){
		if(EnterLeaveScript_onLeaveFlag)
		{
			console.log("[+"+ EnterLeaveScript_name + "] onLeave");
		}


		return ret
	}
});

console.log("[+EnterLeaveScript.js] Hooking Ready.");
