import psutil
import sys

def GetPid () :
    pid = -1
    for proc in psutil.process_iter() :
        try :
            cmdline = proc.cmdline()
            if "Discord" in cmdline[0] and "renderer" in cmdline[1] :
                pid = proc.pid
                break
        except :
            pass

    return pid

def GetMapFile (pid) :

    fp = open("/proc/%d/maps" % pid, "rt")
    lines = fp.readlines()
    fp.close()
    LibMap = []
    HeapMap = []

    for line in lines :
        try :
            cols = line.split(" ")
            name = cols[-1][:-1]
            if "vvar" in name:
                continue
            if "vdso" in name:
                continue
            if "vsys" in name :
                continue
            if "delete" in name :
                continue
            if "stack" in name :
                continue

            if len(cols[-1]) > 3 :
                addr_str = cols[0]

                start = addr_str.split("-")[0]
                end = addr_str.split("-")[-1]

                mapinfo = (start, end, name)
                LibMap.append(mapinfo)
                
                if "rw" in cols[1] :
                    mapinfo = (start, end, "HEAP_"+name)
                    HeapMap.append(mapinfo)


            elif cols[-1] == '\n' :
                if "rw" in cols[1] :
                    addr_str = cols[0]

                    start = addr_str.split("-")[0]
                    end = addr_str.split("-")[-1]

                    mapinfo = (start, end, "heap")
                    HeapMap.append(mapinfo)
        except :
            pass

    return LibMap, HeapMap 



filepath = ""
if len(sys.argv) !=2 :
    print("[!][proclibs.py] Unexpected Error, Need filename as input argument.")
    exit(0)
else :
    filepath = sys.argv[1]

pid = GetPid()
if pid < 0 :
    print("[proclibs.py] Cannot Find Process ID")
    exit(0)
else :
    print("[proclibs.py] Find PID %d" % pid)

LibMap, HeapMap = GetMapFile(pid)

try :
    fp = open(filepath+"_Lib.bin", "wt")
    for items in LibMap :
        fp.write("%s %s %s\n" % (items) )
    fp.close()

except :
    print("[!][proclibs.py] Error on Writing file %s_Lib.bin" % filepath)
    exit(0)

try :
    fp = open(filepath+"_Heap.bin", "wt")
    for items in HeapMap :
        fp.write("%s %s %s\n" % (items) )
    fp.close()

except :
    print("[!][proclibs.py] Error on Writing file %s_Heap.bin" % filepath)
    exit(0)



