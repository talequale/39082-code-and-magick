'use strict';

(function() {

  var ratingClassName = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  var reviewsFragment = document.createDocumentFragment();
  var reviewTemplate = document.getElementById('review-template');

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var Review = function(data) {
    this.data_ = data;
    this.element_ = null;
  };

  Review.prototype.render = function(review) {
    var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);
    var avatarTemplate = newReviewElement.querySelector('.review-author');
    avatarTemplate.title = this.data_['author']['name'];
    newReviewElement.querySelector('.review-text').textContent = this.data_['description'];
    newReviewElement.querySelector('.review-rating').classList.add(ratingClassName[this.data_['rating']]);

    if (this.data_['author']['picture']) {
      var reviewAvatar = new Image();
      reviewAvatar.src = this.data_['author']['picture'];
      var imageLoadTimeout = setTimeout(function() {
        newReviewElement.classList.add('review-load-failure');
      }, REQUEST_FAILURE_TIMEOUT);
      reviewAvatar.addEventListener('load', function() {
        reviewAvatar.classList.add('review-author');
        reviewAvatar.title = this.data_['author']['name'];
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

    this.element_ = newReviewElement;
  };

  Review.prototype.unrender = function() {
    this.element_.parentNode.removeChild(this.element_);
    this.element_ = null;
  };

  window.Review = Review;

})();
