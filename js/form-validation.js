
    var formElement = document.forms[1];
    var userName = formElement["review-name"];
    var message = formElement["review-text"];
    var nameTip = document.querySelector(".review-fields-name");
    var messageTip = document.querySelector(".review-fields-text");
    var tips = document.querySelector(".review-fields");
    var FIELDS_TO_PERSIST = ["review-name", "review-mark"];
    var lastBirthday = new Date(2014, 10, 11);
    var now = new Date();
    var millisecondsSince1970 = now.getTime();
    var millisecondsSinceLastBirthday = millisecondsSince1970 - lastBirthday.getTime();
    var expireDate = millisecondsSince1970 + millisecondsSinceLastBirthday;

    // спрятать/показать сообщение о необходимости заполнить поле с именем
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

    // спрятать/показать сообщение о необходимости заполнить поле с сообщением
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

    //восстановление значений из куки
    function restoreFormValueFromCookies() {
        for (var i = 0; i < FIELDS_TO_PERSIST.length; i++) {
            formElement[FIELDS_TO_PERSIST[i]].value = docCookies.getItem(FIELDS_TO_PERSIST[i]);
        }
    };


    //отправка формы
    function postReview(event) {
        event.preventDefault();
        for (var i = 0; i < FIELDS_TO_PERSIST.length; i++) {
            docCookies.setItem(FIELDS_TO_PERSIST[i], formElement[FIELDS_TO_PERSIST[i]].value, new Date(expireDate));
        }
        console.log("done");
    }

    userName.onchange = hideNameTip;

    message.onchange = hideMessageTip;

    formElement.onsubmit = postReview;

    formElement.onload = restoreFormValueFromCookies(formElement), hideNameTip(), hideMessageTip();

