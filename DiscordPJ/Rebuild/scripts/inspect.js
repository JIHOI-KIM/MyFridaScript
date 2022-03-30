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
	
	var gap = 0x100 >>> 0

	// CASE DUPLICATE
	if( address in ObjList ){ console.log("DUPLICATE WITH " + ObjList[address]); return ObjList[address]; }

	// CASE SAME RANGE 
	for (var ind in ObjList)
	{ 	
		var nowgap = (ind - address) >>> 0
		if (nowgap < (gap)){
			console.log("DUPLICATE WITH " + ObjList[ind]) 
			var name = ObjList[ind]+"_0x"+nowgap.toString(16)
			return name
		}
	}

	var Fp = new File(itempath+"/"+ObjList[address], "wt")

	// CASE NEW
	ObjList[address] = "STRUCT_"+objnum
	objnum = objnum+1
	if (objnum > 4000) {return}

	console.log("NEW STRUCT " + objnum + " at " + address)

	// RECURSIVE
	for(var i = 0; i< gap; i+=0x08)
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
			//console.log(value +" is Not a Pointer")
			Fp.write(value.toString(16))
		}
		else if (IsHeapPointer(value)){
			//console.log(value +" is a Heap Struct Pointer")
			var retName = SaveStruct(value)
			Fp.write(retName)
		}
		else if (IsLibPointer(value)){
			//console.log(value +" is a Library Pointer")
			var ModOffset = getModuleOffsetStr(value)
			Fp.write(ModOffset)
		}
		else{
			//console.log(value +" May Not a Pointer")
			Fp.write(value.toString(16))
		}
		Fp.write("\n")
	}
	Fp.close()

	return ObjList[address]
}

Interceptor.attach( addr_func, {     
    onEnter: function(args) {     
        if(flag < 1)    
        {     
            flag = flag+1;
			console.log("Start")
			SaveStruct(args[0])
			console.log("End")
        }     
    },    
    onLeave: function(ret) {     
    }     
});

