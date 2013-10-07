function initInterface() {
	initScoreboard();
	initBidDialog();
	selectCardOnClick();
}

function initScoreboard() {
	document.getElementById("team_a_name").innerHTML = players[0].name + "/" + players[2].name;
	document.getElementById("team_b_name").innerHTML = players[1].name + "/" + players[3].name;
}

function initBidDialog() {
	$('#dialog').draggable();
	$("#trump_color").prop("selectedIndex", -1);
	
	var bidTable = document.getElementById("player_bid_display");
	for (var i = 0, row; row = bidTable.rows[i]; i++) {
		row.cells[0].innerHTML = players[i].name + ":";
		row.cells[1].innerHTML = "0";
	}
}

function selectCardOnClick() {
	$('body').on('click', '.playable', function(){
		var selectedCard = $(this);
		
		if (selectedCard.hasClass('selected')) {
			playCard(selectedCard.css('z-index'));
		}
		else {
			var lastSelectedCard = $('.selected').first();
			if (lastSelectedCard.length > 0) {
				moveCardDown(lastSelectedCard);
				lastSelectedCard.removeClass('selected');
			}
			selectedCard.addClass('selected');
			moveCardUp(selectedCard);
		}
	});
	
	$('body').on('click', '.selectable_for_nest', function(){
		var selectedCard = $(this);
		
		if (selectedCard.hasClass('selected_for_nest')) {
			selectedCard.removeClass('selected_for_nest');
			moveCardDown(selectedCard);
		}
		else if ($('.selected_for_nest').length < 5){
			selectedCard.addClass('selected_for_nest');
			moveCardUp(selectedCard);
		}
		rerenderSubmitButton();
	});
}

function moveCardUp(card) {
	var yLoc = card.offset().top - 22;
	card.css({top: yLoc});
}

function moveCardDown(card) {
	var yLoc = card.offset().top + 22;
	card.css({top: yLoc});
}

function updateBidDialog() {
	$('#player_bid_display tr').eq(currentBidderIndex).removeClass('bidder');
	var bidTable = document.getElementById("player_bid_display");
	bidTable.rows[currentBidderIndex].cells[1].innerHTML = players[currentBidderIndex].bid;
}

function rerenderSubmitButton() {
	document.getElementById('submit_button').disabled = 
		(document.getElementById('trump_color').selectedIndex == -1 ||
		$('.selected_for_nest').length < 5);
}

function refreshScoreboard() {
	var scoreboard = document.getElementById("scoreboard_table");
	scoreboard.rows[scoreboard.rows.length-2].cells[0].innerHTML = teamHandPoints[0];
	scoreboard.rows[scoreboard.rows.length-2].cells[1].innerHTML = teamHandPoints[1];
}

function refreshTotalScoreAndAddRow() {
	refreshScoreboard();
	var scoreboard = document.getElementById("scoreboard_table");
	var rowIndex = scoreboard.rows.length-1;
	scoreboard.rows[rowIndex].cells[0].innerHTML = teamPoints[0];
	scoreboard.rows[rowIndex].cells[1].innerHTML = teamPoints[1];
	
	var newRow = scoreboard.insertRow(rowIndex);
	newRow.insertCell(0).innerHTML = "0";
	newRow.insertCell(1).innerHTML = "0";
}

Card.prototype = {
		printAt : function(x_pos, y_pos, z_pos) {
			this.view.css('left', x_pos + 'px');
			this.view.css('top', y_pos + 'px');
			this.view.css('z-index', z_pos);
		}
	};

function printCards(cards, xLoc, yLoc) {
	for (var c = 0; c < cards.length; c++) {
		cards[c].printAt(c * 40 + xLoc, yLoc, c);
	}
}

function printPlayerCards(index) {
	var cards = players[index].cards;
	cards.sort(compareCards);
	
	printCards(cards, 5, index * 185 + 30);
}

function addClass(cards, cardClass) {
	$.each(cards, function() {
		this.view.addClass(cardClass);
	});
}

function removeClass(cards, cardClass) {
	$.each(cards, function() {
		this.view.removeClass(cardClass);
	});
}