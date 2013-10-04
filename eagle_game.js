// Game specific
var players = [];
var deck;
var teamAPoints = 0;
var teamBPoints = 0;
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
	this.bid = "";
}

function initVariables() {
	players = [new Player("A"), new Player("B"), new Player("C"), new Player("D")];
	teamAPoints = 0;
	teamBPoints = 0;
	bidStartIndex = 3;
}

function newGame() {
	initVariables();
	initInterface();
	
	while (teamAPoints < 300 && teamBPoints < 300) {
		newHand();
		teamAPoints = 350;
	}
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
	
	$('#dialog').removeClass('hidden');
	bidLoop();
}

function bidLoop() {
	currentBidderIndex = (currentBidderIndex + 1) % 4;
	if (players[currentBidderIndex].bid == 'passed') {
		bidLoop();
	}
	else if (currentBidderIndex == highestBidderIndex || currentBid == 180) {
		endBidding();
	}
	else {
		$('#bid_text').html(getBidDialogText());
		// TODO: hide form when not the bidder
	}
}

function submitBid() {
	var bidInput = $('#bid');
	currentBid = parseInt(bidInput.val());
	
	players[currentBidderIndex].bid = currentBid;
	highestBidderIndex = currentBidderIndex;
	
	
	bidInput.attr('min', currentBid + 5);
	bidInput.val(currentBid + 5);
	
	bidLoop();
}

function passBid() {
	players[currentBidderIndex].bid = 'passed';
	bidLoop();
}

function endBidding() {
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
		
		// Last card in the hand
		if (players[currentPlayer].cards.length == 0) {
			addToScore(nest.cards, winningPlayer);
			endHand();
		}
		else {
			currentPlayer = startingPlayer = winningPlayer;
			addClass(players[currentPlayer].cards, 'playable');
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
			case "": points += 20;
			case 1: points += 15;
			case 14: points += 10;
			case 10: points += 10;
			case 5: points += 5;
		}
	}
	teamHandPoints[winningPlayer%2] += points;
}

function endHand() {
	
}