//config
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config', 'utf8'));
var bot_token = process.env.SLACK_BOT_TOKEN || config.bot_token;

///init @slack/client
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var rtm = new RtmClient(bot_token);

//TODO listen to mentions

//add server for slackapi @ heroku -> https://github.com/slackapi/node-slack-sdk/issues/39
var http = require ('http');
http.createServer(function(req, res){
   res.end("hit");
}).listen(process.env.PORT || 5000)

//listen to messages and plant the treta
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
	//check if it's a message
	if (message.type == "message"){	
		//TODO check if it's DM or channel			
		//split the > TODO improve regex
		var split = (message.text).split(/(&gt\;)/);
		//is it a treta???
		if (split.length>1){
		//reverse the comparison
	                var response = split.reverse().join('');
			//do it!
    			rtm.sendMessage(response, message.channel);
			//mission accomplished...
        	        console.log("the treta has been planted: " + response);
	        }else{	
			//it's not a treta
			console.log("just silly talk...");
        	}
	}
});

//It's ALIVE!!
rtm.start();
