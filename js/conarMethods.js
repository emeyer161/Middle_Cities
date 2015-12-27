var database = [
	{
		text: "I am the first question",
		answer: 2,
		choices: [
			{ text: "some choice" },
			{ text: "some choice" },
			{ text: "some choice" },
			{ text: "some choice" }
		]
	},
	{
		"text": "I am the second question",
		"answer": 2,
		"choices": [
			{ "text": "some choice" },
			{ "text": "some choice" },
			{ "text": "some choice" },
			{ "text": "some choice" }
		]
	},
	{
		text: "I am the third question",
		answer: 2,
		choices: [
			{ text: "some choice" },
			{ text: "some choice" },
			{ text: "some choice" },
			{ text: "some choice" }
		]
	}
];


//constructor
function QuizApp($el, state) {
	this.$el = $el;

	if(typeof state === "string"){
		state = JSON.parse(state);
	}

	this.state = state || this._resetState();

	this.render();
}

QuizApp.prototype._resetState = function(){
	return {
		currentQuestion: 0,
		correctQuestions: [],
		wrongQuestions: [],
		loading: false
	};
};

QuizApp.prototype.render = function(){
	if(this.state.loading){
		console.log("cant render yet, we are loading data");
	}
	else {
		this._renderQuestion();
		this._renderChoices();
	}
};

QuizApp.prototype._renderQuestion = function(){
	var div = $('<div />').html(database[this.state.currentQuestion].text);
	this.$el.append(div);
};

QuizApp.prototype._renderChoices = function(){
	var question = database[this.state.currentQuestion];

	var wrapperDiv = $('<div />');

	for(var i = 0; i < question.choices.length; i++){
		var answerDiv = $('<div />').html(question.choices[i].text);
		wrapperDiv.append(answerDiv);
	}

	this.$el.append(wrapperDiv);
};

QuizApp.prototype.setState = function(newState){
	var updatedState = {};

	for(var key in this.state){
		updatedState[key] = this.state.key;
	}

	for(var key in newState){
		updatedState[key] = newState.key;
	}

	this.state = updatedState;
	this.render();
	this.save();
};

QuizApp.prototype.nextQuestion = function(){
	this.setState({
		currentQuestion: this.state.currentQuestion++
	});
};

QuizApp.prototype.previousQuestion = function(){
	this.setState({
		currentQuestion: this.state.currentQuestion--
	});
};

QuizApp.prototype.save = function(){
	localStorage.setItem("appState", JSON.stringify(this.state));
};

QuizApp.prototype.newGame = function(){
	this.setState(this._resetState());
};

QuizApp.prototype.loadData = function(data){
	this._database = data;
};

QuizApp.prototype.loading = function(data){
	this.setState({
		loading: true
	});
};

QuizApp.prototype.loaded = function(data){
	this.setState({
		loading: false
	});
};










//doc ready
$(function(){
	var app = new QuizApp( $('.wrapper'), localStorage.getItem('appState') );
	
	function setAliveCheckTimer() {
		return setTimeout(function(){
			alert("did you pass out or something?");
		}, 1000*30);
	}

	var areYouDead = setAliveCheckTimer();

	$('body').on('mousemove keydown', function(){
		clearTimeout(areYouDead);
		areYouDead = setAliveCheckTimer();
	});

	var autoSave = setInterval(function(){
		app.save();
	}, 1000*30);


	// $('#newGameButton').on("click", function(){
	// 	app.newGame();
	// });

	// WILL FAIL
	// $('#newGameButton').on( "click", app.newGame); //inside the function, ran console.log(this); // this=document
	
	// WILL WORK FINE
	$('#newGameButton').on("click", app.newGame.bind(app)); //inside the function, ran console.log(this); // this=document

	$('body').on('keydown', function(){
		// start a new game when the user presses CTRL + N
		app.newGame();
	});

	// $('#infoButton').on("click", function(){
	// 	$('#infoModal').modal();
	// });
	




	// var app = new QuizApp($('.wrapper'));

	// app.loading();

	// $.getJSON('./database.json', function(database){
	// 	app.loadData(database);

	// 	app.loaded();
	// });

});



/**
 * HTML needed for this app
 *
<html>
	<head></head>
	<body>
		<nav>
			<button type="button" id="newGameButton">New Game</button>
		</nav>
		<div class="wrapper"></div>
		<div class="wrapper2"></div>
		<script src="app.js"></script>
	</body>
</html>
 */