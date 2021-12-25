const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATION = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const mainElement = document.getElementById('main');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const quitButton = document.getElementById('quitButton');
const winningMessageTextElement = document.querySelector('[data-warning-message]')
const onePlayerButton = document.getElementById("one-player")
const twoPlayerButton = document.getElementById("two-player")
const notice = document.getElementById("notice");
let circleTurn;
let multiplePlayer = false;

quitButton.addEventListener('click', quitGame);
restartButton.addEventListener('click', startGame)

quitGame()

function quitGame(){
    mainElement.classList.remove('hide');
    multiplePlayer = false;;
}

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true })
    });

    setBoardHover();
    winningMessageElement.classList.remove('show')
}


function handleClick(e) {
    if (circleTurn && !multiplePlayer)
        return;

    const cell = e.target;
    handlerRunMove(cell);
};

function handlerRunMove(cell) {
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);

    } else {
        swapTurns();
        setBoardHover();
        setNotice();
    }

}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerHTML = "Draw!"
    } else {
        winningMessageTextElement.innerHTML = `${!circleTurn ? "X's" : "Circle's"} win!`
    }

    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;

    if (multiplePlayer)
        return;

    if (circleTurn)
        turn_of_cpu();
}

function setBoardHover() {
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS);

    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)

    } else {
        board.classList.add(X_CLASS)
    }
}

function setNotice(){
    if(!circleTurn){
        notice.innerHTML = "Player1";
        return;
    }
        

    if(multiplePlayer){
        notice.innerHTML = "Player2";
        return;
    }

    notice.innerHTML = "CPU";

}

function checkWin(currentClass) {
    return WINNING_COMBINATION.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        })
    })
}

function turn_of_cpu() {
    const allowedCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)
    })

    const selected_cell_by_cpu = allowedCells[Math.floor(Math.random() * allowedCells.length)];

    setTimeout(() => {
        handlerRunMove(selected_cell_by_cpu)
    }, 2000);

}

onePlayerButton.addEventListener('click', () => {
    mainElement.classList.add('hide');
    startGame();
});

twoPlayerButton.addEventListener('click', () => {
    multiplePlayer = true;
    mainElement.classList.add('hide');
    startGame();
})