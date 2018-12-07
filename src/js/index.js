import '../scss/main.scss';
import './pages/global';
import './pages/home';
import './pages/catalog';
import './pages/empty-search';
import './pages/login';

import './components/menu';
import './components/filter';
import './components/product';
import './components/minicart';
import './components/account';
import './components/searchForm';
import './components/searchMob';
import './components/send-form';


$(document).ready(function(){
    $('.search-form__form').searchform({'vtexStore': 'tactical'});
});