import frida
import sys
import psutil
import os


filename = ""
itempath = ""
mapfile = os.path.join(sys.argv[2], "mapping") 

################################### PROTO API

def BringScript(name) :

    filename = name
    fp = open(filename, "rt")
    content = fp.read()
    fp.close()
    
    return content

#################################### CORE API

def pushRange(arrayname, start, end, name) :
    value = ""
    value += arrayname
    value += ".push("
    value += "[0x"
    value += start
    value += ",0x"
    value += end
    value += ","
    value += "\"%s\"" % name
    value += "])\n"

    return value

def AddItemPath(content) :
    global itempath
    itemPathStr = "var itempath = \"%s\"\n" % itempath
    return itemPathStr + content


def AddHeapRange(content) :
    heapStr = "var HeapBag = []\n"

    try :
        mapFp = open(mapfile+"_Heap.bin", "rt")
        maptext = mapFp.readlines()
        mapFp.close()

        for line in maptext :
           parsed = line.split(" ")
           start = parsed[0]
           end = parsed[1]
           name = parsed[2][:-1]

           heapStr += pushRange("HeapBag", start, end, name)

    except :
        print("[checkStruct.py] Error on Reading mapfile")
        exit(0)

    return heapStr + content + "\n\n" 

def AddLibRange(content) :
    libStr = "var LibBag = []\n"

    try :
        mapFp = open(mapfile+"_Lib.bin", "rt")
        maptext = mapFp.readlines()
        mapFp.close()

        for line in maptext :
           parsed = line.split(" ")
           start = parsed[0]
           end = parsed[1]
           name = parsed[2][:-1]

           libStr += pushRange("LibBag", start, end, name)

    except :
        print("[checkStruct.py] Error on Reading mapfile")
        exit(0)

    return libStr + content + "\n\n" 


def BuildMasterScript() :
    content = ""
    L1 = BringScript(filename)

    start = ""
    end = ""
    maptext = ""

    global itempath

    content += L1
    content = AddItemPath(content)
    content = AddHeapRange(content)
    content = AddLibRange(content)

    return content 

##################################### PER PROGRAM SCRIPT

def on_message(message, data) :
    print("[!][checkStruct.py][Frida ON_MSG message]")
    print(message)
    print("[!][checkStruct.py][Frida ON_MSG data]")
    print(data)

if len(sys.argv) > 1 :
    if os.path.exists(sys.argv[1]) :
        filename = sys.argv[1]
        print("[checkStruct.py] Script Name Specified (%s)" % filename) 
    else :
        print("[checkStruct.py] Script Path Not Exist (%s)" % sys.argv[1])
else :
    print("[checkStruct.py] No Script Path Specified")
    exit(0)

itempath = sys.argv[2]
pid = -1
for proc in psutil.process_iter() :
    try:
        cmdline = proc.cmdline()
        if "Discord" in cmdline[0] and "renderer" in cmdline[1] :
            totalline = ""
            for line in cmdline :
                totalline += line + " "
            pid = proc.pid
            break
    except:
        pass

if pid == -1:
    print("[checkStruct.py] Cannot Find Discord Renderer Process")

print("[checkStruct.py] PID of Discord Renderer: " + str(pid))


jsContent = BuildMasterScript()
session = frida.attach(pid)
script = session.create_script(jsContent)

script.on('message', on_message)
script.load()
sys.stdin.read()
