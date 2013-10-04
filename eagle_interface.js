function initInterface() {
	selectCardOnClick();
	$('#dialog').draggable();
	$("#trump_color").prop("selectedIndex", -1);
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

function getBidDialogText() {
	var text = "Current Bid: " + currentBid + "<br/>";
	var className;
	for (var i = 0; i < players.length; i++) {
		if(currentBidderIndex == i) {
			className = 'bidder';
		}
		else {
			className = "non_bidder";
		}
		text += '<span class="' + className + '">' + players[i].name + ': ' + players[i].bid + '</span><br/>';
	}
	return text;
}

function rerenderSubmitButton() {
	document.getElementById('submit_button').disabled = 
		(document.getElementById('trump_color').selectedIndex == -1 ||
		$('.selected_for_nest').length < 5);
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