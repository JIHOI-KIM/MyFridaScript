const BaseName = "discord_voice.node"
const offset = 0x001274b0

var addr_base = Module.findBaseAddress(BaseName);
var addr_func = addr_base.add(offset);
var previous_time = 0x00;


Interceptor.attach( addr_func, {
	onEnter: function(args) {
		var tid = this.threadId;
		var connection = args[0];
		var type = args[1];
		var datalen = args[3] >>> 0;
		var receivedAt = args[4];
		var ssrc = args[5];

		console.log("---------["+tid+"]---------")
		console.log("Connection PTR: " + connection)
		
		if (type == 0x0){
			console.log("Packet Type: UnKnown (0x00)");
		}
		else if (type == 0x01){
			console.log("Packet Type: RTP (0x01)");
		}
		else if (type == 0x02){
			console.log("Packet Type: RTCP (0x02)");
		}
		else{
			console.log("Packet Type: Error");
		}
		console.log("Data PTR: "+args[2]);
		var bytearr = Memory.readByteArray(args[2], 32);
		console.log(bytearr);
		console.log("Data Length: "+ datalen);
		
		if(previous_time == 0)
		{
			console.log("Initial Recived: "+ receivedAt);
		}
		else
		{
			console.log("Time Interval: "+ (receivedAt - previous_time).toString(10));
		}
		previous_time = receivedAt;

		console.log("SSRC: "+ ssrc.toString(10));
	},
	onLeave: function(ret) {
		return ret;
	}
});
