//AI used (codex on VS studio) to complete and enhance the code for Dicee Challenge. Please see html file for details.
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// Update the image and accessible label for one player's die.
function setDieImage(img, value, playerNumber) {
  img.setAttribute("src", "images/dice" + value + ".png");
  img.setAttribute("alt", "Player " + playerNumber + " rolled a " + value);
}

// Decide if there is a winner or a draw.
function getWinner(values) {
  var maxValue = Math.max.apply(null, values);
  var topCount = values.filter(function (value) {
    return value === maxValue;
  }).length;

  if (topCount > 1) {
    return { winner: null, maxValue: maxValue };
  }

  return { winner: values.indexOf(maxValue) + 1, maxValue: maxValue };
}

// Run one full round: roll, update the UI, and show the result.
function playRound() {
  var values = [rollDie(), rollDie(), rollDie()];
  var diceImages = [
    document.querySelector(".img1"),
    document.querySelector(".img2"),
    document.querySelector(".img3")
  ];
  var diceCards = [
    diceImages[0].closest(".dice"),
    diceImages[1].closest(".dice"),
    diceImages[2].closest(".dice")
  ];

  values.forEach(function (value, index) {
    setDieImage(diceImages[index], value, index + 1);
  });

  var result = getWinner(values);
  var resultText = document.querySelector("#result");
  var statusText = document.querySelector("#status");
  // Clear any previous highlights.
  diceCards.forEach(function (card) {
    card.classList.remove("winner");
    card.classList.remove("rolling");
  });
  resultText.classList.remove("winner-effect");

  // Add a short visual roll effect.
  diceCards.forEach(function (card) {
    card.classList.add("rolling");
  });

  if (result.winner === null) {
    resultText.textContent = "It is a draw! No winner this round.";
    statusText.textContent = "Great try! Click Roll Dice to play again.";
    // Remove the roll effect after a short delay.
    window.setTimeout(function () {
      diceCards.forEach(function (card) {
        card.classList.remove("rolling");
      });
    }, 450);
    return;
  }

  resultText.textContent = "Player " + result.winner + " wins with a " + result.maxValue + "!";
  statusText.textContent = "Nice roll! Click Roll Dice for another round.";
  diceCards[result.winner - 1].classList.add("winner");
  resultText.classList.add("winner-effect");
  // Remove the roll effect after a short delay.
  window.setTimeout(function () {
    diceCards.forEach(function (card) {
      card.classList.remove("rolling");
    });
  }, 450);
}

// Wait until the page loads, then connect the button to the game logic.
document.addEventListener("DOMContentLoaded", function () {
  var rollButton = document.querySelector("#rollBtn");
  rollButton.addEventListener("click", playRound);
});
