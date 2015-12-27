// Functions
function QuizApp(inputState, inputDatabase) {
	if(typeof inputState === "string"){
		inputState = JSON.parse(inputState);
	};

	this.state = inputState || this.resetState;

	this.database = inputDatabase;

	// this.render();
}

QuizApp.prototype.newGame = function() {
	// Set the stage
	$('.finalResult').fadeOut(400);
	$('.resultBox').fadeOut(400);
	$('.quizContent p').html('');
	$('.quizContent h2').html('Select the Middle City by Population:');
	$('.scoreboard').fadeIn(400);

	this.setState({numAnswers:3});
	this.setState(this.resetState());
	this.render();
};

QuizApp.prototype.resetState = function() {
	return {
		numAnswers: 3,
	  	currentQuestion: 1,
		questions: this.genRandomQuestionsList(),
		responses: [null,null,null,null,null,null,null,null,null,null]
	};
};

QuizApp.prototype.setState = function(newState) {
	var updatedState = {};

	for (var prop in this.state) {
		updatedState[prop] = this.state[prop];
	};

	for (var prop in newState) {
		updatedState[prop] = newState[prop];
	}

	this.state = updatedState;

	this.save();
};

QuizApp.prototype.save = function() {
	localStorage.setItem("appState", JSON.stringify(this.state));
};

QuizApp.prototype.render = function(){
	this.renderScores();
	this.renderQuestion();
};
	QuizApp.prototype.renderScores = function() {
		$('.scoreboard .scoreBox').removeClass("empty current correct incorrect");
		// loop through answers array and render correct/wrong/empty squares...
		for (r=0; r<10; r++) {
			if (this.state.responses[r] == 1) {
				$('.scoreboard .scoreBox').eq(r).addClass("correct");
				$('.scoreboard .scoreBox').eq(r).html("✓");
			} else if (this.state.responses[r] == 0) {
				$('.scoreboard .scoreBox').eq(r).addClass("incorrect");
				$('.scoreboard .scoreBox').eq(r).html("X");
			} else {
				$('.scoreboard .scoreBox').eq(r).addClass("empty");
				$('.scoreboard .scoreBox').eq(r).html("");
			}
		}
		$('.scoreboard .scoreBox').eq(this.state.currentQuestion-1).addClass("current");
		$('.scoreboard .scoreBox').eq(this.state.currentQuestion-1).removeClass("empty correct incorrect");
		$('.scoreboard .scoreBox').eq(this.state.currentQuestion-1).html("?");
	};

	QuizApp.prototype.renderQuestion = function() {
		var withinState = this.state;
		// loop through questions until we get to the currentQuestion index
		setTimeout(function() {
			for (r=0; r<10; r++) {
				if (withinState.responses[r] == null) {
					$('.answerBox button').remove();
					// render the html for the question...
					for (a=0; a<withinState.questions[r].length; a++) {
						$('.answerBox').append( "<button name=\"answerButton\" id=\"answer"+(a+1)+"\" class=\"answerButton\">"+withinState.questions[r][a].name+"</button>" ).children().css('height', (190/withinState.numAnswers));
					};
				break;
				}
			}
		}, 400);
	};

QuizApp.prototype.answerResult = function(inputAnswer) {
	var comparator = function(a,b) {
		return parseInt(a.population) - parseInt(b.population);
	};
	var answersDescending = this.state.questions[this.state.currentQuestion-1].sort(comparator);
	if (answersDescending[Math.floor(answersDescending.length/2)].name == inputAnswer){
		this.state.responses[this.state.currentQuestion-1] = 1;
		$('.resultBox h3').html("Correct!");
		$('.resultBox').css('background-color', 'green');
	} else {
		this.state.responses[this.state.currentQuestion-1] = 0;
		$('.resultBox h3').html("Wrong!");
		$('.resultBox').css('background-color', 'red');
	}
	$('#feedback').html('');
	for (a=answersDescending.length-1; a>=0; a--) {
		$('#feedback').append('<p>'+this.state.questions[this.state.currentQuestion-1][a].name+': '+this.state.questions[this.state.currentQuestion-1][a].population.toLocaleString());
	}
	$('#feedback p').eq(Math.floor(answersDescending.length/2)).css('font-size', 'larger').css('font-weight', 'bold');
	this.state.currentQuestion++;
	this.render();
	$('.scoreboard .scoreBox').eq(this.state.currentQuestion-1).toggleClass("current empty");
};

QuizApp.prototype.genRandomQuestionsList = function() {
	// Shuffle the city list
	var shuffledCityList = this.shuffle(this.database);

	// Build array of all question objects
	var questionList = [];
	for (var q=0; q<10; q++){
		answers = [];
		for (var a=1; a<=this.state.numAnswers; a++){
			answers[a-1] = shuffledCityList[(q*this.state.numAnswers+a)-1];
		};
		questionList[q] = answers;
	};
	return questionList;
};

QuizApp.prototype.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  while (0 !== currentIndex) {
	randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};


$(document).ready(function () {
	var cityList = [];
	$.getJSON("https://api.myjson.com/bins/2d9qy", function(data) {
	    cityList = data;
	});

	setTimeout(function(){
		app = new QuizApp(localStorage.getItem('appState'), cityList);
	}, 1000*.5);

	// Event Listeners
	$('#info').click(function() {
		$('.infoBox').fadeIn(500);
	});

	$('#closeInfo').click(function() {
		$('.infoBox').fadeOut(500);
	});

	$('#newGame').click(function() {
		app.newGame();
	});

	$('body').on('click', '.answerBox button',function(){
		app.answerResult($(this).html());
		$('.resultBox').fadeIn(400);
	});

	$('body').on('click', '.resultBox button',function(){
		if (app.state.currentQuestion < 11){
			$('.scoreboard .scoreBox').eq(app.state.currentQuestion-1).toggleClass("current empty");
		} else {
			app.renderScores();
			$('.answerBox button').remove();
			$('.quizContent h2').html('');
			$('.finalResult h3').html('You answered <b>'+app.state.responses.reduce(function(a,b) {return a+b})+'0%</b> of the questions correctly!');
			$('.finalResult').fadeIn(2000);
		}
		$('.resultBox').fadeOut(400);
	});
});