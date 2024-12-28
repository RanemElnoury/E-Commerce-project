let inputName = document.getElementById("userName");
let inputEmail = document.getElementById("userEmail");
let inputPass = document.getElementById("userPass");
let inputRepass = document.getElementById("userRepass");
let inputPhone = document.getElementById("userPhone");
let btn = document.querySelector(".btn");

btn.addEventListener("click", function () {
  let userData = {
    name: inputName.value,
    email: inputEmail.value,
    password: inputPass.value,
    rePassword: inputRepass.value,
    phone: inputPhone.value,
  };
  console.log(userData);
  signUp(userData);
});

async function signUp(data) {
  let res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let result = await res.json();
  tost(result);
}

function tost(res) {
  if (res.message == "success") {
    toastr["success"](`Register successfully done`);
    setTimeout(()=>{
      window.location.href="signin.html"
    },1000)
  } else {
    toastr["error"](`${res.message}`);
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
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
