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
		especialChar = especialChar.replace(/[/]/g, "");
		return especialChar;
	}

    nameSerach() {
        if($('body').hasClass('resultado-busca')) {
            let url = window.location.href;

            if(url.indexOf('title=') == -1) {
				var pathname = this.especialCharMask(window.location.pathname);
				$('.section__title .titulo-sessao').html('RESULTADO DA BUSCA PARA: <span>"'+pathname+' "</span>');
				$('.catalog.resultado-busca .section__navTop__filter,.section__navTop__filter, .search-single-navigator').attr('style', 'display: inherit!important')
				$('.section__navTop__filter .btnClear').hide()
            } else {
				console.log(decodeURI(url.split('title=')[1]))
				$('.section__title .titulo-sessao').text(decodeURI(url.split('title=')[1]));

			}

        }
    }
}

window.Search = new Search();
