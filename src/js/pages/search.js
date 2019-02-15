class Search {
    constructor() {
        this.nameSerach();
	}

	especialCharMask(especialChar) {
		especialChar = especialChar.replace(/Ã§/g, "ç");
		especialChar = especialChar.replace(/Ãª/g, "ê");
		especialChar = especialChar.replace(/Ã/g, "Ó");
		especialChar = especialChar.replace(/Ã£o/g, "ã");
		especialChar = especialChar.replace(/%C3%A7/g, "ç");
		especialChar = especialChar.replace(/-/g, " ");
		return especialChar;
	}

    nameSerach() {
        if($('body').hasClass('resultado-busca')) {
            let url = window.location.href;

            if(url.indexOf('&title=') == -1) {
                let pathname = this.especialCharMask(window.location.pathname);
                $('.titulo-sessao').html('RESULTADO DA BUSCA <span>"'+pathname+' "</span>');
            } else {
                $('.section__title .titulo-sessao').text(this.especialCharMask(url.split('title=')[1]));
            }
        }
    }
}

window.Search = new Search();
