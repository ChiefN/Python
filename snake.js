//Statement - Gets our game-container and sets up the grid
const snakeHeader = document.querySelector('.snake-introduction');
let width = window.innerWidth +60;
let stripeCounter = 0;
for(let i = -60; i < width; i+=30){
    let stripe = document.createElement('div');
    if(stripeCounter%2 == 0){
    stripe.classList.add('stripe');
    }else{
        stripe.classList.add('stripeTwo');
    }
    stripe.style.left = `${i}px`;
    snakeHeader.appendChild(stripe);
    stripeCounter++;
}

//Statement - Gets our game-container and sets up the grid
const snakeGrid = document.querySelector(".snake-grid");
let nrOfTilesInRowAndColumn = 20;
let nrOfTiles = nrOfTilesInRowAndColumn * nrOfTilesInRowAndColumn;
snakeGrid.style.gridTemplateColumns = `repeat(${nrOfTilesInRowAndColumn}, 1fr)`
for(let i = 0; i < nrOfTiles; i++){
    let el = document.createElement('div');
    snakeGrid.appendChild(el);
}

//Statement - Get and store all the HTML-Elements we will need to be able to manipulate.
const gridTilesArr = document.querySelectorAll(".snake-grid div"); //Array - All gridTiles which together creates our grid. From top left(index:0) -> bottom right(index:nrOfTiles-1)
const scoreDisplay = document.querySelector(".snake-score span");
const startBtn = document.querySelector(".start-btn");
const snakeStartBtn = document.querySelector(".snake-start-btn");
const descHeader = document.querySelector('.game-mode-desc h3')
const descPara = document.querySelector('.game-mode-desc p');
const scoreDiv = document.querySelector('.snake-score');
const gameOverSection = document.querySelector('.game-over-section');
const currentScoreSection = document.querySelector('.current-score-section');
const currentScoreSectionH = document.querySelector('.current-score-section h2');
const highScoreSection = document.querySelector('.high-score-section');
const currentScoreSectionP = document.querySelector('.current-score-section p');
const changeToTouch = document.querySelector('.tsbutton');
const gameModeForm = document.querySelector('.game-mode-form');
const snakeAside = document.querySelector('.snake-aside');
const touchButtons = document.querySelector('.touchArrowKeys');
const touchButtonsPhone = document.querySelector('.touchArrowKeysPhone');
const phoneScore = document.querySelector('.phone-score');

//Statement - String-storage
const controlsStr = "Controls: W/A/S/D or Arrow keys <br>"
const oldSchoolStrName = "OldSchool";
const oldSchoolStrDesc = "I remember a time when Nokia3310 was the Beez Neez. This is my homage to simpler times.<br>Be the python, eat the apples & try to grow as much as possible!";
const noBordersStrName = "NoBorders";
const noBorderStrDesc = "Can it be? Is it Nagini? Hmm, anyhow, it looks like the python got magic powers. She cant escape her prison, but she can teleport.<br> Be the python, eat the apples & try to grow as much as possible!";
const highSpeedStrName = "HighSpeed";
const highSpeedStrDesc = "Python on Speed. I do not know if she is hallucinating or just lost the sense of hunger, both is plausible. Either way, if I were here i wouldnt eat the wierd looking apples.<br>Be the python, avoid the bombs and try to live as long as possible!";
const chooseWithCausionStrName = "ChooseWithCausion";
const chooseWithCausionStrDesc = "I do not know whats up.<br>Be the python and do what you want!";


//Statement - All vars related to our snake
let snakeArr = [2,1,0]; //Array - This is our snake. First index represent our head, last index represents our tail. The value represents where on the grid the snake currently is at.
let headIndex = 0;
let direction = 1;

//Statement - All vars related to our NPC.s
let appleIndex = [0];
let bombIndex = [0];

let date = new Date();

//Statement - All vars related to our game
let score = 0;
let speed = 0.9;
let intervalTime = 0;
let gameInterval = 0;
let bombInterval = 0;
let gameMode = "OldSchool";
changeGameMode();

let highScoreOS = [];
let highScoreNB = [];
let highScoreHS = [];
let highScoreCWC = [];

//Function - Start and restart the game
function startGame() {
    gameMode = checkRadio();
    removeNPCVisualitation("all");
    resetGame();
    generateNPC(); //Generates a new apple and places it on the grid.
    setGameSettings();

    snakeArr.forEach((index) => {gridTilesArr[index].classList.add('snake-snake')}); //Foreach value in our snakeArr add the css-snake-class. Paint the snake on the grid.
    gameInterval = setInterval(moveOutcomes, intervalTime); //Start the game. Update the grid based on the intervalTime.
}

//Function - That deals with all movements and outcomes of snake
function moveOutcomes(){
    let tail = 0;
    // try{
    // if (gridTilesArr[snakeArr[0] + direction].classList.contains('snake-snake')) {endGame(); clearInterval(bombInterval);
    // return clearInterval(gameInterval);}}catch(e){}

    //Deals with snake hitting border, then move snake.
    switch (gameMode) {
        case "NoBorders":
            if(snakeArr[0] + nrOfTilesInRowAndColumn >= (nrOfTilesInRowAndColumn * nrOfTilesInRowAndColumn) && direction === nrOfTilesInRowAndColumn){
                moveSnake(-(nrOfTilesInRowAndColumn*(nrOfTilesInRowAndColumn-1)));
            }else if(snakeArr[0] % nrOfTilesInRowAndColumn === nrOfTilesInRowAndColumn - 1 && direction === 1){
                moveSnake(-(nrOfTilesInRowAndColumn-1));
            }else if(snakeArr[0] % nrOfTilesInRowAndColumn === 0 && direction === -1){
                moveSnake((nrOfTilesInRowAndColumn-1));
            }else if(snakeArr[0] - nrOfTilesInRowAndColumn < 0 && direction === -nrOfTilesInRowAndColumn){
                moveSnake((nrOfTilesInRowAndColumn*(nrOfTilesInRowAndColumn-1)));
            }else{
                moveSnake(direction);
            }
            break;
        default:
            if (
                (snakeArr[0] + nrOfTilesInRowAndColumn >= (nrOfTilesInRowAndColumn * nrOfTilesInRowAndColumn) && direction === nrOfTilesInRowAndColumn) || //If snake hits bottom
                (snakeArr[0] % nrOfTilesInRowAndColumn === nrOfTilesInRowAndColumn - 1 && direction === 1) || //If snake hits right wall
                (snakeArr[0] % nrOfTilesInRowAndColumn === 0 && direction === -1) || //If snake hits left wall
                (snakeArr[0] - nrOfTilesInRowAndColumn < 0 && direction === -nrOfTilesInRowAndColumn) //If snake hits top wall
            ) {
                endGame();
                clearInterval(bombInterval);
                return clearInterval(gameInterval);
            }
            moveSnake(direction);
    }

//Deals with snake getting apple
    try {
        if (gridTilesArr[snakeArr[0]].classList.contains("snake-apple")) {
            gridTilesArr[tail].classList.add("snake-snake");
            snakeArr.push(tail);
            generateNPC();
            addScore();
            clearInterval(gameInterval);
            intervalTime *= speed;
            gameInterval = setInterval(moveOutcomes, intervalTime);
        }
    } catch (e) { }

    try {
        if (gridTilesArr[snakeArr[0]].classList.contains("snake-bomb")) {
            endGame();
            clearInterval(bombInterval);
            return clearInterval(gameInterval);
        }
    } catch (e) { }

    try {
        gridTilesArr[snakeArr[0]].classList.add("snake-snake");
    } catch (e) { }

    function moveSnake(nextIndex) {    
        try {
          if (
            gridTilesArr[snakeArr[0] + nextIndex].classList.contains(
              "snake-snake"
            )
          ) {
            endGame();
            clearInterval(bombInterval);
            return clearInterval(gameInterval);
          } else {
            tail = snakeArr.pop(); //Removes last bite of array
            gridTilesArr[tail].classList.remove("snake-snake");
            snakeArr.unshift(snakeArr[0] + nextIndex);
          }
        } catch (e) {
          console.log(e);
            tail = snakeArr.pop(); //Removes last bite of array
            gridTilesArr[tail].classList.remove("snake-snake");
            snakeArr.unshift(snakeArr[0] + nextIndex);
        }
    }
}

//Function - Based on the input(event) e make snake move up/down/right or left
function control(e){
    //Statement - Removes snake from grid
    gridTilesArr[headIndex].classList.remove('snake-snake');

    //If we press the right arrow or D
    if(e.keyCode === 39 || e.keyCode === 68){
        if(direction != -1){
        direction = 1;
        }
    }else if(e.keyCode === 38 || e.keyCode === 87){ //If we press the up arrow or W
        if(direction != nrOfTilesInRowAndColumn){
        direction = -nrOfTilesInRowAndColumn;
        }
    }else if(e.keyCode === 37 || e.keyCode === 65){ //If we press the left arrow or A
        if(direction != 1){
        direction = -1;
        }
    }else if(e.keyCode === 40 || e.keyCode === 83){ //If we press the down arrow or S
        if(direction != -nrOfTilesInRowAndColumn){
        direction = nrOfTilesInRowAndColumn;
        }
    }
}

//Statement - Add an eventlistener to when key is released.
document.addEventListener('keyup', control);

startBtn.addEventListener('click', startGame);



function removeNPCVisualitation(type = "all"){
    switch(type){
        case "npc":
            appleIndex.forEach((val, index) => {gridTilesArr[val].classList.remove('snake-apple');});
            bombIndex.forEach((val, index) => {gridTilesArr[val].classList.remove('snake-bomb');});
            break;
        default:
            snakeArr.forEach((val, index) => {gridTilesArr[val].classList.remove('snake-snake')});
            appleIndex.forEach((val, index) => {gridTilesArr[val].classList.remove('snake-apple');});
            bombIndex.forEach((val, index) => {gridTilesArr[val].classList.remove('snake-bomb');});
    }
}

function resetGame(){
    currentScoreSection.style.background = "linear-gradient(90deg, rgba(243,57,8,255) 40%, rgba(222,191,147,255) 60%)"
    gameOverSection.style.display = "none";
    highScoreSection.style.border = "none";
    score = 0;
    scoreDisplay.innerText = score;
    phoneScore.innerText = score;
    clearInterval(gameInterval);
    clearInterval(bombInterval);
    while(appleIndex.length > 0){appleIndex.pop();}
    while(bombIndex.length > 0){bombIndex.pop();}
    direction = 1;
    snakeArr = [2,1,0]; //Resets our snakes startpos
    currentIndex = 0;
}

function setGameSettings(){
    gameMode = checkRadio();
    intervalTime = 500; //Sets the speed of the game.
    if(gameMode == "HighSpeed"){bombInterval = setInterval(generateNPC, 5000); intervalTime = 50;}
}

function changeGameMode(){
    switch (checkRadio()
    ) {
      case "OldSchool":
          descHeader.innerText = "OldSchool";
          descPara.innerHTML = `${controlsStr} I remember a time when Nokia3310 was the Beez Neez. This is my homage to simpler times.<br>Be the python, eat the apples & try to grow as much as possible!`;
        break;
      case "NoBorders":
        descHeader.innerText = "NoBorders";
        descPara.innerHTML = `${controlsStr} Can it be? Is it Nagini? Hmm, anyhow, it looks like the python got magic powers. She cant escape her prison, but she can teleport.<br> Be the python, eat the apples & try to grow as much as possible!`;
        break;
      case "HighSpeed":
        descHeader.innerText = "HighSpeed";
        descPara.innerHTML = `${controlsStr} Python on Speed. I do not know if she is hallucinating or just lost the sense of hunger, both is plausible. Either way, if I were here i wouldnt eat the wierd looking apples.<br>Be the python, avoid the bombs and try to live as long as possible!`;
        break;
      case "ChooseWithCausion":
        descHeader.innerText = "ChooseWithCausion";
        descPara.innerHTML = `${controlsStr}I do not know whats up.<br>Be the python and do what you want!`;
        break;
      default:
    }
}

function checkRadio(){
    const radioBtnAll = document.querySelectorAll('[name="choice"]');
    let gameMode = "";
    radioBtnAll.forEach((val, index) => {
        if(radioBtnAll[index].checked){
            gameMode = radioBtnAll[index].value;
        }
    });
    return gameMode;
}

function generateNPC(){
    removeNPCVisualitation("npc");
    switch (gameMode) {
      case "ChooseWithCausion":
        if (score % 4 === 0 && appleIndex.length < 5) {
          appleIndex.unshift(Math.floor(Math.random() * nrOfTiles));
          bombIndex.unshift(Math.floor(Math.random() * nrOfTiles));
        }
        appleIndex.forEach((val, index) => {
          do {
            appleIndex[index] = Math.floor(Math.random() * nrOfTiles);
          } while (gridTilesArr[val].classList.contains("snake-snake"));
        });
        bombIndex.forEach((val, index) => {
          do {
            bombIndex[index] = Math.floor(Math.random() * nrOfTiles);
          } while (gridTilesArr[val].classList.contains("snake-snake"));
        });
        break;

      case "HighSpeed":
        if (score % 3 === 0 && bombIndex.length < 6) {
          bombIndex.unshift(Math.floor(Math.random() * nrOfTiles));
        }
        bombIndex.forEach((val, index) => {
          do {
            bombIndex[index] = Math.floor(Math.random() * nrOfTiles);
          } while (gridTilesArr[val].classList.contains("snake-snake"));
        });
        addScore();
        let tail = snakeArr[snakeArr.length - 1];
        snakeArr.push(tail);
        break;

      default:
        do {
          appleIndex[0] = Math.floor(Math.random() * nrOfTiles);
        } while (gridTilesArr[appleIndex[0]].classList.contains("snake-snake"));
    }

appleIndex.forEach((val, index) => {
    gridTilesArr[val].classList.add('snake-apple');
});
bombIndex.forEach((val, index) => {
    gridTilesArr[val].classList.add('snake-bomb');
});
}

function addHighScore(gameModeParam, currentScoreParam){
  let thisDate = date.getDate();
  let thisMonth = date.getMonth();
  let storeDate = `${thisDate}/${thisMonth + 1}`
  if(localStorage.getItem('oldSchoolHS') != null){
    highScoreOS = JSON.parse(localStorage.getItem('oldSchoolHS'));
  }
  if(localStorage.getItem('noBordersHS') != null){
    highScoreNB = JSON.parse(localStorage.getItem('noBordersHS'));
  }
  if(localStorage.getItem('highSpeedHS') != null){
    highScoreHS = JSON.parse(localStorage.getItem('highSpeedHS'));
  }
  if(localStorage.getItem('chooseWithCausionHS') != null){
    highScoreCWC = JSON.parse(localStorage.getItem('chooseWithCausionHS'));
  }
  switch (gameModeParam) {
    case "OldSchool":
        highScoreOS.push({"date":storeDate, "highScore":currentScoreParam});
        highScoreOS.sort(function(a, b){return b.highScore-a.highScore});
        if(highScoreOS.length > 5){
          highScoreOS.pop();
        }
      break;

      case "NoBorders":
          highScoreNB.push({"date":storeDate, "highScore":currentScoreParam});
          highScoreNB.sort(function(a, b){return b.highScore-a.highScore});
          if(highScoreNB.length > 5){
            highScoreNB.pop();
          }
        break;

      case "HighSpeed":
          highScoreHS.push({"date":storeDate, "highScore":currentScoreParam});
          highScoreHS.sort(function(a, b){return b.highScore-a.highScore});
          if(highScoreHS.length > 5){
            highScoreHS.pop();
          }
        break;

      case "ChooseWithCausion":
          highScoreCWC.push({"date":storeDate, "highScore":currentScoreParam});
          highScoreCWC.sort(function(a, b){return b.highScore-a.highScore});
          if(highScoreCWC.length > 5){
            highScoreCWC.pop();
          }
        break;

      default:
  }
}

function endGame(){
    
    let listOfLists = [];
    gameOverSection.style.display = "flex";
    const currentScore = score;
    const currentGameMode = gameMode;
    currentScoreSectionP.innerText = `${currentScore}(${currentGameMode})`;
    
    addHighScore(currentGameMode, currentScore);

    switch (currentGameMode) {
      case "OldSchool":
        if(highScoreOS.length == 1){
          newHighScoreSound();
          designHighScoreSec();
        }
        else if(currentScore > highScoreOS[1].highScore){
          newHighScoreSound();
          designHighScoreSec();
        }else{
          gameOverSound();
          currentScoreSectionH.innerText ="Your score";
        }
        break;
      case "NoBorders":
        if(highScoreNB.length == 1){
          newHighScoreSound();
          designHighScoreSec();
        }
        else if(currentScore > highScoreNB[1].highScore){
          newHighScoreSound();
          designHighScoreSec();
        }else{
          gameOverSound();
          currentScoreSectionH.innerText ="Your score";
        }
        break;
      case "HighSpeed":
        if(highScoreHS.length == 1){
          newHighScoreSound();
          designHighScoreSec();
        }
        else if(currentScore > highScoreHS[1].highScore){
          newHighScoreSound();
          designHighScoreSec();
        }else{
          gameOverSound();
          currentScoreSectionH.innerText ="Your score";
        }
        break;
      case "ChooseWithCausion":
        if(highScoreCWC.length == 1){
          newHighScoreSound();
          designHighScoreSec();
        }
        else if(currentScore > highScoreCWC[1].highScore){
          newHighScoreSound();
          designHighScoreSec();
        }else{
          gameOverSound();
          currentScoreSectionH.innerText ="Your score";
        }
        break;
      default:
    }

    while(highScoreSection.lastChild){
        highScoreSection.removeChild(highScoreSection.lastChild);
    }

    if(highScoreOS.length > 0){
        let secEl = document.createElement('section');
        secEl.classList.add('osList');
        secEl.classList.add('highScoreLists');

        let secElH3 = document.createElement('h3');
        secElH3.innerText = "OldSchool";
        secEl.appendChild(secElH3);

        let secElUl = document.createElement('ul');

        highScoreOS.forEach((val, index) => {
            let secElLi = document.createElement('li');
            secElLi.innerText= `${highScoreOS[index].date} : ${highScoreOS[index].highScore}`;
            secElUl.appendChild(secElLi);
        });

        secEl.appendChild(secElUl);
        highScoreSection.appendChild(secEl);
    }

    if(highScoreNB.length > 0){
        let secEl = document.createElement('section');
        secEl.classList.add('nbList');
        secEl.classList.add('highScoreLists');

        let secElH3 = document.createElement('h3');
        secElH3.innerText = "NoBorders";
        secEl.appendChild(secElH3);

        let secElUl = document.createElement('ul');

        highScoreNB.forEach((val, index) => {
            let secElLi = document.createElement('li');
            secElLi.innerText = `${highScoreNB[index].date} : ${highScoreNB[index].highScore}`;
            secElUl.appendChild(secElLi);
        });

        secEl.appendChild(secElUl);
        highScoreSection.appendChild(secEl);
    }

    if(highScoreHS.length > 0){
        let secEl = document.createElement('section');
        secEl.classList.add('hsList');
        secEl.classList.add('highScoreLists');

        let secElH3 = document.createElement('h3');
        secElH3.innerText = "HighSpeed";
        secEl.appendChild(secElH3);

        let secElUl = document.createElement('ul');

        highScoreHS.forEach((val, index) => {
            let secElLi = document.createElement('li');
            secElLi.innerText =  `${highScoreHS[index].date} : ${highScoreHS[index].highScore}`;
            secElUl.appendChild(secElLi);
        });

        secEl.appendChild(secElUl);
        highScoreSection.appendChild(secEl);
    }

    if(highScoreCWC.length > 0){
        let secEl = document.createElement('section');
        secEl.classList.add('cwcList');
        secEl.classList.add('highScoreLists');

        let secElH3 = document.createElement('h3');
        secElH3.innerText = "ChooseWithCausion";
        secEl.appendChild(secElH3);

        let secElUl = document.createElement('ul');

        highScoreCWC.forEach((val, index) => {
            let secElLi = document.createElement('li');
            secElLi.innerText = `${highScoreCWC[index].date} : ${highScoreCWC[index].highScore}`;
            secElUl.appendChild(secElLi);
        });

        secEl.appendChild(secElUl);
        highScoreSection.appendChild(secEl);
    }


    if(window.innerWidth < 891){
        switch (currentGameMode) {
          case "OldSchool":
            document.querySelector('.osList').style.display = "block";
            break;
          case "NoBorders":
            document.querySelector('.nbList').style.display = "block";
            break;
          case "HighSpeed":
            document.querySelector('.hsList').style.display = "block";
            break;
          case "ChooseWithCausion":
            document.querySelector('.cwcList').style.display = "block";
            break;
          default:
        }
    }

    localStorage.removeItem('oldSchoolHS');
    localStorage.setItem('oldSchoolHS', JSON.stringify(highScoreOS));
    highScoreOS.length = 0

    localStorage.removeItem('noBordersHS');
    localStorage.setItem('noBordersHS', JSON.stringify(highScoreNB));
    highScoreNB.length = 0

    localStorage.removeItem('highSpeedHS');
    localStorage.setItem('highSpeedHS', JSON.stringify(highScoreHS));
    highScoreHS.length = 0

    localStorage.removeItem('chooseWithCausionHS');
    localStorage.setItem('chooseWithCausionHS', JSON.stringify(highScoreCWC));
    highScoreCWC.length = 0
}

function designHighScoreSec(){
  currentScoreSectionH.innerText ="New highscore";
  currentScoreSection.style.background = "#77b255";
  highScoreSection.style.border = "6px solid #77b255";
}

function addScore(){
  scoreSound();
  score++;
  scoreDisplay.textContent = score;
  phoneScore.innerText = score;
  scoreDiv.style.background = "#77b255";
  phoneScore.style.background = "#77b255";
  setTimeout(() =>{scoreDiv.style.background = "rgba(222,191,147,255)"}, 200);
  setTimeout(() =>{phoneScore.style.background = "rgba(222,191,147,255)"}, 200);
}

function gameOverSound() {
  let snd = new Audio("./Media/gameOverSound.mp3");  
  snd.play();
}

function scoreSound() {
  let snd = new Audio("./Media/scoreBeep.mp3");
  snd.play();
}

function newHighScoreSound() {
  let snd = new Audio("./Media/newHighScore.mp3");  
  snd.play();
}

function showTouchButtons(){
  if(changeToTouch.getAttribute("data-showingTouch") == "false"){
    changeToTouch.innerText = "Show settings";
    changeToTouch.setAttribute("data-showingTouch", "true")
    gameModeForm.style.display = "none";
    descPara.style.display = "none";
    changeToTouch.style.marginBottom = "0px";
    snakeAside.style.gridTemplateRows = "auto auto auto auto 1fr"
    snakeAside.style.alignContent = "flex-start";
    touchButtons.style.display = "grid";
  }else{
    changeToTouch.innerText = "Get touchscreen buttons";
    changeToTouch.style.marginBottom = "auto";
    changeToTouch.setAttribute("data-showingTouch", "false")
    descPara.style.display= "block";
    gameModeForm.style.display = "flex";
    snakeAside.style.gridTemplateRows = "1fr auto auto auto auto"
    snakeAside.style.alignContent = "flex-end";
    touchButtons.style.display = "none";
  }
}

function touchControls(el){
    let pressedBtn = el.getAttribute("data-btn");


    gridTilesArr[headIndex].classList.remove('snake-snake');

    //If we press the right arrow or D
    if(pressedBtn === "D"){
        if(direction != -1){
        direction = 1;
        }
    }else if(pressedBtn === "W"){ //If we press the up arrow or W
        if(direction != nrOfTilesInRowAndColumn){
        direction = -nrOfTilesInRowAndColumn;
        }
    }else if(pressedBtn === "A"){ //If we press the left arrow or A
        if(direction != 1){
        direction = -1;
        }
    }else if(pressedBtn === "S"){ //If we press the down arrow or S
        if(direction != -nrOfTilesInRowAndColumn){
        direction = nrOfTilesInRowAndColumn;
        }
    }
}
