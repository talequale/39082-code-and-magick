'use strict';
(function() {
  var cloudBox = document.querySelector('.header-clouds');
  var xValue = 50;

  // определение направления скролла
  function getPageYOffset() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  var pageYOffset = getPageYOffset();

  function scrollDirection() {
    var newYOffset = getPageYOffset();
    var result = pageYOffset - newYOffset;
    pageYOffset = newYOffset;
    return result;
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
      var delta = (scrollDirection()) / 10;
      cloudBox.style.backgroundPosition = xValue + '%' + ' ' + '0%';
      xValue = xValue - delta;
    }
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
