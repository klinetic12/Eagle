function Deck() {
	var colors = [ "BLACK", "RED", "GREEN", "BLUE" ];
	var numbers = [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 1 ];

	this.cards = new Array(colors.length * numbers.length + 1);
	var i = 0;
	for (c in colors) {
		for (n in numbers) {
			this.cards[i++] = new Card(colors[c], numbers[n]);
		}
	}
	this.cards[i] = new Card("EAGLE", "");
}

Deck.prototype = {
	shuffle : function() {
		var currentIndex = this.cards.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = this.cards[currentIndex];
			this.cards[currentIndex] = this.cards[randomIndex];
			this.cards[randomIndex] = temporaryValue;
		};
	}
};

function Card(color, number) {
	this.color = color;
	this.number = number;
	
	var divCard = document.createElement('div');
	divCard.className = 'card';
	divCard.style.color = color;
	divCard.innerHTML = number + " " + color;
	document.body.appendChild(divCard);
	this.view = $(divCard);
}

function compareCards(a,b) {
	if (a.color == 'EAGLE') {
		return 1;
	}
	if (b.color == 'EAGLE' || a.color < b.color) {
		return -1;
	}
	if (a.color > b.color) {
		return 1;
	}
	var numberOfA = a.number == 1 ? 15 : a.number;
	var numberOfB = b.number == 1 ? 15 : b.number;
	
	if (numberOfA < numberOfB) {
		return -1;
	}
	else {
		return 1;
	}
}

function findBestCard(cards) {
	var values = [];
	for (var i = 0; i < cards.length; i++) {
		values[i] = getValueForCard(cards[i]);
	}
	return values.indexOf(Math.max.apply(Math, values));
}

function getValueForCard(card) {
	if (card.color == 'EAGLE') {
		return 100;
	}
	var colorValue = 0;
	if (card.color == trumpColor) {
		colorValue = 40;
	}
	else if (card.color == startingColor) {
		colorValue = 20;
	}
	return colorValue + (card.number == 1 ? 15 : card.number);
}