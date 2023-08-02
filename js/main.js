'use strict'

var gMarkedCount = 0
var gShownCount = 0
var gBoard

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
var gCell = null


function onInit() {
    gBoard = createBoard()
    renderBoard()

    // disableRightClick()
}
function createBoard() {
    var nums = []
    const board = []
    for (var i = 0; i < 4; i++) {
        board[i] = []
        for (var j = 0; j < 4; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false

            }
            board[i][j] = cell
        }
        var num = getRandomInt(0, board.length + 1)
        nums.push(num)
    }
    console.log('nums:', nums)
    board[nums[0]][nums[1]].isMine = true
    board[nums[2]][nums[3]].isMine = true
    // board[1][1].isShown = true
    // board[2][1].isShown = true
    // board[1][2].isMarked = true
    // board[1][3].isMarked = true
    return board
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="board-row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            // For cell of type SEAT add seat class:
            var classShown = (cell.isShown) ? 'shown' : ''
            var classMarked = (cell.isMarked) ? 'marked' : ''
            var classMine = (cell.isMine) ? 'mine' : ''
            if (cell.isBooked) {
                classShown += ' booked'
            }
            // TODO: for cell that is booked add booked class

            strHTML += `\t<td data-i="${i}" data-j="${j}" class="cell ${classShown}" 
                            onclick="onCellClicked(this,event, ${i}, ${j})" oncontextmenu="CellMarked(event,this, ${i}, ${j})"  >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elCells = document.querySelector('.board')
    elCells.innerHTML = strHTML
    console.log('gBoard:', gBoard)
}
function checkGameOver() {
    // var size = gLevel.SIZE * gLevel.SIZE
    // var mine = gLevel.MINES
    console.log('gGame:', gGame)
    if (gGame.shownCount === 14 && gGame.markedCount === 2) {
        var elModal = document.querySelector('.modal')
        elModal.classList.remove('hiden')
        return
    }
}
function CellMarked(event, elcell, i, j) {
    event.preventDefault();
    var currCell = gBoard[elcell.dataset.i][elcell.dataset.j]
    if(currCell.isShown||currCell.isMarked)return
    gMarkedCount++
    gGame.markedCount = gMarkedCount
    var currCell = gBoard[elcell.dataset.i][elcell.dataset.j]
    currCell.isMarked = true
    elcell.innerText = '🚩'
    checkGameOver()
}

function onCellClicked(elCell, i, j) {
    var currCell = gBoard[elCell.dataset.i][elCell.dataset.j]
    if(currCell.isShown||currCell.isMarked)return
    gShownCount++
    gGame.shownCount = gShownCount
    checkGameOver()
    currCell.isShown = true
    if (currCell.isMine) {
        elCell.classList.add('mine')
        elCell.innerText = '💥'
        return
    }
    i = +elCell.dataset.i
    j = +elCell.dataset.j
    const cell = gBoard[i][j]
    var negsCount = setMinesNegsCount(gBoard, i, j)
    // elCell.classList.add('cellRevile')
    elCell.innerText = negsCount
    // setTimeout(() => { elCell.classList.remove('cellRevile') }, 2000)
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
                currCell.minesAroundCount++
            }
        }
    }
    return count
}