console.log("[inspect.js] Script Start")
console.log("[inspect.js] Heap Area Specified " + HeapBag.length)
console.log("[inspect.js] Lib Area Specified " + LibBag.length)

const BaseName = "discord_voice.node"     
const offset = 0x0024b840    
    
var addr_base = Module.findBaseAddress(BaseName);    
var addr_func = addr_base.add(offset);    
var flag = 0

var mappingpath = itempath + "/mapping"
console.log("[inspect.js] Log Path Specified" + mappingpath)

var ObjList = {}
var objnum = 0

function IsPointer(address){
	if ((address % 0x08) == 0) return true;
}

function IsHeapPointer(address){
	for (var ind in HeapBag){
		var start = HeapBag[ind][0]
		var end = HeapBag[ind][1]

		if((address >= start) && (address <= end))
		{
			return true	
		}
	}
	return false
}

function IsLibPointer(address){
	for (var ind in LibBag){
		var start = LibBag[ind][0]
		var end = LibBag[ind][1]

		if((address >= start) && (address <= end))
		{
			return true	
		}
	}
	return false
}

function getModuleOffsetStr(value){
	
	var name = ""
	var offset = ""

	for (var ind in LibBag){
		var start = LibBag[ind][0]
		var end = LibBag[ind][1]

		if((value >= start) && (value <= end))
		{
			name = LibBag[ind][2].split("/").pop()
			offset = value - start
		}
	}

	return name +"_0x" +offset.toString(16)
}

function SaveStruct(address){
	
	if (address in ObjList){ return }
	ObjList[address] = "STRUCT_"+objnum
	objnum = objnum+1

	var Fp = new File(itempath+"/"+ObjList[address], "wt")
	for(var i = 0; i< 0x400; i+=0x08)
	{
		var pointer = address.add(i)
		var value = 0
		try
		{
			value = Memory.readPointer(pointer)
		}
		catch(e)
		{
			console.log("[inspect.js] UnDefined Pointer Reference to "+pointer)
		}

		if (!IsPointer(value))	
		{
			console.log(value +" is Not a Pointer")
			Fp.write(value.toString())
		}
		else if (IsHeapPointer(value)){
			console.log(value +" is a Heap Struct Pointer")
			SaveStruct(value)
			Fp.write(ObjList[value])
		}
		else if (IsLibPointer(value)){
			console.log(value +" is a Library Pointer")
			var ModOffset = getModuleOffsetStr(value)
			Fp.write(ModOffset)
		}
		else{
			console.log(value +" May Not a Pointer")
			Fp.write(value.toString())
		}
		Fp.write("\n")
	}
	Fp.close()
}

Interceptor.attach( addr_func, {     
    onEnter: function(args) {     
        if(flag < 1)    
        {     
            flag = flag+1;
			console.log(args[0])
			console.log(IsHeapPointer(args[0]))
        }     
    },    
    onLeave: function(ret) {     
    }     
});

