document.addEventListener('DOMContentLoaded', () => {
	const bookBtn = document.querySelectorAll('.btn-book');
	const popupModal = document.querySelector('#popup');
	const popupContent = document.querySelector('#popup__content');
	const closeBtn = document.querySelector('.popup__close');

	console.log(bookBtn);

	bookBtn.forEach((button) => {
		button.addEventListener('click', () => {
			popupModal.classList.add('show-modal');
			popupContent.classList.add('show-content');
		});
	});

	closeBtn.addEventListener('click', () => {
		popupModal.classList.remove('show-modal');
		popupContent.classList.remove('show-content');
	});

	popupModal.addEventListener('click', (e) => {
		if (e.target !== popupContent) {
			popupModal.classList.remove('show-modal');
			popupContent.classList.remove('show-content');
		}
	});
});
