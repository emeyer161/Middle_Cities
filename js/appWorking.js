var cityList = [];
var state = {};

// Functions
function QuizApp(inputState) {
	if(typeof state === "string"){
		state = JSON.parse(state);
	}

	this.state = inputState || this.resetState
}

function newGame() {
	// Set the stage
	$('.finalResult').fadeOut(400);
	$('.resultBox').fadeOut(400);
	$('.quizContent p').html('');
	$('.quizContent h2').html('Select the Middle City by Population:');
	$('.scoreboard').fadeIn(400);

	setState({numAnswers:3});
	setState(resetState());
	render();
};

function resetState() {
	return {
		numAnswers: 3,
	  	currentQuestion: 1,
		questions: genRandomQuestionsList(),
		responses: [null,null,null,null,null,null,null,null,null,null]
	};
};

function setState (newState) {
	var updatedState = {};

	for (var prop in state) {
		updatedState[prop] = state[prop];
	};

	for (var prop in newState) {
		updatedState[prop] = newState[prop];
	}

	state = updatedState;

	save();
};

function save() {
	localStorage.setItem("appState", JSON.stringify(state));
};

function render(){
  renderScores();
  renderQuestion();
};
	function renderScores() {
		$('.scoreboard .scoreBox').removeClass("empty current correct incorrect");
		// loop through answers array and render correct/wrong/empty squares...
		for (r=0; r<10; r++) {
			if (state.responses[r] == 1) {
				$('.scoreboard .scoreBox').eq(r).addClass("correct");
				$('.scoreboard .scoreBox').eq(r).html("✓");
			} else if (state.responses[r] == 0) {
				$('.scoreboard .scoreBox').eq(r).addClass("incorrect");
				$('.scoreboard .scoreBox').eq(r).html("X");
			} else {
				$('.scoreboard .scoreBox').eq(r).addClass("empty");
				$('.scoreboard .scoreBox').eq(r).html("");
			}
		}
		$('.scoreboard .scoreBox').eq(state.currentQuestion-1).addClass("current");
		$('.scoreboard .scoreBox').eq(state.currentQuestion-1).removeClass("empty correct incorrect");
		$('.scoreboard .scoreBox').eq(state.currentQuestion-1).html("?");
	};

	function renderQuestion() {
		// loop through questions until we get to the currentQuestion index
		setTimeout(function() {
			for (r=0; r<10; r++) {
				if (state.responses[r] == null) {
					$('.answerBox button').remove();
					// render the html for the question...
					for (a=0; a<state.questions[r].length; a++) {
						$('.answerBox').append( "<button name=\"answerButton\" id=\"answer"+(a+1)+"\" class=\"answerButton\">"+state.questions[r][a].name+"</button>" ).children().css('height', (190/state.numAnswers));
					};
				break;
				}
			}
		}, 400);
	};

function answerResult(inputAnswer) {
	var comparator = function(a,b) {
		return parseInt(a.population) - parseInt(b.population);
	};
	var answersDescending = state.questions[state.currentQuestion-1].sort(comparator);
	if (answersDescending[Math.floor(answersDescending.length/2)].name == inputAnswer){
		state.responses[state.currentQuestion-1] = 1;
		$('.resultBox h3').html("Correct!");
		$('.resultBox').css('background-color', 'green');
	} else {
		state.responses[state.currentQuestion-1] = 0;
		$('.resultBox h3').html("Wrong!");
		$('.resultBox').css('background-color', 'red');
	}
	$('#feedback').html('');
	for (a=answersDescending.length-1; a>=0; a--) {
		$('#feedback').append('<p>'+state.questions[state.currentQuestion-1][a].name+': '+state.questions[state.currentQuestion-1][a].population.toLocaleString());
	}
	$('#feedback p').eq(Math.floor(answersDescending.length/2)).css('font-size', 'larger').css('font-weight', 'bold');
	state.currentQuestion++;
	render();
	$('.scoreboard .scoreBox').eq(state.currentQuestion-1).toggleClass("current empty");
};

function genRandomQuestionsList() {
	// Shuffle the city list
	var shuffledCityList = shuffle(cityList);

	// Build array of all question objects
	var questionList = [];
	for (var q=0; q<10; q++){
		answers = [];
		for (var a=1; a<=state.numAnswers; a++){
			answers[a-1] = shuffledCityList[(q*state.numAnswers+a)-1];
		};
		questionList[q] = answers;
	};
	return questionList;
};

function shuffle(array) {
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

function cityConstructor(name, population) {
	this.name = name;
	this.population = population;
};

$(document).ready(function () {

	// Event Listeners
	$('#info').click(function() {
		$('.infoBox').fadeIn(500);
	});

	$('#closeInfo').click(function() {
		$('.infoBox').fadeOut(500);
	});

	$('#newGame').click(function() {
		newGame();
	});

	$('body').on('click', '.answerBox button',function(){
		answerResult($(this).html());
		$('.resultBox').fadeIn(400);
	});

	$('body').on('click', '.resultBox button',function(){
		if (state.currentQuestion < 11){
			$('.scoreboard .scoreBox').eq(state.currentQuestion-1).toggleClass("current empty");
		} else {
			renderScores();
			$('.answerBox button').remove();
			$('.quizContent h2').html('');
			$('.finalResult h3').html('You answered <b>'+state.responses.reduce(function(a,b) {return a+b})+'0%</b> of the questions correctly!');
			$('.finalResult').fadeIn(2000);
		}
		$('.resultBox').fadeOut(400);
	});

	// List of all cities used
	cityList[0] = new cityConstructor("New York", 8491079);
	cityList[1] = new cityConstructor("Los Angeles", 3928864);
	cityList[2] = new cityConstructor("Chicago", 2722389);
	cityList[3] = new cityConstructor("Houston", 2239558);
	cityList[4] = new cityConstructor("Philadelphia", 1560297);
	cityList[5] = new cityConstructor("Phoenix", 1537058);
	cityList[6] = new cityConstructor("San Diego", 1381069);
	cityList[7] = new cityConstructor("Dallas", 1281047);
	cityList[8] = new cityConstructor("San Francisco", 852469);
	cityList[9] = new cityConstructor("Mexico City", 8874724);
	cityList[10] = new cityConstructor("Beijing", 11716620);
	cityList[11] = new cityConstructor("Cairo", 9278441);
	cityList[12] = new cityConstructor("Moscow", 12197596);
	cityList[13] = new cityConstructor("Tokyo", 13297629);
	cityList[14] = new cityConstructor("Istanbul", 14377019);
	cityList[15] = new cityConstructor("Shanghai", 16787941);
	cityList[16] = new cityConstructor("Delhi", 24150000);
	cityList[17] = new cityConstructor("London", 8416500);
	cityList[18] = new cityConstructor("Bangkok", 8280925);
	cityList[19] = new cityConstructor("Bogotá", 7776845);
	cityList[20] = new cityConstructor("Ho Chi Minh City", 7681700);
	cityList[21] = new cityConstructor("Hong Kong", 7219700);
	cityList[22] = new cityConstructor("Baghdad", 7180889);
	cityList[23] = new cityConstructor("Singapore", 5399200);
	cityList[24] = new cityConstructor("Cape Town", 3740026);
	cityList[25] = new cityConstructor("Berlin", 3517424);
	cityList[26] = new cityConstructor("Madrid", 3207247);
	cityList[27] = new cityConstructor("Buenos Aires", 3054300);
	cityList[28] = new cityConstructor("Rome", 2627000);
	cityList[29] = new cityConstructor("Toronto", 2615000);

});