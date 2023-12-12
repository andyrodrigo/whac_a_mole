const estado = {
  vista: {
    telaInicial: document.querySelector("#tela-inicio"),
    predio: document.querySelector("#predio"),
    janelas: document.querySelectorAll(".janela"),
    tempoRestante: document.querySelector("#tempoRestante"),
    pontos: document.querySelector("#pontos"),
    vidas: document.querySelector("#vidas"),
    telaFinal: document.querySelector("#tela-fim"),
    recorde: document.querySelector("#recorde"),
    pontuacao: document.querySelector("#pontuacao"),
  },
  valores: {
    inimigos: [],
    numInimigos: 1,
    tempoAtual: 60,
    pontosAtuais: 0,
    vidasAtuais: 5,
    pontosRecorde: 0,
  },
  acoes: {
    iniciado: false,
    gerarInimigos: "", //setInterval(selecionarAleatoria, 2100),
    tempo: "", //setInterval(temporizador, 1000),
  },
};

function temporizador() {
  estado.valores.tempoAtual--;
  estado.vista.tempoRestante.textContent = estado.valores.tempoAtual;

  if (estado.valores.tempoAtual === 0) {
    encerrarJogo();
  }
}

function encerrarJogo() {
  estado.acoes.iniciado = false;
  clearInterval(estado.acoes.tempo);
  clearInterval(estado.acoes.gerarInimigos);
  estado.vista.telaFinal.style.display = "block";
  estado.vista.pontuacao.innerHTML = estado.valores.pontosAtuais;
  gravarRecorde();
}

function gravarRecorde() {
  if (estado.valores.pontosAtuais > estado.valores.pontosRecorde) {
    estado.valores.pontosRecorde = estado.valores.pontosAtuais;
    localStorage.setItem(
      "recordeGravado",
      JSON.stringify(estado.valores.pontosRecorde)
    );
  }
  estado.vista.recorde.textContent = estado.valores.pontosRecorde;
}

function reproduzirSom(som) {
  console.log(som);
  const audio = new Audio(`./src/audio/${som}.wav`);
  try {
    audio.play();
  } catch {}
}

function piscarTela() {
  document.body.style.backgroundColor = "red";
  setTimeout(() => {
    document.body.style.backgroundColor = "";
  }, 250);
}

function selecionarAleatoria() {
  for (let i = 0; i < estado.valores.numInimigos; i++) {
    if (estado.valores.inimigos.length < 9) {
      let numeroAleatorio;

      do {
        numeroAleatorio = Math.floor(Math.random() * 12);
      } while (estado.valores.inimigos.includes(numeroAleatorio));

      let janelaAleatoria = estado.vista.janelas[numeroAleatorio];
      janelaAleatoria.classList.add("inimigo");
      estado.valores.inimigos.push(numeroAleatorio);
      //console.log(estado.valores.inimigos);
      setTimeout(() => temporizarTiroInimigo(numeroAleatorio), 2000);
    }
  }
}

function temporizarTiroInimigo(id) {
  if (estado.valores.inimigos.includes(id)) {
    //console.log("levou tiro de " + id);
    reproduzirSom("erro");
    piscarTela();
    const vida = (estado.valores.vidasAtuais -= 1);
    estado.vista.vidas.textContent = vida;
    if (vida <= 8) {
      encerrarJogo();
    } else {
      const janela = estado.vista.janelas[id];
      retirarInimigo(janela);
    }
  }
}

function retirarInimigo(janela) {
  janela.classList.remove("inimigo");
  const id = Number(janela.id);
  const indice = estado.valores.inimigos.indexOf(id);
  if (indice !== -1) {
    estado.valores.inimigos.splice(indice, 1);
  }
  //console.log(estado.valores.inimigos);
}

function aumentarInimigos() {
  if (estado.valores.pontosAtuais === 100) {
    estado.valores.numInimigos++;
  } else if (estado.valores.pontosAtuais === 200) {
    estado.valores.numInimigos++;
  }
}

function atirarNaJanela() {
  estado.vista.janelas.forEach((janela) => {
    janela.addEventListener("mousedown", () => {
      if (janela.classList.contains("inimigo") && estado.acoes.iniciado) {
        //console.log("acertou");
        reproduzirSom("acerto");
        retirarInimigo(janela);
        estado.valores.pontosAtuais += 10;
        estado.vista.pontos.textContent = estado.valores.pontosAtuais;
        aumentarInimigos();
      } else {
        //console.log("errou");
      }
    });
  });
}

function limparInimigos() {
  estado.vista.janelas.forEach((janela) => {
    if (janela.classList.contains("inimigo")) {
      janela.classList.remove("inimigo");
    }
  });
  estado.valores.inimigos = [];
  estado.valores.numInimigos = 1;
}

function iniciar() {
  estado.vista.telaInicial.style.display = "none";
  estado.vista.predio.style.display = "block";
  estado.acoes.iniciado = true;

  (estado.acoes.gerarInimigos = setInterval(selecionarAleatoria, 2100)),
    (estado.acoes.tempo = setInterval(temporizador, 1000)),
    atirarNaJanela();
}

function reiniciar() {
  limparInimigos();
  estado.valores.pontosAtuais = 0;
  estado.valores.vidasAtuais = 5;
  estado.valores.tempoAtual = 60;

  estado.vista.pontos.textContent = estado.valores.pontosAtuais;
  estado.vista.vidas.textContent = estado.valores.vidasAtuais;
  estado.vista.tempoRestante.textContent = estado.valores.tempoAtual;

  estado.acoes.iniciado = true;

  estado.vista.telaFinal.style.display = "none";
  (estado.acoes.gerarInimigos = setInterval(selecionarAleatoria, 2100)),
    (estado.acoes.tempo = setInterval(temporizador, 1000)),
    atirarNaJanela();
}

function buscarRecorde() {
  const recorde = localStorage.getItem("recordeGravado");
  if (recorde) {
    estado.valores.pontosRecorde = recorde;
    estado.vista.recorde.textContent = recorde;
  }
}

buscarRecorde();
