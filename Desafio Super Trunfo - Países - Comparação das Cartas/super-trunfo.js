const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Dados das cartas
let cards = [];
let currentLevel = 1;

// Atributos disponíveis
const attributes = {
  population: 'População',
  area: 'Área (km²)',
  gdp: 'PIB (US$)',
  tourism: 'Pontos Turísticos',
  density: 'Densidade Populacional'
};

// Função para calcular densidade populacional
function calculateDensity(card) {
  return card.population / card.area;
}

// Cadastro de cartas
function registerCards(callback) {
  console.log('\n=== CADASTRO DE CARTAS ===');
  
  function registerCard(cardNumber) {
    if (cardNumber > 2) {
      callback();
      return;
    }

    console.log(`\nCadastro da Carta ${cardNumber}:`);
    let card = {};

    readline.question('Estado: ', (state) => {
      card.state = state;
      readline.question('Código da Carta: ', (code) => {
        card.code = code;
        readline.question('Nome da Cidade: ', (city) => {
          card.city = city;
          readline.question('População: ', (population) => {
            card.population = parseFloat(population);
            readline.question('Área (km²): ', (area) => {
              card.area = parseFloat(area);
              readline.question('PIB (US$): ', (gdp) => {
                card.gdp = parseFloat(gdp);
                readline.question('Pontos Turísticos: ', (tourism) => {
                  card.tourism = parseInt(tourism);
                  card.density = calculateDensity(card);
                  
                  cards.push(card);
                  console.log(`\nCarta ${cardNumber} cadastrada com sucesso!`);
                  registerCard(cardNumber + 1);
                });
              });
            });
          });
        });
      });
    });
  }

  registerCard(1);
}

// Exibir cartas
function displayCards() {
  console.log('\n=== CARTAS CADASTRADAS ===');
  cards.forEach((card, index) => {
    console.log(`\nCarta ${index + 1}: ${card.city}, ${card.state}`);
    console.log(`- Código: ${card.code}`);
    console.log(`- População: ${card.population}`);
    console.log(`- Área: ${card.area} km²`);
    console.log(`- PIB: US$ ${card.gdp}`);
    console.log(`- Pontos Turísticos: ${card.tourism}`);
    console.log(`- Densidade Populacional: ${card.density.toFixed(2)} hab/km²`);
  });
}

// Nível Novato - Comparação básica
function noviceLevel() {
  console.log('\n=== NÍVEL NOVATO ===');
  console.log('Comparando por população (maior valor vence)...');
  
  if (cards[0].population > cards[1].population) {
    console.log(`\n${cards[0].city} vence com população de ${cards[0].population}!`);
  } else if (cards[1].population > cards[0].population) {
    console.log(`\n${cards[1].city} vence com população de ${cards[1].population}!`);
  } else {
    console.log('\nEmpate! Ambas as cidades têm a mesma população.');
  }
}

// Nível Aventureiro - Menu de atributos
function adventurerLevel() {
  console.log('\n=== NÍVEL AVENTUREIRO ===');
  console.log('Escolha o atributo para comparação:');
  // Menu dinâmico
  Object.entries(attributes).forEach(([key, label], idx) => {
    console.log(`${idx + 1}. ${label} (${key === 'density' ? 'menor vence' : 'maior vence'})`);
  });

  readline.question('\nOpção: ', (choice) => {
    const keys = Object.keys(attributes);
    const idx = parseInt(choice) - 1;
    if (idx < 0 || idx >= keys.length) {
      console.log('Opção inválida! Voltando ao menu...');
      mainMenu();
      return;
    }
    const attribute = keys[idx];
    const isDensity = attribute === 'density';

    // Uso de operador ternário para decisão
    let winner =
      isDensity
        ? (cards[0][attribute] < cards[1][attribute]
            ? 0
            : cards[1][attribute] < cards[0][attribute]
              ? 1
              : undefined)
        : (cards[0][attribute] > cards[1][attribute]
            ? 0
            : cards[1][attribute] > cards[0][attribute]
              ? 1
              : undefined);

    console.log(`\nAtributo escolhido: ${attributes[attribute]}`);
    if (winner !== undefined) {
      console.log(`${cards[winner].city} vence com ${cards[winner][attribute]}${attribute === 'density' ? ' hab/km²' : ''}!`);
    } else {
      console.log('Empate! Ambas as cidades têm o mesmo valor para este atributo.');
    }

    mainMenu();
  });
}

// Nível Mestre - Comparação avançada
function masterLevel() {
  console.log('\n=== NÍVEL MESTRE ===');
  console.log('Escolha DOIS atributos para comparação:');
  // Menu dinâmico
  Object.entries(attributes).forEach(([key, label], idx) => {
    console.log(`${idx + 1}. ${label} (${key === 'density' ? 'menor vence' : 'maior vence'})`);
  });

  let attributesChosen = [];

  function chooseAttribute(number) {
    if (number > 2) {
      compareAttributes();
      return;
    }

    readline.question(`\nEscolha o ${number}º atributo: `, (choice) => {
      const keys = Object.keys(attributes);
      const idx = parseInt(choice) - 1;
      if (idx < 0 || idx >= keys.length) {
        console.log('Opção inválida!');
        chooseAttribute(number);
        return;
      }
      const attribute = keys[idx];
      attributesChosen.push(attribute);
      chooseAttribute(number + 1);
    });
  }

  function compareAttributes() {
    const attr1 = attributesChosen[0];
    const attr2 = attributesChosen[1];
    const isDensity1 = attr1 === 'density';
    const isDensity2 = attr2 === 'density';

    console.log(`\nComparando por ${attributes[attr1]} e ${attributes[attr2]}...`);

    // Uso de operador ternário para decisão
    let winner1 =
      isDensity1
        ? (cards[0][attr1] < cards[1][attr1]
            ? 0
            : cards[1][attr1] < cards[0][attr1]
              ? 1
              : undefined)
        : (cards[0][attr1] > cards[1][attr1]
            ? 0
            : cards[1][attr1] > cards[0][attr1]
              ? 1
              : undefined);

    let winner2 =
      isDensity2
        ? (cards[0][attr2] < cards[1][attr2]
            ? 0
            : cards[1][attr2] < cards[0][attr2]
              ? 1
              : undefined)
        : (cards[0][attr2] > cards[1][attr2]
            ? 0
            : cards[1][attr2] > cards[0][attr2]
              ? 1
              : undefined);

    // Exibição dos resultados
    if (winner1 === winner2) {
      if (winner1 !== undefined) {
        console.log(`\n${cards[winner1].city} vence em ambos atributos!`);
      } else {
        console.log('\nEmpate geral em ambos atributos!');
      }
    } else {
      let msg1 = winner1 !== undefined ? `- ${cards[winner1].city} vence em ${attributes[attr1]}` : `- Empate em ${attributes[attr1]}`;
      let msg2 = winner2 !== undefined ? `- ${cards[winner2].city} vence em ${attributes[attr2]}` : `- Empate em ${attributes[attr2]}`;
      console.log('\nResultado dividido:');
      console.log(msg1);
      console.log(msg2);
      console.log('\nNenhum vencedor claro - considere um desempate!');
    }

    mainMenu();
  }

  chooseAttribute(1);
}

// Menu principal
function mainMenu() {
  console.log('\n=== MENU PRINCIPAL ===');
  console.log('1. Cadastrar cartas');
  console.log('2. Exibir cartas cadastradas');
  console.log('3. Nível Novato - Comparação simples');
  console.log('4. Nível Aventureiro - Comparação com menu');
  console.log('5. Nível Mestre - Comparação avançada');
  console.log('6. Sair');
  
  readline.question('\nEscolha uma opção: ', (choice) => {
    switch(choice) {
      case '1':
        cards = [];
        registerCards(mainMenu);
        break;
      case '2':
        if (cards.length === 0) {
          console.log('\nNenhuma carta cadastrada ainda!');
          mainMenu();
        } else {
          displayCards();
          mainMenu();
        }
        break;
      case '3':
        if (cards.length < 2) {
          console.log('\nCadastre pelo menos 2 cartas primeiro!');
          mainMenu();
        } else {
          noviceLevel();
          mainMenu();
        }
        break;
      case '4':
        if (cards.length < 2) {
          console.log('\nCadastre pelo menos 2 cartas primeiro!');
          mainMenu();
        } else {
          adventurerLevel();
        }
        break;
      case '5':
        if (cards.length < 2) {
          console.log('\nCadastre pelo menos 2 cartas primeiro!');
          mainMenu();
        } else {
          masterLevel();
        }
        break;
      case '6':
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
console.log('=== SUPER TRUNFO - PAÍSES ===');
console.log('Bem-vindo ao jogo de comparação de cidades!');
mainMenu();