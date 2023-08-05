'use strict'
var gBoard

const MINE = '✖'
const FLAG = '🚩'


var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    markedCount: 0,
    shownCount: 0,
    secsPassed: 0
}
var gMinesNumbers = gLevel.MINES
var gMarkedCount = 0
var gShownCount = 0
var gBoardCells = gLevel.SIZE ** 2



function onInit() {
    stopTimer()
    gGame.isOn = true
    gShownCount = 0
    gBoard = createBoard()
    renderBoard()
    updateScore(gMinesNumbers)

}
function createBoard() {
    var nums = []
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    return board
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="board-row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            // var classShown = (cell.isShown) ? 'shown' : ''
            // var classMarked = (cell.isMarked) ? 'marked' : ''
            // var classMine = (cell.isMine) ? 'mine' : ''
            if (cell.isBooked) {
                classShown += ' booked'
            }
            strHTML += `\t<td data-i="${i}" data-j="${j}" class="cell" 
                            onclick="onCellClicked(this,event, ${i}, ${j})" oncontextmenu="CellMarked(event,this, ${i}, ${j})"  >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elCells = document.querySelector('.board')
    elCells.innerHTML = strHTML
}
function increaseLevel() {
    stopTimer()
    resetTimer()
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gLevel.SIZE += 1
    gLevel.MINES += 1
    // updateRestButton('😀')
    gMinesNumbers = gLevel.MINES
    updateScore(gMinesNumbers)
    onInit()
}
function decreaseLevel() {
    stopTimer()
    resetTimer()
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gLevel.SIZE -= 1
    gLevel.MINES -= 1
    // updateRestButton('😀')
    gShownCount = 0
    gMinesNumbers = gLevel.MINES
    updateScore(gMinesNumbers)
    onInit()
}
function RestartGame() {
    stopTimer()
    resetTimer()
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    // updateRestButton('😀')
    gShownCount = 0
    gMinesNumbers = gLevel.MINES
    updateScore(gMinesNumbers)
    onInit()
}
function checkGameOver() {
    if (gMinesNumbers === 0) {
        var elLose=document.querySelector('.lose')
        elLose.classList.remove('hiden')
                setTimeout(() => {
                    elLose.classList.add('hiden')
                }, 1500)
                // updateRestButton('You Lose !! 😡')
        gGame.isOn = false
        stopTimer()
        resetTimer()
    }
    else if (gGame.shownCount - gGame.markedCount === gLevel.SIZE ** 2 || gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2) {
        var elLose=document.querySelector('.win')
        elLose.classList.remove('hiden')
                setTimeout(() => {
                    elLose.classList.add('hiden')
                }, 1500)
        gGame.isOn = false
        stopTimerAndSave()
        resetTimer()

    }
}
function CellMarked(event, elcell, i, j) {
    event.preventDefault();
    var currCell = gBoard[elcell.dataset.i][elcell.dataset.j]
    if (currCell.isShown) return
    if (currCell.isMarked === true) {
        updateMarkedCount(0)
        currCell.isMarked = false
        elcell.innerText = ''
    } else if (currCell.isMarked === false) {
        updateMarkedCount(1)
        currCell.isMarked = true
        elcell.innerText = FLAG
        checkGameOver()
    }
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    var currCell = gBoard[elCell.dataset.i][elCell.dataset.j]
    elCell.style.backgroundColor = "white"
    if (gGame.shownCount === 0 && gGame.secsPassed === 0) {
        startTimer()
        gGame.shownCount += 1
        // debugger
        elCell.innerText = '❤'
        // updateShownCount(1)
        console.log('gGame.markedCount:', gGame.markedCount)
        console.log('gGame.shownCount:', gGame.shownCount)
        addMines()
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                var elInCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                i = +elInCell.dataset.i
                j = +elInCell.dataset.j
                var mine = gBoard[i][j]
                var nigNum = setMinesNegsCount(gBoard, i, j)
                if (nigNum > 0 && mine.isMine === false) {
                    //elInCell.classList.add('cellRevile')
                    elInCell.minesAroundCount = nigNum
                    elInCell.innerText = nigNum
                }
            }
        }
        // debugger
        updateSecsPassed(1)
        // updateShownCount(1)
        currCell.isShown = true
    }
    else if (!currCell.isMine) {
        gGame.shownCount += 1
        // updateSecsPassed(1)
        // updateShownCount(1)
        // currCell.isShown = true

        i = +elCell.dataset.i
        j = +elCell.dataset.j
        colorMinesNegsAround(gBoard, i, j)
    }
    else if (currCell.isMine) {
        gGame.shownCount += 1
        gMinesNumbers--
        updateScore(gMinesNumbers)
        // console.log('gMinesCount:', gMinesCount)
        // updateShownCount(1)
        currCell.isShown = true
        // elCell.classList.add('mine')
        //elCell.innerText = MINE
        // updateMines(gMinesCount)
        i = +elCell.dataset.i
        j = +elCell.dataset.j
        //colorMinesNegsAround(gBoard, i, j)
        // checkGameOver()
        //     return
    }
    checkGameOver()
}


function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine && !currCell.isMarked) {
                count++
            }
            currCell.minesAroundCount = count
        }
    }
    // console.log('gBoard:', gBoard)
    return count
}
function colorMinesNegsAround(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (!currCell.isMine && !currCell.isMarked && !currCell.isShown) {
                var elInCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                elInCell.style.backgroundColor = "white"
                currCell.isShown = true
                gGame.shownCount += 1
                gGame.secsPassed += 1
            }

        }
    }

}


function getEmptyCell(board) {
    const emptyPoses = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isShown === false && board[i][j].isMine === false && board[i][j].isMarked === false) {
                emptyPoses.push({ i, j })
            }
        }
    }
    if (!emptyPoses.length) return null;
    return emptyPoses[getRandomIntInclusive(0, emptyPoses.length - 1)]
}
function addMine(board) {
    var emptyCell = getEmptyCell(board)
    console.log('emptyCell:', emptyCell)
    // console.log('emptyCell:', emptyCell)
    if (!emptyCell) return
    //model
    board[emptyCell.i][emptyCell.j].isMine = true;

    //dom
    var elInCell = document.querySelector(`[data-i="${emptyCell.i}"][data-j="${emptyCell.j}"]`)
    elInCell.innerText = MINE
}
function addMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        addMine(gBoard)
    }
}
function getMineCell(board) {
    const minePoses = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine === true && board[i][j].isMarked === false) {
                minePoses.push({ i, j })

            }
        }
    }
    if (!minePoses.length) return null;
    console.log('emptyPoses:', minePoses[getRandomIntInclusive(0, minePoses.length - 1)])
    return minePoses[getRandomIntInclusive(0, minePoses.length - 1)]
}
function removeMine(board) {

    // for (var i = 0; i < 3; i++) {
    var mineCell = getMineCell(board)
    console.log('mineCell:', mineCell)
    if (!mineCell) return
    board[mineCell.i][mineCell.j].isMine = false;
    var mini = document.querySelector(`[data-i="${mineCell.i}"][data-j="${mineCell.j}"]`)
    mini.innerText = ''
    console.log('m', mini)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var elInCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            console.log('elInCell:', elInCell)
            i = +elInCell.dataset.i
            j = +elInCell.dataset.j
            var mine = gBoard[i][j]
            var nigNum = setMinesNegsCount(board, i, j)
            console.log('nigNum:', nigNum)
            if (nigNum > 0 && mine.isMine === false) {
                elInCell.minesAroundCount = nigNum
                elInCell.innerText = nigNum
                console.log('mineCell.)', elInCell)
    
            }
            if (nigNum === 0 && mine.isMine === false) {
                elInCell.minesAroundCount = nigNum
                elInCell.innerText = ''
                console.log('mineCell.)', elInCell)
    
            }
        }
    }
    //dom
}
function removeMines() {
    if (gLevel.mineCell <= 2) {
        for (var i = 0; i < 2; i++) {
            removeMine(gBoard)
        }
    } else
        for (var i = 0; i < 3; i++) {
            removeMine(gBoard)
        }
}

function updateMarkedCount(num) {
    if (num > 0) gGame.markedCount += num
    else gGame.markedCount -= 1
}
function updateShownCount(num) {
    gGame.shownCount += num

}
function updateSecsPassed(num) {
    gGame.secsPassed += num

}
function updateRestButton(txt) {
    var elRest = document.querySelector('.restart')
    elRest.innerText = txt
}
function updateScore(gMinesCount) {
    var elLive = document.querySelector('.live')
    elLive.innerText = 'LIVE : ' + gMinesCount
}
function updateMines(gMinesCount) {
    var elLive = document.querySelector('.mines')
    elLive.innerText = 'Mines On The Board  : ' + gMinesCount
}

// Set the initial time in seconds
var currentTime = 0;
var timerInterval;
var timerRunning = false;
var savedTime = localStorage.getItem("savedTime");

const timerElement = document.querySelector('.timer');
const startButton = document.querySelector('.startButton');
const stopButton = document.querySelector('.stopButton');
const resetButton = document.querySelector('.resetButton');
const clearStorageButton = document.querySelector('.clearStorageButton');
const savedTimeElement = document.getElementById("savedTimeValue"); // Update the saved time value

function updateTimer() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerElement.textContent = `SCORE IS :${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    currentTime++;
}
function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    currentTime = 0;
    timerElement.textContent = " SCORE IS : 00:00"; // Reset the timer display
}
function clearLocalStorage() {
    localStorage.clear();
    savedTime = null;
    savedTimeElement.textContent = "Not saved"; // Reset saved time display
}


function startTimer() {
    if (!timerRunning) {
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        timerRunning = true;
    }
}

function stopTimerAndSave() {
    clearInterval(timerInterval);
    timerRunning = false;
    saveTime();
}
function stopTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
}
function saveTime() {
    // If there's no saved time or the new time is shorter, update the saved time
    if (savedTime === null || currentTime < savedTime) {
        savedTime = currentTime;
        localStorage.setItem("savedTime", savedTime);
    }
    savedTimeElement.textContent = `${savedTime} seconds`; // Update saved time display
}

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimerAndSave);
resetButton.addEventListener("click", resetTimer);
clearStorageButton.addEventListener("click", clearLocalStorage);



// Automatically start the timer when the page loads

// Load saved time and update display
if (savedTime !== null) {
    savedTimeElement.textContent = `${savedTime} seconds`;
}
var elBtn = document.querySelector('.termin')
elBtn.style.backgroundImage = "url('img/terminator.jpeg')"
