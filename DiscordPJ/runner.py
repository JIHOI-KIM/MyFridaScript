import frida
import sys
import psutil
import os

SCRIPT_PATH = "./"

################################### PROTO API

def BringScript(name) :
    global SCRIPT_PATH
    filename = os.path.join(SCRIPT_PATH, name)
    fp = open(filename, "rt")
    content = fp.read()
    fp.close()
    
    return content

#################################### CORE API

def BuildMasterScript() :
    content = ""
    L1 = BringScript("inspect.js")
    content += L1

    return content 

##################################### PER PROGRAM SCRIPT

def on_message(message, data) :
    print("[!][Frida ON_MSG message]")
    print(message)
    print("[!][Frida ON_MSG data]")
    print(data)

filename = ""

if len(sys.argv) > 1 :
    if os.path.isdir(sys.argv[1]) :
        FILEPATH = sys.argv[1]
        print("[python] Script Name Specified (Default Current Space)") 
    else :
        print("[python] Script Path Not Exist (%s)" % sys.argv[1])
else :
    print("[python] No Script Path Specified")
    exit(0)

pid = -1
for proc in psutil.process_iter() :
    try:
        cmdline = proc.cmdline()
        if "Discord" in cmdline[0] and "renderer" in cmdline[1] :
            totalline = ""
            for line in cmdline :
                totalline += line + " "
            print(totalline)
            pid = proc.pid
            break
    except:
        pass

if pid == -1:
    print("[python] Cannot Find Discord Renderer Process")

print("[python] PID of Discord Renderer: " + str(pid))


jsContent = BuildMasterScript()
session = frida.attach(pid)
script = session.create_script(jsContent)

script.on('message', on_message)
script.load()
sys.stdin.read()
