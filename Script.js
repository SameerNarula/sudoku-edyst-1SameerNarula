const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298",
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3---",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895",
];
const hard = [
  "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841",
];
let selectedCell;
let difficulty = easy[0];
let answer = [""];
let diffNum = 1;

window.onload = function () {
  startGame();
};

function changeDifficulty(n) {
  switch (n) {
    case 1:
      difficulty = easy[0];
      break;
    case 2:
      difficulty = medium[0];
      break;
    case 3:
      difficulty = hard[0];
      break;
    default:
      difficulty = easy[0];
  }
  diffNum = n;
  startGame();
}

function updateMove() {
  if (selectedCell) {
    document.addEventListener(
      "keydown",
      (event) => {
        let name = event.key;
        if (name > 0 && name < 10 && cani(name)) {
          selectedCell.textContent = name;
          addToArray(name);
          addToCache();
        } else if (name == 0) {
          selectedCell.textContent = null;
          removeFromArray();
        }
      },
      false
    );
  }
  highSelect();
}

function startGame() {
  fillAns(difficulty);
  createBoard(difficulty);
  if (sessionStorage.getItem("cache")) {
    let saved = sessionStorage.getItem("cache").split(",");
    answer = saved;
    for (let i = 0; i < 81; i++) {
      if (saved[i] !== "-" && saved[i] !== difficulty[i]) {
        qA(".cell")[i].classList.add("modified");
        id(i).textContent = saved[i];
      }
    }
  }
}

function highSelect() {
  for (let i = 0; i < 81; i++) {
    qA(".cell")[i].classList.remove("highlighted");
    qA(".cell")[i].classList.remove("dup");
  }
  let col = parseInt(selectedCell.id % 9);
  let row = parseInt(selectedCell.id / 9);
  let s = selectedCell.id;

  for (let i = 0; i < 81; i++) {
    if (parseInt(selectedCell.textContent) == answer[i]) {
      id(i).classList.add("dup");
    }
  }

  for (let i = col; i < col + 73; i += 9) {
    if (i !== s) id(i).classList.add("highlighted");
  }

  for (let i = row * 9; i < row * 9 + 9; i++) {
    if (i !== s) id(i).classList.add("highlighted");
  }

  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      let idx = i * 9 + j;
      if (idx !== s) id(idx).classList.add("highlighted");
    }
  }
}

function createBoard(board) {
  clearPrevious();
  let idCell = 0;
  for (let i = 0; i < 81; i++) {
    let cell = document.createElement("p");
    if (board.charAt(i) !== "-") {
      cell.textContent = board.charAt(i);
      cell.classList.add("prefilled");
    } else {
      cell.addEventListener("click", function () {
        if (cell.classList.contains("selected")) {
          cell.classList.remove("selected");
          selectedCell = null;
        } else {
          for (let i = 0; i < 81; i++) {
            qA(".cell")[i].classList.remove("selected");
          }
        }
        cell.classList.add("selected");
        selectedCell = cell;
        updateMove();
      });
    }
    cell.id = idCell;
    idCell++;
    cell.classList.add("cell");

    // Apply borders
    if ((cell.id + 1) % 9 === 0) cell.classList.add("rightBorder");
    if ((cell.id + 1) % 9 === 3 || (cell.id + 1) % 9 === 6) cell.classList.add("rightBorder");
    if ((cell.id) % 9 === 0) cell.classList.add("leftBorder");

    if (cell.id > 71) cell.classList.add("bottomBorder");
    if (cell.id < 9) cell.classList.add("topBorder");

    id("board").appendChild(cell);
  }
}

function clearPrevious() {
  let cells = qA(".cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].remove();
  }
}

function fillAns(str) {
  answer = str.split('');
}

function addToCache() {
  sessionStorage.setItem("cache", answer.join(","));
  sessionStorage.setItem("diff", diffNum);
}

function addToArray(num) {
  let index = q(".selected").id;
  answer.splice(index, 1, num);
  q(".selected").classList.add("modified");
  duplicate(num);
}

function removeFromArray() {
  let index = q(".selected").id;
  answer.splice(index, 1, "-");
  q(".selected").classList.remove("modified");
}

function duplicate(num) {
  for (let i = 0; i < 81; i++) {
    if (num == answer[i]) id(i).classList.add("dup");
  }
}

function validate() {
  let status = 1;

  // Check rows, columns, and 3x3 blocks for duplicates
  for (let i = 0; i < 9; i++) {
    let row = [];
    let col = [];
    for (let j = 0; j < 9; j++) {
      if (answer[i * 9 + j] !== "-" && row.includes(answer[i * 9 + j])) {
        status = 0;
        break;
      } else {
        row.push(answer[i * 9 + j]);
      }
      
      if (answer[j * 9 + i] !== "-" && col.includes(answer[j * 9 + i])) {
        status = 0;
        break;
      } else {
        col.push(answer[j * 9 + i]);
      }
    }
    if (status === 0) break;
  }

  for (let block = 0; block < 9; block++) {
    let blockCells = [];
    let startRow = Math.floor(block / 3) * 3;
    let startCol = (block % 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let cellValue = answer[(startRow + i) * 9 + (startCol + j)];
        if (cellValue !== "-" && blockCells.includes(cellValue)) {
          status = 0;
          break;
        } else {
          blockCells.push(cellValue);
        }
      }
      if (status === 0) break;
    }
    if (status === 0) break;
  }

  if (status === 1) {
    endGame();
  } else {
    alert("Something is not right, Try again.");
  }
}

function endGame() {
  sessionStorage.clear();
  for (let i = 0; i < 81; i++) {
    id(i).classList.add("prefilled");
  }
  alert("You Win!, GGWP!");
}

function cani(num) {
  let pass = 1;
  let col = parseInt(selectedCell.id % 9);
  let row = parseInt(selectedCell.id / 9);

  // Check row, column, and 3x3 block
  for (let i = 0; i < 9; i++) {
    if (answer[row * 9 + i] === num || answer[i * 9 + col] === num) {
      pass = 0;
      break;
    }
  }

  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (answer[i * 9 + j] === num) {
        pass = 0;
        break;
      }
    }
  }
  return pass;
}

function id(id) {
  return document.getElementById(id);
}

function q(selector) {
  return document.querySelector(selector);
}

function qA(selector) {
  return document.querySelectorAll(selector);
}
