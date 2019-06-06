$(document).ready(() => {
	$('body').on('click', 'a.menu__link.logged-status', function (e) {
		e.preventDefault();
		$(this).text() == 'Acessar sua conta' ? $('.header__login #login').trigger('click') : window.location = window.location.origin + '/account'
	})
	vtexjs.checkout.getOrderForm().done(orderForm => {
		const ifLogged = orderForm.loggedIn;
		if (ifLogged) {
			// desk
			const userName = orderForm.clientProfileData.firstName;
			const userEmail = orderForm.clientProfileData.email;
			const welcomeMessage = userName ? `Olá, ${userName}` : `Olá, ${userEmail}`
			if (welcomeMessage.length >= 15) $(".logged-status").text(`${welcomeMessage.substr(0, 14)}...`)
			else $(".logged-status").text(welcomeMessage)

			const linkLogout = `<li class="menu__item menu__item--highlight menu__item--logout"><a class="menu__link" href="/no-cache/user/logout">Sair</a></li>`

			$('.header__top .menu--institutional').append(linkLogout);
		}
	});


});
