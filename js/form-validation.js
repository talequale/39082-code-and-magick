
    var formElement = document.forms[1];
    var userName = formElement["review-name"];
    var message = formElement["review-text"];
    var nameTip = document.querySelector(".review-fields-name");
    var messageTip = document.querySelector(".review-fields-text");
    var tips = document.querySelector(".review-fields");

    function hideNameTip() {
        if (userName.value.trim().length) {
            nameTip.classList.add("invisible")
        } else if (nameTip.classList.contains("invisible")) {
            nameTip.classList.remove("invisible");
        };

        if (nameTip.classList.contains("invisible") && messageTip.classList.contains("invisible")) {
            tips.classList.add("invisible");
        } else {
            tips.classList.remove("invisible");
        }
    };

    function hideMessageTip() {
        if (message.value.trim().length) {
            messageTip.classList.add("invisible");
        } else {
            messageTip.classList.remove("invisible");
        };

        if (nameTip.classList.contains("invisible") && messageTip.classList.contains("invisible")) {
            tips.classList.add("invisible");
        } else {
            tips.classList.remove("invisible");
        }
    };

    function postReview() {
        if ((userName.value.trim().length) && (message.value.trim().length)) {
            formElement.submit();
            console.log("done");
        } else {
            event.preventDefault();
        }
    }

    userName.onchange = hideNameTip;

    message.onchange = hideMessageTip;

    formElement.onsubmit = postReview;