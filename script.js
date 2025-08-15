let listaPaises = [];
let paisAlvo = null;
let tentativas = 0;
const maxTentativas = 6;

async function carregarPaises() {
    try {
        const resposta = await fetch('https://restcountries.com/v3.1/all?fields=name,region,latlng,population');
        const dados = await resposta.json();

        dados.sort((a, b) => a.name.common.localeCompare(b.name.common));
        listaPaises = dados;

        const datalist = document.getElementById('lista-paises');
        dados.forEach(pais => {
            const option = document.createElement('option');
            option.value = pais.name.common;
            datalist.appendChild(option);
        });

        console.log("Países carregados com sucesso!");
    } catch (erro) {
        console.error("Erro ao carregar países:", erro);
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.textContent = "Não foi possível carregar a lista de países. Tente recarregar a página.";
    }

    const indiceAleatorio = Math.floor(Math.random() * listaPaises.length);
    paisAlvo = listaPaises[indiceAleatorio];
    console.log("País alvo:", paisAlvo.name.common);
}

window.onload = carregarPaises;

document.getElementById('adivinhar').addEventListener('click', () => {
    console.log("Botão clicado!");
    const nomeDigitado = document.getElementById('input-pais').value.trim();
    const paisInformado = listaPaises.find(p => p.name.common.toLowerCase() === nomeDigitado.toLowerCase());

    const mensagemDiv = document.getElementById('mensagem');

    if (!paisInformado) {
        mensagemDiv.innerHTML += `<p class="erro">País não encontrado: "${nomeDigitado}"</p>`;
        return;
    }

    tentativas++;

    // hemisfério
    const hemisferioInformado = paisInformado.latlng[0] >= 0 ? "Norte" : "Sul";
    const hemisferioAlvo = paisAlvo.latlng[0] >= 0 ? "Norte" : "Sul";
    const hemisferioCorreto = hemisferioInformado === hemisferioAlvo;

    // continente
    const continenteCorreto = paisInformado.region === paisAlvo.region;

    // população
    const popInf = paisInformado.population;
    const popAlvo = paisAlvo.population;
    const diff = Math.abs(popInf - popAlvo);
    const perc = (diff / popAlvo) * 100;
    let corPop = "pop50";
    if (perc <= 20) corPop = "pop20";
    else if (perc <= 40) corPop = "pop40";
    const setaPop = popInf > popAlvo ? "⬇️" : "⬆️";

    // direção
    const latDiff = paisAlvo.latlng[0] - paisInformado.latlng[0];
    const lngDiff = paisAlvo.latlng[1] - paisInformado.latlng[1];
    let direcao = "";
    direcao += latDiff > 0 ? "Norte " : "Sul ";
    direcao += lngDiff > 0 ? "Leste" : "Oeste";

    // resultado
    mensagemDiv.innerHTML += `
        <div class="resultado">
            <p><strong>País:</strong> ${paisInformado.name.common}</p>
            <p class="${hemisferioCorreto ? 'correto' : 'incorreto'}"><strong>Hemisfério:</strong> ${hemisferioInformado}</p>
            <p class="${continenteCorreto ? 'correto' : 'incorreto'}"><strong>Continente:</strong> ${paisInformado.region}</p>
            <p class="${corPop}"><strong>População:</strong> ${popInf.toLocaleString()} ${setaPop}</p>
            <p><strong>Direção:</strong> ${direcao}</p>
        </div>
    `;

    // verificação final
    if (paisInformado.name.common === paisAlvo.name.common) {
        document.getElementById("mensagem-fim").innerHTML = `<h3 class="acertou">Você acertou o país!</h3>`;
        document.getElementById('adivinhar').disabled = true;
    } else if (tentativas >= maxTentativas) {
        document.getElementById("mensagem-fim").innerHTML = `<h3 class="errou">Fim de jogo! O país era: ${paisAlvo.name.common}</h3>`;
        document.getElementById('adivinhar').disabled = true;
    }
    document.getElementById('input-pais').value = "";
});
