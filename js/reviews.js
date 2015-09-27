(function() {

    var ratingClassName = {
        '1': 'review-rating-one',
        '2': 'review-rating-two',
        '3': 'review-rating-three',
        '4': 'review-rating-four',
        '5': 'review-rating-five'
    };

    var IMAGE_FAILURE_TIMEOUT = 10000;
    var reviewsFilters = document.querySelector(".reviews-filter");
    var reviewsContainer = document.querySelector(".reviews-list");
    var reviewTemplate = document.getElementById("review-template");
    var reviewsFragment = document.createDocumentFragment();

    reviewsFilters.classList.add("invisible");

    reviews.forEach(function(review, i) {
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
            }, IMAGE_FAILURE_TIMEOUT);
            reviewAvatar.onload = function() {
                reviewAvatar.classList.add('review-author');
                reviewAvatar.title = review.author.name;
                reviewAvatar.style.width = '124px';
                reviewAvatar.style.height = '124px';
                newReviewElement.replaceChild(reviewAvatar, avatarTemplate);
                clearTimeout(imageLoadTimeout);
            };
            reviewAvatar.onerror = function(evt) {
                newReviewElement.classList.add('review-load-failure');
            }
        }
        reviewsFragment.appendChild(newReviewElement);
    });
    reviewsContainer.appendChild(reviewsFragment);
    reviewsFilters.classList.remove("invisible");
})();
