const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Dados das cartas
let cards = [];

// Função para calcular atributos derivados
function calculateDerivedAttributes(card) {
  card.density = card.population / card.area;
  card.gdpPerCapita = card.gdp / card.population;
  card.superPower = card.population + card.area + card.gdp + card.tourism + (1 / card.density) + card.gdpPerCapita;
}

// Função para cadastrar uma carta
function registerCard(cardNumber, callback) {
  console.log(`\n=== CADASTRO DA CARTA ${cardNumber} ===`);
  
  let card = {
    code: '',
    population: 0,
    area: 0,
    gdp: 0,
    tourism: 0
  };

  readline.question('Código da carta (ex: A01): ', (code) => {
    card.code = code;
    readline.question('População: ', (population) => {
      card.population = Math.abs(parseInt(population));
      readline.question('Área (km²): ', (area) => {
        card.area = parseFloat(area);
        readline.question('PIB (US$): ', (gdp) => {
          card.gdp = parseFloat(gdp);
          readline.question('Pontos Turísticos: ', (tourism) => {
            card.tourism = parseInt(tourism);
            
            // Calcular atributos derivados
            calculateDerivedAttributes(card);
            
            cards.push(card);
            console.log(`\nCarta ${cardNumber} cadastrada com sucesso!`);
            callback();
          });
        });
      });
    });
  });
}

// Função para exibir uma carta
function displayCard(card, index) {
  console.log(`\n=== CARTA ${index + 1} (${card.code}) ===`);
  console.log(`- População: ${card.population}`);
  console.log(`- Área: ${card.area} km²`);
  console.log(`- PIB: US$ ${card.gdp}`);
  console.log(`- Pontos Turísticos: ${card.tourism}`);
  console.log(`- Densidade Populacional: ${card.density.toFixed(2)} hab/km²`);
  console.log(`- PIB per capita: US$ ${card.gdpPerCapita.toFixed(2)}`);
  console.log(`- Super Poder: ${card.superPower.toFixed(2)}`);
}

// Função para comparar as cartas
function compareCards() {
  console.log('\n=== COMPARAÇÃO DE CARTAS ===');
  
  const card1 = cards[0];
  const card2 = cards[1];
  
  // Função auxiliar para comparar um atributo
  function compareAttribute(attrName, higherWins = true) {
    let result;
    if (higherWins) {
      result = card1[attrName] > card2[attrName] ? 1 : 
               (card1[attrName] < card2[attrName] ? 2 : 0);
    } else {
      // Para densidade, menor valor vence
      result = card1[attrName] < card2[attrName] ? 1 : 
               (card1[attrName] > card2[attrName] ? 2 : 0);
    }
    
    console.log(`\n${attrName}:`);
    console.log(`- Carta 1: ${card1[attrName].toFixed(2)}`);
    console.log(`- Carta 2: ${card2[attrName].toFixed(2)}`);
    
    if (result === 1) {
      console.log(`>> Carta 1 vence!`);
    } else if (result === 2) {
      console.log(`>> Carta 2 vence!`);
    } else {
      console.log(`>> Empate!`);
    }
    
    return result;
  }
  
  // Comparar todos os atributos
  compareAttribute('population');       // Maior vence
  compareAttribute('area');             // Maior vence
  compareAttribute('gdp');              // Maior vence
  compareAttribute('tourism');          // Maior vence
  compareAttribute('density', false);   // Menor vence
  compareAttribute('gdpPerCapita');     // Maior vence
  compareAttribute('superPower');       // Maior vence
  
  mainMenu();
}

// Menu principal
function mainMenu() {
  console.log('\n=== MENU PRINCIPAL ===');
  console.log('1. Cadastrar cartas');
  console.log('2. Exibir cartas cadastradas');
  console.log('3. Comparar cartas');
  console.log('4. Sair');
  
  readline.question('\nEscolha uma opção: ', (choice) => {
    switch(choice) {
      case '1':
        cards = [];
        registerCard(1, () => {
          registerCard(2, mainMenu);
        });
        break;
      case '2':
        if (cards.length === 0) {
          console.log('\nNenhuma carta cadastrada ainda!');
          mainMenu();
        } else {
          cards.forEach(displayCard);
          mainMenu();
        }
        break;
      case '3':
        if (cards.length < 2) {
          console.log('\nCadastre 2 cartas primeiro!');
          mainMenu();
        } else {
          compareCards();
        }
        break;
      case '4':
        console.log('\nObrigado por jogar Super Trunfo - Países!');
        readline.close();
        break;
      default:
        console.log('\nOpção inválida!');
        mainMenu();
    }
  });
}

// Iniciar o jogo
console.log('=== SUPER TRUNFO - PAÍSES (NÍVEL MESTRE) ===');
mainMenu();