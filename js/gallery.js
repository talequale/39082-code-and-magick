'use strict';
(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var gallery = document.querySelector('.photogallery');
  var overlay = document.querySelector('.overlay-gallery');
  var closeButton = document.querySelector('.overlay-gallery-close');

  function hideGallery() {
    overlay.classList.add('invisible');
    closeButton.removeEventListener('click', closeHandler);
  }

  function closeHandler(evt) {
    evt.preventDefault();
    hideGallery();
  }

  function showGallery() {
    overlay.classList.remove('invisible');
    closeButton.addEventListener('click', closeHandler);
  }

  gallery.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    while (!(clickedElement.classList.contains('photogallery'))) {
      if (!(clickedElement.classList.contains('photogallery-image'))) {
        evt.preventDefault();
        showGallery();
        return;
      }
      clickedElement = clickedElement.parentNode;
    }
  })
})();
