//Coding Challenge #1 from lecture 109
"use strict";
const primeNum = [2, 3, 5];
const nonPrimeNum = [1, 4, 6];
let rolledPoints = [];
const angelRoll = document.querySelector(".angel-roll");
const demonRoll = document.querySelector(".demon-roll");
const angelAbility = document.querySelector(".angel-ap");
const demonAbility = document.querySelector(".demon-ap");
const dice1 = document.querySelector(".dice1");
const angelIntro = document.querySelector(".angel-intro");
const angelIntroText = document.querySelector(".angel-intro div");
const demonIntro = document.querySelector(".demon-intro");
const demonIntroText = document.querySelector(".demon-intro div");
const upPointEle = document.querySelector(".up-point");
const downPointEle = document.querySelector(".down-point");
const dice2 = document.querySelector(".dice2");
const angelBoard = document.querySelector(".angel");
const demonBoard = document.querySelector(".demon");
const restart = document.querySelector(".restart");
let angelWin = false;
let demonWin = false;
let demonUsingAbility = false;
let isRolling = false;
const angelIntroContent = `<p>
The Angle rolls two dices at the same time, and the larger one
will be added to her points.
</p>
<p>
However, the Angle will NOT be able to use the ability again until she
rolls the same number once again.
</p>
<p>If both numbers are the same,The Angle WINS the game.</p>`;

const demonIntroContent = `<p>
The Demon rolls two dices at the same time, if both of them are prime numbers,he would take the larger number from his opponent.
</p>
<p>
However, if none of them is prime number demon would lose points equal to the sum of them. 
</p>
<p>If both numbers are the same,The Demon LOSES the game.</p>`;

//======================================================================//
let upPoint = 50;
let downPoint = 50;
let randPoint1 = 1;
let randPoint2 = 1;
let angCoolDown = false;
let demonCoolDown = false;
let gameOver = false;
let angleTurn = true;
let demonTurn = false;
let unlockNumber = 0;

const resetDice = function () {
  dice2.classList.add("hidden");
  dice1.classList.remove("dice-left");
  dice2.classList.remove("dice-right");
};

const setDarker = function (player) {
  player.classList.add("get_darker");
  player.classList.remove("remove_darker");
};

const removeDarker = function (player) {
  player.classList.add("remove_darker");
  player.classList.remove("get_darker");
};

const hiddenAll = function () {
  restart.classList.add("disappear");
  restart.classList.remove("appear");
  angelRoll.classList.add("disappear");
  angelRoll.classList.remove("appear");
  angelAbility.classList.add("disappear");
  angelAbility.classList.remove("appear");
  demonRoll.classList.add("disappear");
  demonRoll.classList.remove("appear");
  demonAbility.classList.add("disappear");
  demonAbility.classList.remove("appear");
};

const showAll = function () {
  restart.classList.add("appear");
  restart.classList.remove("disappear");
  angelRoll.classList.add("appear");
  angelRoll.classList.remove("disappear");
  angelAbility.classList.add("appear");
  angelAbility.classList.remove("disappear");
  demonRoll.classList.add("appear");
  demonRoll.classList.remove("disappear");
  demonAbility.classList.add("appear");
  demonAbility.classList.remove("disappear");
};
const rolling = function () {
  hiddenAll();
  setDarker(angelBoard);
  setDarker(demonBoard);
  const i = setInterval(function () {
    randPoint1 = Math.floor(Math.random() * 6 + 1);
    dice1.src = `dice-${randPoint1}.png`;
    if (!dice2.classList.contains("hidden")) {
      randPoint2 = Math.floor(Math.random() * 6 + 1);
      dice2.src = `dice-${randPoint2}.png`;
    }
  }, 8);
  if (angCoolDown) angelIntro.classList.add("coolDownIntro");
  let promise = new Promise(function (resolve) {
    setTimeout(function () {
      angelIntro.classList.add("hidden");
      clearInterval(i);

      angelIntro.classList.remove("hidden");
      resolve([randPoint1, randPoint2]);
    }, 1200);
    setTimeout(() => {
      demonTurn ? removeDarker(demonBoard) : removeDarker(angelBoard);
      showAll();
      if (
        upPoint >= 100 ||
        downPoint <= 0 ||
        (!dice2.classList.contains("hidden") && randPoint1 === randPoint2)
      ) {
        demonBoard.classList.add("game_over");
        upPointEle.textContent = "Angel WINS";
        angelBoard.classList.add("remove_darker");
        angelAbility.classList.add("coolDownBtn");
        angelRoll.classList.add("coolDownBtn");
        gameOver = true;
      } else if (downPoint >= 100 || upPoint <= 0) {
        angelBoard.classList.add("game_over");
        downPointEle.textContent = "Demon WINS";
        demonBoard.classList.add("remove_darker");
        demonAbility.classList.add("coolDownBtn");
        demonRoll.classList.add("coolDownBtn");
        gameOver = true;
      }
      if (gameOver) dice1.classList.add("hidden");
      resetDice();
    }, 3000);
  });
  isRolling = false;
  return promise;
};

setDarker(demonBoard);
angelRoll.addEventListener("click", async function () {
  if (!angleTurn || gameOver) return;
  angelAbility.classList.add("coolDownBtn");
  angelRoll.classList.add("coolDownBtn");
  const rolledPoints = await rolling();

  if (!angCoolDown) {
    angelIntro.classList.remove("coolDownIntro");
    angelIntro.innerHTML = angelIntroContent;
  }
  // console.log(rolledPoints);

  if (angCoolDown) {
    console.log(Math.max(...rolledPoints));
    upPoint += Math.max(...rolledPoints);

    angelAbility.classList.add("coolDownBtn");
    if (rolledPoints[0] === unlockNumber) {
      angelIntro.innerHTML = angelIntroContent;
      unlockNumber = 0;

      angelIntro.classList.remove("coolDownIntro");
      angCoolDown = false;
    } else if (unlockNumber === 0) {
      unlockNumber = rolledPoints[0];
    }
  } else {
    upPoint += rolledPoints[0];
  }
  upPointEle.textContent = upPoint + "";
  setDarker(angelBoard);
  angleTurn = false;

  // setTimeout(() => {
  //   demonBoard.classList.add("remove_darker");
  //   demonBoard.classList.remove("get_darker");
  // }, 2000);

  demonTurn = true;
  demonAbility.classList.remove("coolDownBtn");
  demonRoll.classList.remove("coolDownBtn");
});

demonRoll.addEventListener("click", async function (e) {
  // downPoint += await rolling();
  // downPointEle.textContent = downPoint + "";
  if (!demonTurn || gameOver) return;
  const rolledPoints = await rolling();
  let point = Math.min(...rolledPoints);
  // if (!angCoolDown) {
  //   angelIntro.classList.remove("coolDownIntro");
  //   angelIntro.innerHTML = angelIntroContent;
  // }
  console.log(rolledPoints);
  console.log(primeNum.includes(rolledPoints[0]));
  if (!demonUsingAbility) {
    downPoint += rolledPoints[0];
    resetDice();
  } else {
    if (
      primeNum.includes(rolledPoints[0]) &&
      primeNum.includes(rolledPoints[1])
    ) {
      point = rolledPoints[0] + rolledPoints[1];
      upPoint -= point;
      upPointEle.textContent = upPoint + "";
      downPoint += point;
    } else if (
      !primeNum.includes(rolledPoints[0]) &&
      !primeNum.includes(rolledPoints[1])
    ) {
      downPoint -= rolledPoints[0] + rolledPoints[1];
    } else {
      downPoint += point;
    }
  }
  downPointEle.textContent = downPoint + "";
  // demonBoard.classList.add("get_darker");
  // demonBoard.classList.remove("remove_darker");
  demonTurn = false;
  setDarker(demonBoard);
  demonAbility.classList.add("coolDownBtn");
  demonRoll.classList.add("coolDownBtn");
  // angelAbility.classList.add("coolDownBtn");
  // setTimeout(() => {
  //   angelBoard.classList.add("remove_darker");
  //   angelBoard.classList.remove("get_darker");
  // }, 1000);

  angleTurn = true;
  if (!angCoolDown) angelAbility.classList.remove("coolDownBtn");
  angelRoll.classList.remove("coolDownBtn");
});

angelAbility.addEventListener("mouseover", function () {
  if (!angleTurn || gameOver) return;

  if (angCoolDown) {
    angelIntro.textContent = `You cannot use the ability until you roll ${unlockNumber}`;
  } else angelIntro.innerHTML = angelIntroContent;
  angelIntro.style.display = "block";
  angelIntro.style.backgroundColor =
    "rgba(" + 255 + "," + 255 + "," + 255 + "," + 0.35 + ")";
});

angelAbility.addEventListener("mouseleave", function () {
  angelIntro.style.display = "none";
  angelIntro.style.backgroundColor =
    "rgba(" + 255 + "," + 255 + "," + 255 + "," + 0 + ")";
});

//if use the ability show the second dice
angelAbility.addEventListener("click", function () {
  if (!angleTurn || gameOver) return;
  if (angCoolDown) return;
  dice2.classList.toggle("hidden");
  dice1.classList.toggle("dice-left");
  dice2.classList.toggle("dice-right");
  angCoolDown = true;
});
console.log("aaa");

demonAbility.addEventListener("mouseover", function () {
  if (!demonTurn || gameOver) return;
  if (demonCoolDown) {
    demonIntro.textContent = `You cannot use the ability until you roll ${unlockNumber}`;
  } else demonIntro.innerHTML = demonIntroContent;
  demonIntro.style.display = "block";
  demonIntro.style.backgroundColor =
    "rgba(" + 255 + "," + 255 + "," + 255 + "," + 0.35 + ")";
});

demonAbility.addEventListener("mouseleave", function () {
  demonIntro.style.display = "none";
  demonIntro.style.backgroundColor =
    "rgba(" + 255 + "," + 255 + "," + 255 + "," + 0 + ")";
});

//if use the ability show the second dice
demonAbility.addEventListener("click", function () {
  if (!demonTurn || gameOver) return;
  demonUsingAbility = true;
  dice2.classList.remove("hidden");
  dice1.classList.add("dice-left");
  dice2.classList.add("dice-right");
});
console.log("aaa");

restart.addEventListener("click", function () {
  gameOver = false;
  upPoint = 50;
  downPoint = 50;
  upPointEle.textContent = upPoint + "";
  downPointEle.textContent = downPoint + "";
  removeDarker(angelBoard);
  setDarker(demonBoard);
  dice1.src = `dice-1.png`;
  angelAbility.classList.remove("coolDownBtn");
  angelRoll.classList.remove("coolDownBtn");
  demonAbility.classList.add("coolDownBtn");
  demonRoll.classList.add("coolDownBtn");
  angelBoard.classList.remove("game_over");
  demonBoard.classList.remove("game_over");
  dice1.classList.remove("dice-left");
  dice2.classList.remove("dice-right");
  dice2.classList.add("hidden");
  dice1.classList.remove("hidden");

  angelIntro.classList.remove("coolDownIntro");

  angCoolDown = false;
  demonCoolDown = false;
  angleTurn = true;
  demonTurn = false;
});

//optimize the size of intro

//if press ability it will become another color to show you are using ablility
