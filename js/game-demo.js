'use strict';
(function() {
  var cloudBox = document.querySelector('.header-clouds');
  var xValue = 50;

  // определение направления скролла
  function scrollDirection() {
    var delta;
    var pixelsFromTop = window.pageYOffset || document.documentElement.scrollTop;
    window.addEventListener('scroll', function() {
      var currentPixelsFromTop = window.pageYOffset || document.documentElement.scrollTop;
      if (currentPixelsFromTop > pixelsFromTop) {
        delta = 1;
      } else if (currentPixelsFromTop < pixelsFromTop) {
        delta = -1;
      }
      return delta;
    });
  }

  // видимость блока с облаками
  function elementVisibilityCheck(element) {
    var bottomValue = element.getBoundingClientRect().bottom;
    if (bottomValue < 0) {
      window.dispatchEvent(new CustomEvent('stopParallax'));
    } else {
      window.dispatchEvent(new CustomEvent('startParallax'));
    }
  }

  function scrollInit() {
    var someTimeout;
    function moveBackground() {
      var delta = scrollDirection();
      cloudBox.style.backgroundPosition = xValue + '%' + ' ' + '0%';
      xValue = xValue - delta;
    }
    window.addEventListener('scroll', moveBackground);
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(elementVisibilityCheck(cloudBox), 100);
      window.addEventListener('stopParallax', function() {
        window.removeEventListener('scroll', moveBackground);
      });
      window.addEventListener('startParallax', function() {
        window.addEventListener('scroll', moveBackground);
      });
    });
  }

  scrollInit();
})();
