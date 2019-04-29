$(document).ready(() => {
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
