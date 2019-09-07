function filterPessoas(pessoa) {
    return pessoa.checked;
}

function ordemCrescente(a, b) {
    return a > b ? 1 : -1;
}

var app = new Vue({
    data: {
        itens: [
            {id:1, nome:"JOGOS", valor:12.0, quempagou: 1, quemusou: [1,2,3,4,5]},
            {id:2, nome:"COCA-COLA", valor:12.0, quempagou: 5, quemusou: [1,2,3,4,5]},
            {id:3, nome:"CACHORRO-QUENTE", valor:12.0, quempagou: 3, quemusou: [1,2,3,4,5]},
			{id:4, nome:"CERVEJA", valor:50.0, quempagou: 2, quemusou: [1,2,4]}
        ],
        pessoas: [
            {id:1, nome:"PAULO", checked: false },
            {id:2, nome:"FABIO", checked: false},
            {id:3, nome:"CRISTOPHER", checked: false},
            {id:4, nome:"CRISTIANO", checked: false},
            {id:5, nome:"ALAN", checked: false},
        ],
        indexPessoa: 1,
        inputPessoaNome: "",
        indexItem: 1,
        inputItem: {
            id: 0,
            nome: "",
            valor: "",
            quempagou: 0,
            quemusou: []
        },
        dividas: []
    },
    computed: {
        dividasNorm: function () {
            let app = this;
            let retDiv = [];

            this.dividas.forEach(function (divida) {
                let busca = retDiv.filter(function (div) {
                    return div.paga == divida.recebe && div.recebe == divida.paga;
                });

                if (busca.length > 0) {
                    let divContra = busca[0];
                    if (divContra.valor < divida.valor) {
                        divida.valor -= divContra.valor;
                        // Remove a divida contraria do array
                        retDiv = retDiv.filter(function (obj) { return obj != divContra });
                        retDiv.push(divida);
                    } else {
                        divContra.valor -= divida.valor;
                    }

                } else {
                    retDiv.push(divida);
                }
            });

            let ret = retDiv.filter(function (div) {
                return div.paga != div.recebe && div.valor > 0;
            });

            return ret.sort(function(a,b) {
                return b.paga - a.paga;
            });
        }
    },
    methods: {
        getPessoa(id) {
            return this.pessoas.filter(function (pessoa) {
                return pessoa.id == id;
            })[0];
        },
        getItem(id) {
            return this.itens.filter(function (item) {
                return item.id == id;
            })[0];
        },
        getDivida(quemPaga, quemRecebe) {
            let ret;
            let dividasValidas = this.dividas.filter(function (div) {
                return div.paga == quemPaga && div.recebe == quemRecebe;
            });
            if (dividasValidas.length > 0) {
                ret = dividasValidas[0];
            }
            return ret;
        },
        adicionarPessoa() {
            if (this.inputPessoaNome == "") {
                alert("Nome da pessoa nao foi escolhido!")
                return;
            }

            this.pessoas.push({
                id: this.indexPessoa,
                nome: this.inputPessoaNome,
                checked: false,
                deve: {}
            });
            this.inputPessoaNome = "";
            this.indexPessoa++;
        },
        adicionarItem() {

            if (this.inputItem.nome == "") {
                alert("Nome do item nao definido!");
                return;
            }
            if (this.inputItem.valor == "" || this.inputItem.valor == 0) {
                alert("Valor do item nao definido!");
                return;
            }
            if (this.inputItem.quempagou == "") {
                alert("Quem pagou nao foi definido!");
                return;
            }

            this.pessoas.filter(function (pessoa) {
                return pessoa.checked;
            }).forEach(function (element) {

                app.inputItem.quemusou.push(element.id);
            });

            if (this.inputItem.quemusou.length == 0) {
                alert("Quem usou nao foi definido!");
                return;
            }

            this.inputItem.quemusou = this.inputItem.quemusou.sort(ordemCrescente);

            this.itens.push({
                id: this.indexItem,
                nome: this.inputItem.nome,
                valor: this.inputItem.valor,
                quemusou: this.inputItem.quemusou,
                quempagou: this.inputItem.quempagou
            });

            this.atualizarValoresItem(this.inputItem);

            this.indexItem++;
            this.inputItem.nome = "";
            this.inputItem.valor = 0;
            this.inputItem.quemusou = [];
            this.inputItem.quempagou = 0;
        },
        formatItens(arr) {
            let ret = "";
            let pessoas = this.pessoas;
            let app = this;
            arr.forEach(function (item) {
                var pess = app.getPessoa(item);
                if (ret != "") {
                    ret = ret + " / ";
                }
                ret = ret + pess.nome;
            });
            return ret;
        },
        atualizarValoresItem(item) {
            let app = this;
            let valorCadaUser = item.valor / item.quemusou.length;

            item.quemusou.forEach(function (idPessoa) {

                let divida = app.getDivida(idPessoa, item.quempagou);
                if (!divida) {
                    divida = {
                        paga: idPessoa,
                        recebe: item.quempagou,
                        valor: valorCadaUser
                    }
                    app.dividas.push(divida);
                } else {
                    divida.valor += valorCadaUser;
                }

            });
        },
        atualizarValores() {
            let app = this;
            this.itens.forEach(function (item) {
                app.atualizarValoresItem(item);
            });
        }
    },
    watch: {

    },
    created() {
        this.atualizarValores();
    }
}).$mount("#app");