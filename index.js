// Variáveis globais úteis
const boardRegions = document.querySelectorAll('#gameBoard span')
let vBoard = []
let turnPlayer = ''

// Carregar sons
const clickSoundX = new Audio('click.mp3');
const clickSoundO = new Audio('click.mp3');
const winSound = new Audio('win.wav');
const drawSound = new Audio('draw.wav');

// Função para tocar som
function playSound(sound) {
  sound.play();
}

// Atualiza o título indicando o jogador da vez
function updateTitle() {
  const playerInput = document.getElementById(turnPlayer)
  document.getElementById('turnPlayer').innerText = playerInput.value
}

// Inicializa o jogo
function initializeGame() {
  // Inicializa as variáveis globais 
  vBoard = [['', '', ''], ['', '', ''], ['', '', '']]
  turnPlayer = 'player1'
  // Ajusta o título da página (caso seja necessário)
  document.querySelector('h2').innerHTML = 'Vez de: <span id="turnPlayer"></span>'
  updateTitle()
  // Limpa o tabuleiro (caso seja necessário) e adiciona os eventos de clique
  boardRegions.forEach(function (element) {
    element.classList.remove('win')
    element.innerText = ''
    element.classList.add('cursor-pointer')
    element.addEventListener('click', handleBoardClick)
  })
}

// Verifica se existe uma combinação de vitória
function getWinRegions() {
  const winRegions = []
  if (vBoard[0][0] && vBoard[0][0] === vBoard[0][1] && vBoard[0][0] === vBoard[0][2])
    winRegions.push("0.0", "0.1", "0.2")
  if (vBoard[1][0] && vBoard[1][0] === vBoard[1][1] && vBoard[1][0] === vBoard[1][2])
    winRegions.push("1.0", "1.1", "1.2")
  if (vBoard[2][0] && vBoard[2][0] === vBoard[2][1] && vBoard[2][0] === vBoard[2][2])
    winRegions.push("2.0", "2.1", "2.2")
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][0] && vBoard[0][0] === vBoard[2][0])
    winRegions.push("0.0", "1.0", "2.0")
  if (vBoard[0][1] && vBoard[0][1] === vBoard[1][1] && vBoard[0][1] === vBoard[2][1])
    winRegions.push("0.1", "1.1", "2.1")
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][2] && vBoard[0][2] === vBoard[2][2])
    winRegions.push("0.2", "1.2", "2.2")
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][1] && vBoard[0][0] === vBoard[2][2])
    winRegions.push("0.0", "1.1", "2.2")
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][1] && vBoard[0][2] === vBoard[2][0])
    winRegions.push("0.2", "1.1", "2.0")
  return winRegions
}

// Desabilita uma região do tabuleiro
function disableRegion(element) {
  element.classList.remove('cursor-pointer')
  element.removeEventListener('click', handleBoardClick)
}

// Lida com o evento de vitória
function handleWin(regions) {
  regions.forEach(function (region) {
    document.querySelector('[data-region="' + region + '"]').classList.add('win')
  })
  const playerName = document.getElementById(turnPlayer).value
  document.querySelector('h2').innerHTML = playerName + ' venceu!'
  playSound(winSound); // Toca o som de vitória
}

// Lida com o evento de clique no tabuleiro
function handleBoardClick(ev) {
  // Obtém a célula clicada
  const span = ev.currentTarget
  const region = span.dataset.region
  const rowColumnPair = region.split('.')
  const row = rowColumnPair[0]
  const column = rowColumnPair[1]
  
  // Marca a célula com o símbolo do jogador
  if (turnPlayer === 'player1') {
    span.innerText = 'X'
    vBoard[row][column] = 'X'
    clickSoundX.play();
} else {
    span.innerText = 'O'
    vBoard[row][column] = 'O'
    clickSoundO.play();
  }
  
  // Desabilita a célula clicada
  disableRegion(span)
  
  // Verifica se alguém venceu
  const winRegions = getWinRegions()
  if (winRegions.length > 0) {
    handleWin(winRegions)
  } else if (vBoard.flat().includes('')) {
    turnPlayer = turnPlayer === 'player1' ? 'player2' : 'player1'
    updateTitle()
  } else {
    document.querySelector('h2').innerHTML = 'Empate!'
    playSound(drawSound); // Toca o som de empate
  }
}

// Adiciona o evento para o botão de iniciar
document.getElementById('start').addEventListener('click', initializeGame)

// Função para alternar entre temas claro e escuro
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
  // Salva a preferência do tema no localStorage
  const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
}

// Verifica o tema salvo no localStorage ao carregar a página
window.onload = function () {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.add('light-theme');
  }
}

document.getElementById('toggleTheme').addEventListener('click', toggleTheme);
