const readline = require('readline-sync'); // Remova esta linha se for executar no navegador

class BatalhaNaval {
    constructor() {
        this.tamanho = 10;
        this.naviosJogador = [];
        this.naviosOponente = [];
        this.tabuleiroJogador = this.criarTabuleiro();
        this.tabuleiroOponente = this.criarTabuleiro();
        this.turnoJogador = true;
        this.habilidadesRestantes = 3;
        this.habilidadeAtiva = null;
        this.jogoAtivo = true;
        this.inicializarJogo();
    }

    criarTabuleiro() {
        return Array(this.tamanho).fill().map(() => Array(this.tamanho).fill(0));
    }

    inicializarJogo() {
        console.clear();
        console.log("=== BATALHA NAVAL COM HABILIDADES ESPECIAIS ===");
        this.posicionarNavios(this.naviosJogador, "Jogador");
        this.posicionarNavios(this.naviosOponente, "Oponente");
        this.jogar();
    }

    posicionarNavios(navios, dono) {
        const tamanhos = [5, 4, 3, 3, 2]; // Porta-aviões, Couraçado, Cruzador, Submarino, Destroyer
        
        tamanhos.forEach(tamanho => {
            let posicionado = false;
            
            while (!posicionado) {
                const horizontal = Math.random() > 0.5;
                const x = Math.floor(Math.random() * (this.tamanho - (horizontal ? tamanho : 0)));
                const y = Math.floor(Math.random() * (this.tamanho - (horizontal ? 0 : tamanho)));
                
                // Verifica se a posição é válida
                let posicaoValida = true;
                for (let i = 0; i < tamanho; i++) {
                    const nx = horizontal ? x + i : x;
                    const ny = horizontal ? y : y + i;
                    
                    // Verifica colisão com outros navios
                    if (navios.some(navio => 
                        navio.horizontal ?
                        (ny === navio.y && nx >= navio.x && nx < navio.x + navio.tamanho) :
                        (nx === navio.x && ny >= navio.y && ny < navio.y + navio.tamanho)
                    )) {
                        posicaoValida = false;
                        break;
                    }
                }
                
                if (posicaoValida) {
                    navios.push({ x, y, tamanho, horizontal, atingido: Array(tamanho).fill(false) });
                    posicionado = true;
                }
            }
        });
    }

    mostrarTabuleiro() {
        console.log("\n=== TABULEIRO ===");
        console.log("Legenda: . = Água, X = Atingido, O = Navio, * = Habilidade");
        
        // Cabeçalho com coordenadas
        let cabecalho = "  ";
        for (let x = 0; x < this.tamanho; x++) {
            cabecalho += x + " ";
        }
        console.log(cabecalho);
        
        // Tabuleiro do oponente (visão do jogador)
        for (let y = 0; y < this.tamanho; y++) {
            let linha = y + " ";
            for (let x = 0; x < this.tamanho; x++) {
                const navio = this.naviosOponente.find(n => 
                    n.horizontal ?
                    (y === n.y && x >= n.x && x < n.x + n.tamanho) :
                    (x === n.x && y >= n.y && y < n.y + n.tamanho)
                );
                
                if (this.tabuleiroOponente[y][x] === 1) {
                    if (navio) {
                        const index = navio.horizontal ? x - navio.x : y - navio.y;
                        linha += navio.atingido[index] ? "X " : "O ";
                    } else {
                        linha += ". ";
                    }
                } else {
                    linha += "~ ";
                }
            }
            console.log(linha);
        }
    }

    usarHabilidade(tipo, x, y) {
        const padroes = {
            cone: [
                [0, 0, 1, 0, 0],
                [0, 1, 1, 1, 0],
                [1, 1, 1, 1, 1]
            ],
            cruz: [
                [0, 0, 1, 0, 0],
                [1, 1, 1, 1, 1],
                [0, 0, 1, 0, 0]
            ],
            octaedro: [
                [0, 0, 1, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 1, 0, 0]
            ]
        };
        
        const padrao = padroes[tipo];
        if (!padrao) return false;
        
        const centroX = Math.floor(padrao[0].length / 2);
        const centroY = Math.floor(padrao.length / 2);
        let acertos = 0;
        
        for (let py = 0; py < padrao.length; py++) {
            for (let px = 0; px < padrao[py].length; px++) {
                if (padrao[py][px] === 1) {
                    const nx = x + (px - centroX);
                    const ny = y + (py - centroY);
                    
                    if (nx >= 0 && nx < this.tamanho && ny >= 0 && ny < this.tamanho) {
                        if (this.tabuleiroOponente[ny][nx] === 1) continue; // já atacado
                        this.tabuleiroOponente[ny][nx] = 1;
                        
                        const navio = this.naviosOponente.find(n => 
                            n.horizontal ?
                            (ny === n.y && nx >= n.x && nx < n.x + n.tamanho) :
                            (nx === n.x && ny >= n.y && ny < n.y + n.tamanho)
                        );
                        
                        if (navio) {
                            const index = navio.horizontal ? nx - navio.x : ny - navio.y;
                            navio.atingido[index] = true;
                            acertos++;
                        }
                    }
                }
            }
        }
        
        this.habilidadesRestantes--;
        console.log(`\nHabilidade ${tipo} usada em (${x}, ${y}). ${acertos} acertos!`);
        return true;
    }

    verificarVitoria() {
        const todosNaviosOponenteAfundados = this.naviosOponente.every(navio => 
            navio.atingido.every(atingido => atingido)
        );
        
        const todosNaviosJogadorAfundados = this.naviosJogador.every(navio => 
            navio.atingido.every(atingido => atingido)
        );
        
        if (todosNaviosOponenteAfundados) {
            console.log("\nPARABÉNS! Você afundou todos os navios inimigos!");
            this.jogoAtivo = false;
            return true;
        }
        
        if (todosNaviosJogadorAfundados) {
            console.log("\nVocê perdeu! Todos os seus navios foram afundados!");
            this.jogoAtivo = false;
            return true;
        }
        
        return false;
    }

    jogar() {
        while (this.jogoAtivo) {
            this.mostrarTabuleiro();
            
            if (this.turnoJogador) {
                console.log(`\nSeu turno! Habilidades restantes: ${this.habilidadesRestantes}`);
                
                if (this.habilidadesRestantes > 0) {
                    const usarHabilidade = readline.question("Deseja usar uma habilidade especial? (s/n): ").toLowerCase() === 's';
                    
                    if (usarHabilidade) {
                        console.log("\nHabilidades disponíveis:");
                        console.log("1. Cone (Triângulo)");
                        console.log("2. Cruz");
                        console.log("3. Octaedro (Diamante)");
                        
                        const escolha = parseInt(readline.question("Escolha a habilidade (1-3): "));
                        let tipo;
                        
                        switch (escolha) {
                            case 1: tipo = "cone"; break;
                            case 2: tipo = "cruz"; break;
                            case 3: tipo = "octaedro"; break;
                            default:
                                console.log("Opção inválida. Voltando ao jogo normal.");
                                continue;
                        }
                        
                        const x = parseInt(readline.question(`Digite a coordenada X para ${tipo} (0-9): `));
                        const y = parseInt(readline.question(`Digite a coordenada Y para ${tipo} (0-9): `));
                        
                        if (x >= 0 && x < this.tamanho && y >= 0 && y < this.tamanho) {
                            this.usarHabilidade(tipo, x, y);
                            this.turnoJogador = false;
                        } else {
                            console.log("Coordenadas inválidas!");
                        }
                        continue;
                    }
                }
                
                // Ataque normal
                const x = parseInt(readline.question("Digite a coordenada X para atacar (0-9): "));
                const y = parseInt(readline.question("Digite a coordenada Y para atacar (0-9): "));

                if (
                    Number.isNaN(x) || Number.isNaN(y) ||
                    x < 0 || x >= this.tamanho ||
                    y < 0 || y >= this.tamanho
                ) {
                    console.log("Coordenadas inválidas!");
                    continue;
                }
                
                if (this.tabuleiroOponente[y][x] === 1) {
                    console.log("Você já atacou esta posição antes!");
                    continue;
                }
                
                this.tabuleiroOponente[y][x] = 1;
                
                const navio = this.naviosOponente.find(n => 
                    n.horizontal ?
                    (y === n.y && x >= n.x && x < n.x + n.tamanho) :
                    (x === n.x && y >= n.y && y < n.y + n.tamanho)
                );
                
                if (navio) {
                    const index = navio.horizontal ? x - navio.x : y - navio.y;
                    navio.atingido[index] = true;
                    console.log("\nACERTOU!");
                    
                    // Verifica se afundou o navio
                    if (navio.atingido.every(atingido => atingido)) {
                        console.log(`Você afundou um navio de tamanho ${navio.tamanho}!`);
                    }
                } else {
                    console.log("\nÁGUA...");
                }
                
                this.turnoJogador = false;
            } else {
                // Turno do oponente (IA simples)
                console.log("\nTurno do oponente...");

                let posicoesLivres = [];
                for (let i = 0; i < this.tamanho; i++) {
                    for (let j = 0; j < this.tamanho; j++) {
                        if (this.tabuleiroJogador[j][i] !== 1) {
                            posicoesLivres.push([i, j]);
                        }
                    }
                }

                if (posicoesLivres.length > 0) {
                    const [x, y] = posicoesLivres[Math.floor(Math.random() * posicoesLivres.length)];
                    this.tabuleiroJogador[y][x] = 1;

                    const navio = this.naviosJogador.find(n =>
                        n.horizontal ?
                        (y === n.y && x >= n.x && x < n.x + n.tamanho) :
                        (x === n.x && y >= n.y && y < n.y + n.tamanho)
                    );

                    if (navio) {
                        const index = navio.horizontal ? x - navio.x : y - navio.y;
                        navio.atingido[index] = true;
                        console.log(`O oponente atacou (${x}, ${y}) e ACERTOU!`);

                        if (navio.atingido.every(atingido => atingido)) {
                            console.log(`Seu navio de tamanho ${navio.tamanho} foi afundado!`);
                        }
                    } else {
                        console.log(`O oponente atacou (${x}, ${y}) e ERROU.`);
                    }
                    this.turnoJogador = true;
                }
            }
            
            if (this.verificarVitoria()) break;
        }
    }
}

// Iniciar o jogo
const jogo = new BatalhaNaval();