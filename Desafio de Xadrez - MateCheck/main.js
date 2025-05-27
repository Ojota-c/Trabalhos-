const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Tabuleiro de xadrez (8x8)
let board = Array(8).fill().map(() => Array(8).fill('·'));
const pieces = {
  bishop: '♗', rook: '♖', queen: '♕', knight: '♘'
};

// Posições iniciais
let positions = {
  bishop: [0, 2],  // Bispo em c1
  rook: [0, 0],     // Torre em a1
  queen: [0, 3],    // Rainha em d1
  knight: [0, 1]    // Cavalo em b1
};

// Atualiza o tabuleiro
function updateBoard() {
  board = Array(8).fill().map(() => Array(8).fill('·'));
  for (const [piece, [x, y]] of Object.entries(positions)) {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      board[x][y] = pieces[piece];
    }
  }
}

// Mostra o tabuleiro
function printBoard() {
  console.log('\n  a b c d e f g h');
  board.forEach((row, i) => {
    console.log(`${8 - i} ${row.join(' ')} ${8 - i}`);
  });
  console.log('  a b c d e f g h\n');
}

// Movimento recursivo do Bispo (5 casas na diagonal direita para cima) com loops aninhados
function moveBishopRecursive(steps, count = 0) {
  if (count >= steps) return true;
  let [x, y] = positions.bishop;
  let moved = false;
  // Loops aninhados para simular a diagonal
  for (let i = 1; i <= 1; i++) {
    for (let j = 1; j <= 1; j++) {
      let newX = x - i;
      let newY = y + j;
      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        positions.bishop = [newX, newY];
        updateBoard();
        printBoard();
        moved = true;
        break;
      }
    }
    if (moved) break;
  }
  if (moved) return moveBishopRecursive(steps, count + 1);
  return false;
}

// Movimento recursivo da Torre (5 casas para a direita)
function moveRookRecursive(steps, count = 0) {
  if (count >= steps) return true;
  let [x, y] = positions.rook;
  let newX = x;
  let newY = y + 1;
  if (newY >= 0 && newY < 8) {
    positions.rook = [newX, newY];
    updateBoard();
    printBoard();
    return moveRookRecursive(steps, count + 1);
  }
  return false;
}

// Movimento recursivo da Rainha (8 casas para a esquerda)
function moveQueenRecursive(steps, count = 0) {
  if (count >= steps) return true;
  let [x, y] = positions.queen;
  let newX = x;
  let newY = y - 1;
  if (newY >= 0 && newY < 8) {
    positions.queen = [newX, newY];
    updateBoard();
    printBoard();
    return moveQueenRecursive(steps, count + 1);
  }
  return false;
}

// Movimento do Cavalo (1 vez em L para cima à direita) com loops múltiplos e condições
function moveKnightL() {
  let [x, y] = positions.knight;
  let moves = [
    [-2, 1], [-1, 2], [1, 2], [2, 1],
    [2, -1], [1, -2], [-1, -2], [-2, -1]
  ];
  let found = false;
  for (let i = 0; i < moves.length; i++) {
    let [dx, dy] = moves[i];
    let newX = x + dx;
    let newY = y + dy;
    // Condição múltipla
    if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) {
      continue; // Pula movimentos inválidos
    }
    // Só faz o primeiro movimento válido (L para cima-direita: -2, +1)
    if (dx === -2 && dy === 1) {
      positions.knight = [newX, newY];
      updateBoard();
      printBoard();
      found = true;
      break;
    }
  }
  if (!found) {
    console.log('Movimento inválido para o cavalo!');
  }
}

// Menu de peças
function showMenu() {
  console.log(`
  === MATE CHESS - NÍVEL MESTRE (TERMINAL) ===
  1. Bispo (5 casas diagonal superior direita)
  2. Torre (5 casas para a direita)
  3. Rainha (8 casas para a esquerda)
  4. Cavalo (1 movimento em L para cima-direita)
  5. Resetar peças
  6. Sair
  `);

  printBoard(); // Mostra o tabuleiro ANTES do movimento

  readline.question('Escolha uma peça (1-6): ', choice => {
    switch(choice) {
      case '1':
        console.log('\nBispo movendo 5 casas na diagonal superior direita:');
        if (!moveBishopRecursive(5)) {
          console.log('O bispo não pode se mover mais!');
        }
        setTimeout(showMenu, 1000);
        break;
      case '2':
        console.log('\nTorre movendo 5 casas para a direita:');
        if (!moveRookRecursive(5)) {
          console.log('A torre não pode se mover mais!');
        }
        setTimeout(showMenu, 1000);
        break;
      case '3':
        console.log('\nRainha movendo 8 casas para a esquerda:');
        if (!moveQueenRecursive(8)) {
          console.log('A rainha não pode se mover mais!');
        }
        setTimeout(showMenu, 1000);
        break;
      case '4':
        console.log('\nCavalo movendo em L (2 cima, 1 direita):');
        moveKnightL();
        setTimeout(showMenu, 1000);
        break;
      case '5':
        // Resetar posições iniciais
        positions = {
          bishop: [0, 2],
          rook: [0, 0],
          queen: [0, 3],
          knight: [0, 1]
        };
        updateBoard();
        console.log('Peças resetadas para as posições iniciais.');
        setTimeout(showMenu, 1000);
        break;
      case '6':
        readline.close();
        return;
      default:
        console.log('Opção inválida!');
        setTimeout(showMenu, 1000);
    }
  });
}

// Inicia o jogo
updateBoard();
printBoard();
showMenu();