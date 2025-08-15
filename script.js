let listaPaises = [];

async function carregarPaises() {
    try {
        const resposta = await fetch('https://restcountries.com/v3.1/all');
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
}

window.onload = carregarPaises;