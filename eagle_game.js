// Game specific
var players = [];
var deck;
var teamPoints = [0, 0];
var bidStartIndex = 3;

// Hand specific
var nest = [];
var currentBid = 0;
var currentBidderIndex = 3;
var highestBidderIndex = 3;
var startingPlayer = 0;
var startingColor = "BLACK";
var currentPlayer = 0;
var teamHandPoints = [0, 0];
var centerCards = [];


function Player(name) {
	this.name = name;
	this.cards = [];
	this.bid = 0;
}

function initVariables() {
	players = [new Player("Alex"), new Player("Brandon"), new Player("Chandan"), new Player("Derrick")];
	teamPoints = [0, 0];
	bidStartIndex = 3;
}

function newGame() {
	initVariables();
	initInterface();
	newHand();
};

function newHand() {
	teamHandPoints = [0, 0];
	
	shuffleAndDeal();
	startBidding();
	//bidLoop() happens
	//startHand() happens
}

function shuffleAndDeal() {
	deck.shuffle();
	for (var i = 0; i < 4; i++ ) {
		players[i%4].cards = deck.cards.slice(i*10, i*10+10);
	};
	nest = deck.cards.slice(40, 45);
	
	for (var i = 0; i < players.length; i++) {
		printPlayerCards(i);
	}
	
	printCards(nest, 650, 30);
	addClass(nest.slice(0,4), 'flipped');
}

function startBidding() {
	currentBid = 0;
	currentBidderIndex = bidStartIndex;
	highestBidderIndex = bidStartIndex;
	
	var bidTable = document.getElementById("player_bid_display");
	for(var i = 0; i < 4; i++) {
		players[i].bid = 0;
		bidTable.rows[i].cells[1].innerHTML = "0";
	}
	
	$('#dialog').removeClass('hidden');
	bidLoop();
}

function bidLoop() {
	updateBidDialog();
	currentBidderIndex = (currentBidderIndex + 1) % 4;
	
	if (players[currentBidderIndex].bid == 'passed') {
		bidLoop();
	}
	else if (currentBidderIndex == highestBidderIndex || currentBid == 180) {
		endBidding();
	}
	else {
		$('#player_bid_display tr').eq(currentBidderIndex).addClass('bidder');
		// TODO: hide form when not the bidder
	}
}

function submitBid() {
	var bidInput = $('#bid');
	currentBid = parseInt(bidInput.val());
	
	players[currentBidderIndex].bid = currentBid;
	highestBidderIndex = currentBidderIndex;
	document.getElementById("current_bid_display").innerHTML = currentBid;
	
	bidInput.attr('min', currentBid + 5);
	bidInput.val(currentBid + 5);
	
	bidLoop();
}

function passBid() {
	players[currentBidderIndex].bid = 'passed';
	bidLoop();
}

function endBidding() {
	$('#player_bid_display tr').eq(currentBidderIndex).removeClass('bidder');
	bidStartIndex = (bidStartIndex + 1) % 4;
	
	// Add cards to highest bidder's hand
	removeClass(nest.slice(0,4), 'flipped');
	var cards = players[highestBidderIndex].cards;
	cards.push.apply(cards, nest);
	nest = [];
	
	printPlayerCards(highestBidderIndex);
	addClass(players[highestBidderIndex].cards, 'selectable_for_nest');
	
	// Show new dialog
	$('.dialog_bid').addClass('hidden');
	$('.dialog_nest').removeClass('hidden');
}
 
function startHand() {
	$('#dialog').addClass('hidden');
	
	trumpColor = document.getElementById('trump_color').value;
	
	document.getElementById('scoreboard_trump_display').innerHTML = "Trump: " + trumpColor;
	document.getElementById('scoreboard_bid_display').cells[highestBidderIndex % 2].innerHTML = "Current Bid: " + currentBid;
	
	// Put selected cards in the nest
	removeClass(players[highestBidderIndex].cards, 'selectable_for_nest');
	for (var i = players[highestBidderIndex].cards.length-1; i >= 0 ; i--) {
		if (players[highestBidderIndex].cards[i].view.hasClass('selected_for_nest')) {
			players[highestBidderIndex].cards[i].view.removeClass('selected_for_nest');
			nest.push(players[highestBidderIndex].cards[i]);
			players[highestBidderIndex].cards.splice(i, 1);
		}
	}
	addClass(nest, 'hidden');
	printPlayerCards(highestBidderIndex);
	currentPlayer = startingPlayer = highestBidderIndex;
	addClass(players[startingPlayer].cards, 'playable');
	centerCards = [];
}

function playCard(index) {
	removeClass(players[currentPlayer].cards, 'playable');
	var selectedCard = players[currentPlayer].cards[index];
	
	// Add card to the center
	centerCards[currentPlayer] = selectedCard;
	players[currentPlayer].cards.splice(index, 1);
	printPlayerCards(currentPlayer);
	selectedCard.view.addClass("p" + currentPlayer);
	
	// Check if last card
	if (currentPlayer == (startingPlayer+3) % 4) {
		var winningPlayer = findBestCard(centerCards);
		addToScore(centerCards, winningPlayer);
		
		setTimeout(function(){
			addClass(centerCards, 'hidden');
			addClass(players[currentPlayer].cards, 'playable');
		}, 2000);
		
		// Last card in the hand
		if (players[currentPlayer].cards.length == 0) {
			addToScore(nest, winningPlayer);
			endHand();
		}
		else {
			refreshScoreboard();
			currentPlayer = startingPlayer = winningPlayer;
		}
	}
	else {
		// Set the starting color if necessary
		if (currentPlayer == startingPlayer) {
			if (selectedCard.color == 'EAGLE') {
				startingColor = trumpColor;
			}
			else {
				startingColor = selectedCard.color;
			}
		}
		currentPlayer = (currentPlayer + 1) % 4;
		
		setPlayableCards();
	}
}

function setPlayableCards() {
	var playableCards = [];
	var cards = players[currentPlayer].cards;
	
	// Prefer starting color
	for (var i = 0; i < cards.length; i++) {
		if (cards[i].color == startingColor || (cards[i].color == 'EAGLE' && startingColor == trumpColor)) {
			playableCards.push(cards[i]);
		}
	}
	// If player doesn't have starting color, allow any color
	if (playableCards.length == 0) {
		playableCards = cards;
	}
	addClass(playableCards, 'playable');
}

function addToScore(cards, winningPlayer) {
	var points = 0;
	for (var i = 0; i < cards.length; i++) {
		switch(cards[i].number) {
			case "": points += 20; break;
			case 1: points += 15; break;
			case 14: points += 10; break;
			case 10: points += 10; break;
			case 5: points += 5; break;
		}
	}
	teamHandPoints[winningPlayer%2] += points;
}

function endHand() {
	// Show nest for 3 seconds
	printCards(nest, 650, 30);
	removeClass(nest, 'hidden');
	setTimeout(function(){
		addClass(nest, 'hidden');
		checkScore();
	}, 3000);
}

function checkScore() {
	// Compute new total scores
	if (teamHandPoints[highestBidderIndex%2] < currentBid) {
		teamHandPoints[highestBidderIndex%2] = -currentBid;
	}
	teamPoints[0] += teamHandPoints[0];
	teamPoints[1] += teamHandPoints[1];
	refreshTotalScoreAndAddRow();
	
	if (teamPoints[0] < 500 && teamPoints[1] < 500) {
		$('.dialog_nest').addClass('hidden');
		$('.dialog_bid').removeClass('hidden');
		$('.card').attr('class', 'card');
		newHand();
	}
	else {
		showWinnerDialog();
	}
}