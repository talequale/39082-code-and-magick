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
  var arrowLeft = document.querySelector('.overlay-gallery-control-left');
  var arrowRight = document.querySelector('.overlay-gallery-control-right');

  function closeHandler(evt) {
    evt.preventDefault();
    hideGallery();
  }

  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        console.log('show previous photo');
        break;
      case Key.RIGHT:
        console.log('show next photo');
        break;
      case Key.ESC:
        hideGallery();
        break;
    }
  }

  function previousPhoto(evt) {
    evt.preventDefault();
    console.log('show previous photo');
  }

  function nextPhoto(evt) {
    evt.preventDefault();
    console.log('show next photo');
  }

  function hideGallery() {
    overlay.classList.add('invisible');
    closeButton.removeEventListener('click', closeHandler);
    document.body.removeEventListener('keydown', keyHandler);
    arrowLeft.removeEventListener('click', previousPhoto);
    arrowRight.removeEventListener('click', nextPhoto);
  }

  function showGallery() {
    overlay.classList.remove('invisible');
    closeButton.addEventListener('click', closeHandler);
    document.body.addEventListener('keydown', keyHandler);
    arrowLeft.addEventListener('click', previousPhoto);
    arrowRight.addEventListener('click', nextPhoto);
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
