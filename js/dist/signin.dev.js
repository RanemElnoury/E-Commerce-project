"use strict";

var inputEmail = document.getElementById("userEmail");
var inputPass = document.getElementById("userPass");
var btn = document.querySelector(".btn");
btn.addEventListener("click", function () {
  var userData = {
    email: inputEmail.value,
    password: inputPass.value
  };
  console.log(userData);
  signIn(userData);
});

function signIn(data) {
  var res, result;
  return regeneratorRuntime.async(function signIn$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }));

        case 2:
          res = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(res.json());

        case 5:
          result = _context.sent;
          tost(result);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function tost(res) {
  if (res.message == "success") {
    toastr["success"]("Login successfully");
    setTimeout(function () {
      window.location.href = "index.html";
    }, 500);
  } else {
    toastr["error"]("".concat(res.message));
  }
}

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "3000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};