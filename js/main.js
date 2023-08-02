'use strict'


var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gCell = null


function onInit() {
    gBoard = createBoard()
    renderBoard()

}
function createBoard() {
    var nums=[]
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
        var num = getRandomInt(0, board.length+1)
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
                            onclick="onCellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elCells = document.querySelector('.board-cells')
    elCells.innerHTML = strHTML
    console.log('gBoard:', gBoard)
}

function onCellClicked(elCell, i, j) {
    var currCell = gBoard[elCell.dataset.i][elCell.dataset.j]
    if (currCell.isMine) {
        elCell.classList.add('mine')
        elCell.innerText = '💥'
        return
    }
    console.log('elCell:', elCell)
    i = +elCell.dataset.i
    j = +elCell.dataset.j
    console.log('i:', i)
    console.log('j:', j)
    const cell = gBoard[i][j]
    var negsCount = setMinesNegsCount(gBoard, i, j)
    console.log('negsCount:', negsCount)
    elCell.classList.add('cellRevile')
    elCell.innerText = negsCount
    // setTimeout(() => { elCell.innerText = '' }, 2000)
     setTimeout(() => { elCell.classList.remove('cellRevile') }, 2000)
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