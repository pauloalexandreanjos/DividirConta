function filterPessoas(pessoa) {
    return pessoa.checked;
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
            
			this.inputItem.quemusou = this.inputItem.quemusou.sort(function(a,b) { return a > b ? 1 : -1 });
			
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
			this.itensGrupos = [];
			app = this;
			this.itens.forEach(function(item) {
				let chave = item.quemusou.join("/");
				if (!app.grupos[chave]) {
					app.grupos[chave] = [];
				}
				//console.log("Pushing item",item.id,"into group",chave);
				app.grupos[chave].push(item.id);
			});
		},
		/*obterItensGrupo(chave) {
			//return this.itensGrupos;
			return this.grupos.filter(function(elm) {
				return elm.chave == chave;
			})
			.map(function(elm) {
				return elm.idItem;
			});
		},*/
		obterValorGrupo(chave) {
			let itens = this.grupos[chave].itens;
			console.log(JSON.stringify(itens));
			let app = this;
			return itens.reduce(function(total, item) {
				console.log("Reducing",item,"valor",app.getItem(item).valor);
				return total + app.getItem(item).valor;
			}, 0);
		}
    },
	watch: {
		itens: this.atualizarGrupos,
		grupo: function() {
			
		}
	},
	created() {
		this.atualizarGrupos();
		console.log(this.obterValorGrupo("1/2/3/4/5"));
	}
}).$mount("#app");