'use strict'

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function disableRightClick() {
    window.addEventListener("contextmenu", e => e.preventDefault());
}
function shuffleArray(array) {
    array.sort((a, b) => 0.5 - Math.random());
}
function playSound(txt) {
	const sound = new Audio(txt)
	sound.play()
}
