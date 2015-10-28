var cityList = [];

$(document).ready(function () {

	var numAnswers = 3;
	var questions = [];
	var scoreTally;
	var currentQuestion = 0;

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
		result(solve($(this).html()));
		$('.resultBox').fadeIn(400);
	});

	$('body').on('click', '.resultBox button',function(){
		if (currentQuestion < 11){
			questions[currentQuestion-1].setAnswers();
		} else {
			$('.answerBox button').remove();
			$('.quizContent h2').html('');
			$('.finalResult h3').html('You answered <b>'+scoreTally+'0%</b> of the questions correctly!');
			$('.finalResult').fadeIn(2000);
		}
		$('.resultBox').fadeOut(400);
	});

	function newGame() {
			// Set the stage
			$('.finalResult').fadeOut(400);
			scoreTally = 0;
			$('.scoreboard div').removeClass('correct incorrect current');
			$('.scoreboard div').addClass('empty');
			$('.scoreboard .scoreBox').eq(currentQuestion-1).html("");
			$('.scoreboard div').html('');
			$('.quizContent p').remove();
			$('.quizContent h2').html('Select the 2nd Most Populated City');
			$('.scoreboard').fadeIn(400);

			// Shuffle the city list
			shuffledCityList = shuffle(cityList);

			// Build array of all question objects
			questions = [];
			for (var q=0; q<10; q++){
				answers = [];
				for (var a=1; a<=numAnswers; a++){
					answers[a-1] = shuffledCityList[(q*numAnswers+a)-1];
				};
				questions[q] = new questionConstructor(answers);
			};

			// Set first question
			questions[0].setAnswers();
			currentQuestion = 1;
			$('.scoreboard .scoreBox').eq(currentQuestion-1).addClass("current");
			$('.scoreboard .scoreBox').eq(currentQuestion-1).removeClass("incorrect");
			$('.scoreboard .scoreBox').eq(currentQuestion-1).html("?");
	};

	function solve(answer) {
		console.log("Current question is: " +currentQuestion);
		if (questions[currentQuestion-1].getCorrect().name == answer){
			console.log("Correct!")
			return true;
		} else {
			console.log("Wrong!")
			return false;
		}
	}

	function result(boolean) {
		// Show correct or wrong
		// Update scoreboard
		// Set next question
		if (boolean) {
			$('.resultBox h3').html("Correct!");
			$('.scoreboard .scoreBox').eq(currentQuestion-1).addClass("correct");
			$('.scoreboard .scoreBox').eq(currentQuestion-1).removeClass("empty current");
			$('.scoreboard .scoreBox').eq(currentQuestion-1).html("✓");
			$('.resultBox').css('background-color', 'green');
			scoreTally++;
		} else {
			$('.resultBox h3').html("Wrong!");
			$('.scoreboard .scoreBox').eq(currentQuestion-1).addClass("incorrect");
			$('.scoreboard .scoreBox').eq(currentQuestion-1).removeClass("empty current");
			$('.scoreboard .scoreBox').eq(currentQuestion-1).html("X");
			$('.resultBox').css('background-color', 'red');
		}
		currentQuestion++;
	}

	function questionConstructor(answerCities) {
		// Add all answers to the answerbox
		this.setAnswers = function() {
			$('.answerBox button').remove();
			for (i=0; i<answerCities.length; i++) {
				$('.answerBox').append( "<button name=\"answerButton\" id=\"answer"+(i+1)+"\" class=\"answerButton\">"+answerCities[i].name+"</button>" );
			};
			$('.scoreboard .scoreBox').eq(currentQuestion-1).html("?");
		};
		// Returns the location of the correct answer
		this.getCorrect = function() {
			var comparator = function(a,b) {
				return parseInt(a.population) - parseInt(b.population);
			};
			orderedAnswers = answerCities.sort(comparator);
			return orderedAnswers[Math.ceil(orderedAnswers.length/2)-1];
		};
	}

	function cityConstructor(name, population) {
		this.name = name;
		this.population = population;
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
	}

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