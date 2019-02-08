class Search {
    constructor() {
        this.nameSerach();
    }

    nameSerach() {
        if($('body').hasClass('resultado-busca')) {
            let url = window.location.href;

            if(url.indexOf('&title=') == -1) {
                let pathname = window.location.pathname;
                $('.titulo-sessao').html('RESULTADO DA BUSCA <span>"'+pathname.replace(/%20|\//g,' ')+' "</span>');
            } else {
                $('.section__title .titulo-sessao').text(url.split('title=')[1].replace(/%20/g, ' '));
            }
        }
    }
}

window.Search = new Search();