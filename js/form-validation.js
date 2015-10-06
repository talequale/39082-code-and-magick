(function() {
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
  var FIELDS_TO_VALIDATE = [userName, message];
  var TIPS = [nameTip, messageTip];

  // спрятать/показать сообщение о необходимости заполнить поле
  function hideTip() {
    for (var i = 0; i < FIELDS_TO_VALIDATE.length; i++) {
      if (FIELDS_TO_VALIDATE[i].value.trim().length) {
        TIPS[i].classList.add("invisible")
      } else if (TIPS[i].classList.contains("invisible")) {
        TIPS[i].classList.remove("invisible")
      }

      if (nameTip.classList.contains("invisible") && messageTip.classList.contains("invisible")) {
        tips.classList.add("invisible");
      } else {
        tips.classList.remove("invisible")
      }
    }
  }

  //восстановление значений из куки
  function restoreFormValueFromCookies() {
    for (var i = 0; i < FIELDS_TO_PERSIST.length; i++) {
      formElement[FIELDS_TO_PERSIST[i]].value = docCookies.getItem(FIELDS_TO_PERSIST[i])
    }
  }

  //отправка формы
  function postReview(event) {
    if ((userName.value.trim().length) && (message.value.trim().length)) {
      event.preventDefault();
      for (var i = 0; i < FIELDS_TO_PERSIST.length; i++) {
        docCookies.setItem(FIELDS_TO_PERSIST[i], formElement[FIELDS_TO_PERSIST[i]].value, new Date(expireDate))
      };
    } else {
      event.preventDefault();
    }
  }

  restoreFormValueFromCookies();
  hideTip();
  for (var i = 0; i < FIELDS_TO_VALIDATE.length; i++) {
    FIELDS_TO_VALIDATE[i].onchange = hideTip;
  };
  formElement.onsubmit = postReview;

})();

