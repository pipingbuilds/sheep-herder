
let sheep = document.getElementById(`s1`);
let buttonGame = document.getElementById('game');
let dog = document.getElementById('dog');
let dogStyle = document.querySelector('.dog');
let dogLeft = getComputedStyle(dogStyle).left;
let dogHeight = getComputedStyle(dogStyle).height;
let dogWidth = getComputedStyle(dogStyle).width;
let containerStyle = document.querySelector('.game-container');
let containerWidth = getComputedStyle(containerStyle).width;
let contWidthParsed = parseInt(containerWidth, 10);
let containerHeight = getComputedStyle(containerStyle).height;
let contHeightParsed = parseInt(containerHeight, 10);
let sheepDogDiff = (contHeightParsed - (parseInt(dogHeight, 10)*2));
let sheepNum = 0;
let sheepThrough = 0;
let sheepEndStatus = false;
let sheepGo = true;
let startBtn = document.getElementById('game-start');
let restartBtn = document.getElementById('game-restart');
let popupSt = document.getElementById('popup-start');
let popupEnd = document.getElementById('popup-end');
/*
To do list:
space bar interaction
mouse interaction
fix right/left glitch
make sheep path an arch?
create 
*/

function herdLeft() {
    let currentPos = parseInt(dogLeft, 10);
    let targetPos = 0; 
    let timer = setInterval (function () {
        if (keyDown === true && currentPos !== targetPos) {
            currentPos--;
        }
        dog.style.left = (`${currentPos}px`);
        if (currentPos === targetPos || (currentPos === targetPos && keyDown === false) || keyDown === false) {
            clearInterval(timer);
            }
            dogLeft = (`${currentPos}px`);
        }, .5);
}

function herdRight() {
    let currentPos = parseInt(dogLeft, 10);
    let targetPos = (contWidthParsed - parseInt(dogWidth, 10));
    let timer = setInterval (function () {    
        if (keyDown === true && currentPos !== targetPos) {
            currentPos++;
        }
            dog.style.left = (`${currentPos}px`);
        if (currentPos === targetPos || (currentPos === targetPos && keyDown === false) || keyDown === false) {
            clearInterval(timer);
            }
        dogLeft = (`${currentPos}px`);
        }, .5);
}

let keyDown = false;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) {
        keyDown = true;
        herdLeft();
    }  else if (e.keyCode === 39) {
        keyDown = true;
        herdRight();
    }  
});

document.addEventListener('keyup', function() {
    keyDown = false;
});

gameStart = (s) => {
    popupSt.style.display = 'none';
    popupEnd.style.display = 'none';
    if (buttonGame.innerHTML === 'Start Game' || buttonGame.innerHTML === 'Start Over') {
        buttonGame.style.display = 'block';
        buttonGame.innerHTML = 'End Game';
        buttonGame.style.backgroundColor = 'rgb(145, 44, 44)';
        sheepEndStatus = false;
        sheepMaker(s);        
    } else if (buttonGame.innerHTML === 'End Game') {
        buttonGame.innerHTML = 'Start Over';
        buttonGame.style.display = 'block';
        buttonGame.style.backgroundColor = 'rgb(8, 153, 45)';
        sheepThrough = 0;
        document.getElementById('counter').innerHTML = `You have let ${sheepThrough} sheep by.`;
        sheepEndStatus = true;
        sheepEnder();
    }
}
function sheepNumCheck(x) {
    if (sheepThrough === x) {
        buttonGame.style.display = 'none';
        popupEnd.style.display = 'initial';
        sheepEndStatus = true;
        sheepEnder();
        sheepNum = 0;
    }
}

function sheepMaker(n) {
    if (sheepEndStatus === false) {
        sheepGo = true;
        let newSheep = document.createElement('img');
        newSheep.setAttribute('src', './assets/sheep.png');
        newSheep.setAttribute('id', `s${n}`)
        newSheep.classList.add('sheep');
        newSheep.style.left = Math.floor(Math.random() * contWidthParsed) + 'px';
        document.getElementById('game-container').appendChild(newSheep);
        sheepMove(newSheep.id);  
        sheepNum++;
        sheepNumCheck(100);
    }
}

const sheepMove = (s) => {
    let sheepForward = true;
    let currentSheep = document.getElementById(s);
    let currentPos = 0;
    let targetPos = contHeightParsed; 
    let timer = setInterval (function () { 
        currentPos++;
        currentSheep.style.top = (currentPos + "px");
        if (currentPos === sheepDogDiff) {
            if (collideDetect(dog, currentSheep) === true) {
               sheepForward = false;
               sheepBounce(currentSheep);
            }
        }      
        if (currentPos === targetPos || sheepEndStatus === true || sheepForward === false) {
            clearInterval(timer);
            if (currentPos === targetPos || sheepEndStatus === true) {
                currentSheep.remove();
                sheepMaker(sheepNum);
                sheepMaker(sheepNum);
                if (currentPos === targetPos) {
                sheepUpdate();
                }
            }
        }
        }, 2);
}

const sheepBounce = (s) => {
    let thisSheep = s;
    let currentPos = parseInt(thisSheep.style.top, 10);
    let targetPos = Math.floor(Math.random() * (650 - 550) + 550);
    console.log(sheepNum);
    let timer = setInterval (function () { 
        
        currentPos--;
        thisSheep.style.top = (currentPos + "px");
        if (currentPos === targetPos) {
            clearInterval(timer);
            sheepTurn(thisSheep);
         }
        }, 2);
}

const sheepTurn = (s) => {
    let thisSheep = s;
    let startingPos = parseInt(thisSheep.style.left, 10);
    let currentPos = parseInt(thisSheep.style.left, 10);
    const side = () => {
        if (startingPos > (contWidthParsed / 2)) {
            return 'right';
        } else if (startingPos <= (contWidthParsed / 2)) {
            return 'left';
        }
    }   
    let targetPosFind = () => {
        if (side() === 'right') {
            return startingPos - Math.floor(Math.random() * (120 - 60) + 60);
        } else if (side() === 'left') {
            return startingPos + Math.floor(Math.random() * (120 - 60) + 60);
        }
    }
    let targetPos = targetPosFind();
    let timer = setInterval (function () { 
        if (side() === 'right') {
            currentPos--;
        } else if (side() === 'left') {
            currentPos++;
        }
        thisSheep.style.left = (currentPos + "px");
        if (currentPos === targetPos) {
            clearInterval(timer);
            sheepMoveAgain(thisSheep);
         }
        }, 2);
}

const sheepMoveAgain = (s) => {
    let sheepForward = true;
    let thisSheep = s;
    let currentPos = parseInt(thisSheep.style.top, 10);
    let targetPos = contHeightParsed; 
    let timer = setInterval (function () { 
        currentPos++;
        thisSheep.style.top = (currentPos + "px");
        if (currentPos === sheepDogDiff) {

            if (collideDetect(dog, thisSheep) === true) {
                sheepForward = false;
                sheepBounce(thisSheep);
            }
        }       
        if (currentPos === targetPos || sheepEndStatus === true || sheepForward === false) {
            clearInterval(timer);
            if (currentPos === targetPos || sheepEndStatus === true) {
                thisSheep.remove();
                sheepMaker(sheepNum);
                sheepMaker(sheepNum);
                if (currentPos === targetPos) {
                    sheepUpdate();     
                }
            }
            }
        }, 2);
}

const sheepEnder = () => {
    const allSheep = document.getElementsByClassName('sheep');
    while(allSheep.length > 0) {
        allSheep[0].parentNode.removeChild(allSheep[0]);
    }  
    sheepNum = 0;
}


startBtn.addEventListener('click', 
    function() {
        gameStart(sheepNum);
    }
);

buttonGame.addEventListener('click', 
    function() {
        gameStart(sheepNum);
    }
);

restartBtn.addEventListener('click', 
    function() {
        gameStart(sheepNum);
    }
);


//if elements collide
function collideDetect(d, s) {
    const dRect = d.getBoundingClientRect();
    const sRect = s.getBoundingClientRect();    
    return (
        ((sRect.right - dRect.right)*(sRect.right - dRect.left) <= 0) ||
        ((sRect.left - dRect.right)*(sRect.left - dRect.left) <= 0)
    );
}


sheepUpdate = () => {
    sheepThrough++;
    document.getElementById('counter').innerHTML = `You have let ${sheepThrough} sheep by.`;
}