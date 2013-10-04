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

// Player specific
var selectedCard;


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

function playCard(card) {
	removeClass(players[currentPlayer].cards, 'playable');
	
	// Add card to the center
	for (var i = players[currentPlayer].cards.length-1; i >= 0 ; i--) {
		if (players[currentPlayer].cards[i].view == card) {
			centerCards[currentPlayer] = card;
			players[currentPlayer].cards.splice(i, 1);
			
		}
	}
	startingColor = centerCards[startingPlayer].color;
	
	// Check if last card
	if (centerCards.length == 4) {
		centerCards.sort(findBestCard);
		var winningPlayer = $(center.cards[3]).attr('id').splice(0,1);
		addToScore(centerCards, winningPlayer);
		
		if (players[currentPlayer].cards.length == 0) {
			addToScore(nest.cards, winningPlayer);
			endHand();
		}
		else {
			startingPlayer = winningPlayer;
			$('.'+startingPlayer).addClass('playable');
			handLoop();
		}
	}
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