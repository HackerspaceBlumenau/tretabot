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
var http = require('http');
http.createServer(function (req, res) {
	res.end("hit");
}).listen(process.env.PORT || 5000)

function tech_comparison(text) {
	//TODO check if it's DM or channel			
	//split the > using positive lookahead to avoid citation match
	var split = (text).split(/(?!^)(&gt\;|&lt\;)/);

	//is it a treta???
	if (split.length > 1) {
		var response;
		//generate a random number to get some chance to do some extra actinos
		var randomNumber = Math.floor((Math.random()*100) + 1);
		if(randomNumber < 10) {
			response = "Isso mesmo! " + text;
		} else {
			//Reverse the comparison
			//Some chance of appending some text
			if(randomNumber > 80) {
				response = "Calma aí, não é bem assim... é: " + split.reverse().join('');
			} else {
				response = split.reverse().join('');
			}
		}
		return response;
	}
	return "";
}

function java_performance(text) {
	text = text.toLowerCase();

	options = ["Java e performance são palavras que não combinam!",
		   "Vai la escrever um Hello World de 10 linhas vai!",
		   "Fala isso pro garbage collector taokey.",
		   "Quando sair a especificação do Java 30 podemos conversar.",
		   "Jávai tarde"
	]

	if (text.indexOf("java") > -1 && text.indexOf("performance") > -1) {
		option = Math.floor(Math.random() * options.length)
		if (option == options.length) {
			option--;
		}
		return options[option];
	}

	return "";
}

function docker(text) {
	text = text.toLowerCase();

	options = ["Alguém disse https://www.youtube.com/watch?v=BkWJik6QjeQ ?",
		   "Por que ao invés de usar docker você não vai para baleia? https://www.youtube.com/watch?v=BkWJik6QjeQ"
	]

	if (text.indexOf("docker") > -1) {
		option = Math.floor(Math.random() * options.length)
		if (option == options.length) {
			option--;
		}
		return options[option];
	}
	return "";
}

function process_msg(message) {
	text = message.text;

	if ((response = tech_comparison(text)).length > 0 ||
	    (response = java_performance(text)).length > 0 ||
	    (response = docker(text)).length > 0) {
		return response;
	}

	return "";
}

//listen to messages and plant the treta
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
	//check if it's a message
	if (message.type == "message" && message.text != undefined) {
		response = process_msg(message);
		if (response.length > 0) {
			rtm.sendMessage(response, message.channel);
			//mission accomplished...
			console.log("the treta has been planted: " + response);
		} else {
			//it's not a treta
			console.log(message.text);
			console.log("just silly talk...");
		}
	}
});

//It's ALIVE!!
rtm.start();
