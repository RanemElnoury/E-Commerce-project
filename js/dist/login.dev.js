// // DOM
// let inputEmail = document.getElementById("userEmail");
// let inputPass = document.getElementById("userPass");
// let btn = document.querySelector(".btn");
// btn.addEventListener("click", function () {
//   let userData = {
//     email: inputEmail.value,
//     password: inputPass.value,
//   };
//   console.log(userData);
//   signIn(userData);
//   // OmarMo55@gmail.com
// });
// async function signIn(data) {
//   let res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   let result = await res.json();
//   tost(result);
// }
// function tost(res) {
//   if (res.message == "success") {
//     toastr["success"](`Login successfully`);
//     setTimeout(() => {
//       window.location.href = "index.html";
//     }, 500);
//   } else {
//     toastr["error"](`${res.message}`);
//   }
// }
// toastr.options = {
//   closeButton: false,
//   debug: false,
//   newestOnTop: false,
//   progressBar: false,
//   positionClass: "toast-top-right",
//   preventDuplicates: false,
//   onclick: null,
//   showDuration: "300",
//   hideDuration: "1000",
//   timeOut: "5000",
//   extendedTimeOut: "1000",
//   showEasing: "swing",
//   hideEasing: "linear",
//   showMethod: "fadeIn",
//   hideMethod: "fadeOut",
// };
"use strict";