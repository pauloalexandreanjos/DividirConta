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
            {id:1, nome:"PAULO", checked: false, deve:{} },
            {id:2, nome:"FABIO", checked: false, deve:{}},
            {id:3, nome:"CRISTOPHER", checked: false, deve:{}},
            {id:4, nome:"CRISTIANO", checked: false, deve:{}},
            {id:5, nome:"ALAN", checked: false, deve:{}},
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
		grupos: {}
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
            
			this.inputItem.quemusou = this.inputItem.quemusou.sort(ordemCrescente);
			
            this.itens.push({ 
                id: this.indexItem,
                nome: this.inputItem.nome,
                valor: this.inputItem.valor,
                quemusou: this.inputItem.quemusou,
                quempagou: this.inputItem.quempagou
            });
			
			atualizarValoresItem(this.inputItem);
			
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
        getItem(id) {
            return this.itens.filter(function(item) {
                return item.id == id;
            })[0];
        },
        formatItens(arr) {
            let ret = "";
            let pessoas = this.pessoas;
            let app = this;
            arr.forEach(function(item) {
                var pess = app.getPessoa(item);
                if (ret != "") {
                    ret = ret + " / ";
                }
                ret = ret + pess.nome;
            });
            return ret;
        },
		atualizarGrupos() {
			console.log("Atualizando grupos...");
			let app = this;
			this.itens.forEach(function(item) {
				console.log("Inserindo item",item.id);
				let chave = item.quemusou.join("/");
				if (!app.grupos[chave]) {
					console.log("Grupo",chave,"nao existe... criando a lista.");
					app.grupos[chave] = [];
				}
				console.log("Pushing item",item.id,"into group",chave);
				app.grupos[chave].push(item.id);
			});
		},
		atualizarValoresItem(item) {
			let app = this;
			let valorCadaUser = item.valor/item.quemusou.length;
			item.quemusou.forEach(function(idPessoa) {
				let pessoa = app.getPessoa(idPessoa);
				if (!pessoa.deve[item.quempagou]) {
					pessoa.deve[item.quempagou] = 0;
				}
				pessoa.deve[item.quempagou] = pessoa.deve[item.quempagou] + valorCadaUser;
			});
		},
		atualizarGrupos2() {
			let app = this;
			this.itens.forEach(function(item) {
				app.atualizarValoresItem(item);
			});
		},
		getValorDevido(idDevedor,idRecebedor) {
			let devedor = this.getPessoa(idDevedor);
			let recebedor = this.getPessoa(idRecebedor);
			let valor = devedor.deve[idRecebedor]-recebedor.deve[idDevedor];
			return valor; // > 0 ? valor : 0;
		}
    },
	watch: {
		itens: this.atualizarGrupos2,
		grupos: function() {
			
		}
	},
	created() {
		this.atualizarGrupos2();
	}
}).$mount("#app");