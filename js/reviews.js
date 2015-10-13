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
  var SIX_MONTHS = 182.5 * 24 * 60 * 60 * 1000;
  var REVIEWS_PER_PAGE = 3;
  var REPLACE_EXISTING = true;

  var reviewsFilters = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var reviews;
  var currentReviews;
  var currentPage = 0;
  var showMore = document.querySelector('.reviews-controls-more');

  function renderReviews(filteredReviews, pageNumber, replace) {
    pageNumber = pageNumber || 0;
    replace = typeof replace !== 'undefined' ? replace : true;

    if (replace) {
      reviewsContainer.classList.remove('reviews-load-failure');
      reviewsContainer.innerHTML = '';
    }

    var reviewTemplate = document.getElementById('review-template');
    var reviewsFragment = document.createDocumentFragment();

    var reviewsFrom = pageNumber * REVIEWS_PER_PAGE;
    var reviewsTo = reviewsFrom + REVIEWS_PER_PAGE;
    filteredReviews = filteredReviews.slice(reviewsFrom, reviewsTo);

    filteredReviews.forEach(function(review) {
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
        reviewAvatar.addEventListener('load', function() {
          reviewAvatar.classList.add('review-author');
          reviewAvatar.title = review.author.name;
          reviewAvatar.style.width = '124px';
          reviewAvatar.style.height = '124px';
          newReviewElement.replaceChild(reviewAvatar, avatarTemplate);
          clearTimeout(imageLoadTimeout);
        });
        reviewAvatar.addEventListener('error', function() {
          newReviewElement.classList.add('review-load-failure');
        });
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
            return callback(JSON.parse(data));
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

  function filterReviews(reviewsList, filterName) {
    var filteredReviews = reviewsList.slice(0);

    switch (filterName) {

      case 'reviews-recent':
        filteredReviews = filteredReviews.filter(function(item) {
          var limitingDate = new Date() - new Date(SIX_MONTHS);
          return Date.parse(item.date) > limitingDate;
        }).sort(function(a, b) {
          return a.date - b.date;
        });
        break;

      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(item) {
          return item.rating > 2;
        }).sort(function(a, b) {
          return a.rating - b.rating;
        }).reverse();
        break;

      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(item) {
          return item.rating < 3;
        }).sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;

      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          return a['review-rating'] - b['review-rating'];
        });
        break;

      default:
        filteredReviews = reviewsList.slice(0);
        break;
    }
    localStorage.setItem('filterName', filterName);
    var filterButton = document.getElementsByName('reviews');
    for (var i = 0; i < filterButton.length; i++) {
      filterButton[i].addEventListener('click', function(evt) {
        localStorage.setItem('checkedButton', evt.target.value);
      });
    }
    return filteredReviews;
  }

  function setActiveFilter(filterID) {
    currentReviews = filterReviews(reviews, filterID);
    currentPage = 0;
    renderReviews(currentReviews, currentPage, true);
    showMore.classList.remove('invisible');
  }

  function isNextPageAvailable() {
    return currentPage < (Math.ceil(currentReviews.length / REVIEWS_PER_PAGE)) - 1;
  }

  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');

    filtersContainer.addEventListener('click', function(evt) {
      var checkedFilter = evt.target;
      while (!(checkedFilter.classList.contains('reviews-filter'))) {
        if (!(checkedFilter.classList.contains('reviews-filter-item'))) {
          setActiveFilter(checkedFilter.id);
          return;
        }
        checkedFilter = checkedFilter.parentNode;
      }
    });
  }

  function showMoreReviews() {
    if (isNextPageAvailable()) {
      currentPage = currentPage + 1;
      renderReviews(currentReviews, currentPage, REPLACE_EXISTING);
      if (!(isNextPageAvailable())) {
        showMore.classList.add('invisible');
      }
    } else {
      currentPage = currentPage;
      renderReviews(currentReviews, currentPage, REPLACE_EXISTING);
    }
  }

  function nextPage() {
    if (!(currentReviews)) {
      showMore.classList.remove('invisible');
    }
    showMore.addEventListener('click', function() {
      showMoreReviews();
    });
  }

  initFilters();
  nextPage();
  loadReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setActiveFilter(localStorage.getItem('filterName') || 'reviews-all');
    if (localStorage.getItem('checkedButton')) {
      var checkedButton = localStorage.getItem('checkedButton');
      document.querySelector('input[name="reviews"][value="' + checkedButton + '"]').setAttribute('checked', 'checked');
    }
  });
})();
