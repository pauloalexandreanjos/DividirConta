function filterPessoas(pessoa) {
    return pessoa.checked;
}

var app = new Vue({
    data: {
        itens: [
            {id:1, nome:"JOGOS", valor:12.0, quempagou: 1, quemusou: [1,2,3,4,5]},
            {id:2, nome:"COCA-COLA", valor:12.0, quempagou: 5, quemusou: [1,2,3,4,5]},
            {id:3, nome:"CACHORRO-QUENTE", valor:12.0, quempagou: 3, quemusou: [1,2,3,4,5]}
        ],
        pessoas: [
            {id:1, nome:"PAULO", checked: false},
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
        }
    },
    methods: {
        adicionarPessoa() {
            this.pessoas.push({ 
                id: this.indexPessoa, 
                nome: this.inputPessoaNome, 
                checked: false
            });
            this.inputPessoaNome = "";
            this.indexPessoa++;
        },
        adicionarItem() {
            this.pessoas.filter(function (pessoa) {
                return pessoa.checked;
            }).forEach(function(element) {
                console.log(element.id);
                app.inputItem.quemusou.push(element.id);
            });
            
            this.itens.push({ 
                id: this.indexItem,
                nome: this.inputItem.nome,
                valor: this.inputItem.valor,
                quemusou: this.inputItem.quemusou,
                quempagou: this.inputItem.quempagou
            });

            this.indexItem++;
            this.inputItem.nome = "";
            this.inputItem.valor = 0;
            this.inputItem.quemusou = [];
            this.inputItem.quempagou = 0;
        },
        getPessoa(id) {
            return this.pessoas.filter(function(pessoa) {
                return pessoa.id == id;
            })[0];
        },
        formatItens(arr) {
            let ret = "";
            let pessoas = this.pessoas;
            let app = this;
            arr.forEach(function(item) {
                //console.log(this);
                //var pess = pessoas.filter(function(pessoa) { return pessoa.id == item; })[0];
                var pess = app.getPessoa(item);
                if (ret != "") {
                    ret = ret + " / ";
                }
                ret = ret + pess.nome;
            });
            return ret;
        }
    }
}).$mount("#app");