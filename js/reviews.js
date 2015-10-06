'use strict';

(function() {

  var readyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var ratingClassName = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var reviewsFilters = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var reviews;

  function renderReviews(reviews) {
    reviewsContainer.classList.remove('reviews-load-failure');
    reviewsContainer.innerHTML = '';

    var reviewTemplate = document.getElementById('review-template');
    var reviewsFragment = document.createDocumentFragment();

    reviewsFilters.classList.add('invisible');

    reviews.forEach(function(review) {
      var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);
      var avatarTemplate = newReviewElement.querySelector('.review-author');
      avatarTemplate.title = review.author.name;
      newReviewElement.querySelector('.review-text').textContent = review.description;
      newReviewElement.querySelector('.review-rating').classList.add(ratingClassName[Math.floor(review.rating)]);

      if (review.author.picture) {
        var reviewAvatar = new Image();
        reviewAvatar.src = review.author.picture;
        var imageLoadTimeout = setTimeout(function() {
          newReviewElement.classList.add('review-load-failure');
        }, REQUEST_FAILURE_TIMEOUT);
        reviewAvatar.onload = function() {
          reviewAvatar.classList.add('review-author');
          reviewAvatar.title = review.author.name;
          reviewAvatar.style.width = '124px';
          reviewAvatar.style.height = '124px';
          newReviewElement.replaceChild(reviewAvatar, avatarTemplate);
          clearTimeout(imageLoadTimeout);
        };
        reviewAvatar.onerror = function() {
          newReviewElement.classList.add('review-load-failure');
        };
      }
      reviewsFragment.appendChild(newReviewElement);
    });
    reviewsContainer.appendChild(reviewsFragment);
    reviewsFilters.classList.remove('invisible');
  }

  function showLoadFailure() {
    reviewsContainer.classList.add('reviews-load-failure');
  }

  function loadReviews(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/reviews.json');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case readyState.OPENED:
        case readyState.HEADERS_RECEIVED:
        case readyState.LOADING:
          reviewsContainer.classList.add('reviews-list-loading');
          break;
        case readyState.DONE:
        default:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            reviewsContainer.classList.remove('reviews-list-loading');
            callback(JSON.parse(data));
          }
          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
      }
    };
    xhr.ontimeout = function() {
      showLoadFailure();
    };
  }

  function filterReviews(reviews, filterName) {
    var filteredReviews = reviews.slice(0);

    switch (filterName) {

      case 'reviews-recent':
        filteredReviews = filteredReviews.sort(function(a, b) {
          if (new Date(a.date) > new Date(b.date)) {
            return -1;
          }
          if (new Date(a.date) < new Date(b.date)) {
            return 1;
          }
          if (new Date(a.date) === new Date(b.date)) {
            return 0;
          }
        });
        break;

      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(item) {
          return item.rating > 2;
        }).sort(function(a, b) {
          if (a.rating > b.rating) {
            return -1;
          }

          if (a.rating < b.rating) {
            return 1;
          }

          if (a.rating === b.rating) {
            return 0;
          }
        });
        break;

      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(item) {
          return item.rating < 3;
        }).sort(function(a, b) {
          if (a.rating < b.rating) {
            return -1;
          }
          if (a.rating > b.rating) {
            return 1;
          }
          if (a.rating === b.rating) {
            return 0;
          }
        });
        break;

      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          if (a['review-rating'] > b['review-rating']) {
            return -1;
          }
          if (a['review-rating'] < b['review-rating']) {
            return 1;
          }
          if (a['review-rating'] === b['review-rating']) {
            return 0;
          }
        });
        break;

      default:
        filteredReviews = reviews.slice(0);
        break;
    }
    return filteredReviews;
  }

  function setActiveFilter(filterID) {
    var filteredReviews = filterReviews(reviews, filterID);
    renderReviews(filteredReviews);
  }

  function initFilters() {
    var filterButtons = document.querySelectorAll('.reviews-filter-item');
    for (var i = 0, l = filterButtons.length; i < l; i++) {
      filterButtons[i].onclick = function(event) {
        var checkedButton = event.currentTarget;
        setActiveFilter(checkedButton.htmlFor);
      };
    }
  }

  initFilters();
  loadReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setActiveFilter('sort-hotels-default');
  });
})();
