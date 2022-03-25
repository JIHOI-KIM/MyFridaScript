var modules = Process.enumerateModules()
var targetname = "%s"
var targetmode = false
var target = ""

if (targetname != "Default_value_newb1e")
{
	targetmode = true
	target = targetname
}

if (targetmode == false){
	for(var m in modules ){
		console.log( "["+m+"] " + modules[m].name + " : " + modules[m].base  )
	}
}
else{
	for(var m in modules){
		if( modules[m].name.includes(target) ){
		console.log( "["+m+"] " + modules[m].name + " : " + modules[m].base  )
		}
	}
}
