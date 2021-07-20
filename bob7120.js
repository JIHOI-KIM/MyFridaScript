console.log("-------------------------------------------")
console.log("Running [JIHOI FRIDA SCRIPT]")
console.log("-------------------------------------------")

var exitDoor = 0
while( exitDoor == 0 )
{
	exitDoor = 1
	var modules = Process.enumerateModules()
	var targetModule = null
	console.log("[+] Find " + modules.length + " Modules from program.")
	var find = 0
	for (var module of modules)
	{
		if (module.name == "mstscax.dll")
		{
			console.log("[+] ... Find mstscax.dll from Module list.")
			find = 1
			targetModule = module
		}
	}
	if(find == 0 )
	{
		console.log("Cannot find module mstscax.dll")
		break;
	}

	console.log("[INFO] "+targetModule.name+" Have "+targetModule.enumerateExports().length+" Exports and "+targetModule.enumerateImports().length+" Imports.")
	var targetBase = Module.findBaseAddress(targetModule.name)
	console.log("[INFO] "+targetModule.name+ " Base Address " + targetBase)

	console.log("[NOTICE] Cannot Find [ChannelOnPacketReceived()] from Exports.")
	console.log("[NOTICE] Analyze it manually...")
	var targetAdd = ptr(targetBase).add(ptr('0x7FF5EA813B8')).sub(ptr('0x7FF5E8F0000'))
	console.log("[NOTICE] Assume "+targetAdd +" is address of ChannelOnPacketReceived().")

	console.log("[+] Attatch Interceptor for " + targetAdd)
	Interceptor.attach(targetAdd, {
		onEnter: function (args)
		{
			console.log("[++] Funtcion [ChannelOnPacketReceived()] is called!")
			console.log("[++] arguments 0 (Int32 form) : " + args[0].toInt32())
			console.log("[++] arguments 1 (Int32 form) : " + args[1].toInt32())
			console.log("[++] arguments 2 (Int32 form) : " + args[2].toInt32())
		},

		onLeave: function (retval)
		{
			console.log("[--] Funtcion [ChannelOnPacketReceived()] return!")
			console.log("[--] return value : " + retval.toInt32())

		}
	})

}

if(exitDoor == 0)
{
	console.log("[-] Program End.")
}

if(exitDoor == 1)
{
	console.log("[+] Hooking Done.")
}
