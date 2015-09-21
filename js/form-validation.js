
    var formElement = document.forms[1];
    var userName = formElement["review-name"];
    var message = formElement["review-text"];
    var nameTip = document.querySelector(".review-fields-name");
    var messageTip = document.querySelector(".review-fields-text");
    var tips = document.querySelector(".review-fields");
    var radioCheck = document.forms[1]["review-mark"];

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
    function  restoreFormValueFromCookies(form) {
        var element;
        for (var i = 0, l = form.elements.length; i < l; i++) {
            element = form.elements[i];

            if (docCookies.hasItem(element.name)) {
                element.value = docCookies.getItem(element.name);
                console.log("печеньки");
            }
        };
    };

    //отправка формы
    function postReview(event) {
        if ((userName.value.trim().length) && (message.value.trim().length)) {
            event.preventDefault();
            var element;
            for (var i = 0; i < formElement.elements.length; i++ ) {
                element = formElement.elements[i];
                docCookies.setItem(element.name, element.value);
            };
            docCookies.setItem(radioCheck.name, radioCheck.value);
            formElement.submit();
            console.log("done");
        } else {
            event.preventDefault();
            console.log("something went wrong");
        }
    }

    userName.onchange = hideNameTip;

    message.onchange = hideMessageTip;

    formElement.onsubmit = postReview;

    formElement.onload = restoreFormValueFromCookies(formElement);

