MyServer.prototype.constructor=MyServer;

function MyServer(game) {
	this.game = game;
	console.log("create server");
};



MyServer.prototype.getPrologRequest = function(requestString, onSuccess, onError, port){
	var requestPort = port || 8081
	var request = new XMLHttpRequest();

	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data){
		console.log("Request successful. Reply: " + 
		data.target.response);
	};

	request.onerror = onError || function(){
		console.log("Error waiting for response");
	};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};
		
MyServer.prototype.makeRequest = function(requestString){	

	console.log("makeRequest");

	// Make Request
	this.getPrologRequest(requestString, this.handleReply); 
}
			
//Handle the Reply
MyServer.prototype.handleReply = function(data){

	var data = data.target.response;
	data.replace(/([a-z])\w+/g, "\"$&\"");

	if(data == "Bad Request")
		console.log("Bad Request");
	else if(data == "Syntax Error")
		console.log("Syntax Error");

	else if(data != "goodbye") {
			console.log("RESPONSE:::: " + data); 
			console.log(typeof(Game));
        	Game.currStatus = data;
        	Game.changeStatus = true;
	}
};

MyServer.prototype.quit = function(){
    this.makeRequest("quit");
};
