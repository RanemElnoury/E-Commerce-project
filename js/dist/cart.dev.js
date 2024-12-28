"use strict";

var wishlistContainer = document.querySelector(".cart ul");
var payNow = document.querySelector(".clearBtn");

function getEmptyWishlistHTML() {
  return "\n        <div class=\"text-center\">\n            <img src=\"images/Shopping-Cart.png\" class=\"heartimage\" alt=\"clearWishing\" style=\"width:40%\">\n           \n        </div>\n    ";
}

function getProductHTML(product) {
  var totalPrice = (product.price * product.count).toFixed(2);
  return "\n        <li class=\"row justify-content-between align-items-center border-bottom py-3\">\n            <div class=\"col-4\">\n                <img src=\"".concat(product.image, "\" alt=\"").concat(product.name, "\" class=\"img-fluid rounded me-2\" style=\"width: 50px;\">\n                <span>").concat(product.name, "</span>\n            </div>\n            <div class=\"col-3 text-secondary\">$").concat(product.price, "</div>\n            <div class=\"col-2\">\n                <button class=\"btn btn-sm\" onclick=\"updateQuantity('").concat(product.id, "', -1)\">-</button>\n                <span>").concat(product.count, "</span>\n                <button class=\"btn btn-sm\" onclick=\"updateQuantity('").concat(product.id, "', 1)\">+</button>\n            </div>\n             <div class=\"col-1\">\n                <button class=\"btn btn-danger btn-sm remove-btn\" data-id=\"").concat(product.id, "\"><i class=\"fa-solid fa-trash\"></i></button>\n            </div>\n            <div class=\"col-2 text-secondary\">$").concat(totalPrice, "</div>\n           \n        </li>\n    ");
}

function renderWishlist() {
  var favoriteProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  console.log(favoriteProducts);

  if (favoriteProducts.length === 0) {
    wishlistContainer.innerHTML = getEmptyWishlistHTML();
    payNow.disabled = true;
    return;
  }

  payNow.disabled = false;
  wishlistContainer.innerHTML = favoriteProducts.map(function (product) {
    return getProductHTML(product);
  }).join('');
  attachRemoveListeners();
  attachAddToCartListeners();
}

function updateQuantity(productId, change) {
  var savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  var productToUpdate = savedProducts.find(function (product) {
    return product.id === productId;
  });
  if (!productToUpdate) return;
  productToUpdate.count += change;
  if (productToUpdate.count <= 0) productToUpdate.count = 1;
  localStorage.setItem('cardProducts', JSON.stringify(savedProducts));
  renderWishlist();
  updateCartCount();
}

function attachRemoveListeners() {
  var removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var productId = button.getAttribute("data-id");
      removeFromWishlist(productId);
    });
  });
}

function attachAddToCartListeners() {}

function removeFromWishlist(productId) {
  var savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  savedProducts = savedProducts.filter(function (product) {
    return product.id !== productId;
  });
  localStorage.setItem('cardProducts', JSON.stringify(savedProducts));
  renderWishlist();
  updateCartCount();
}

function updateCartCount() {
  var savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  var countElement = document.querySelector('#card-count');

  if (countElement) {
    countElement.textContent = savedProducts.length;
  }
}

payNow.addEventListener('click', function () {
  var savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  var totalPrice = 0;
  savedProducts.forEach(function (product) {
    totalPrice += product.price * product.count;
  });
  var confirmPay = confirm("Are you sure you want to pay? Total price: $".concat(totalPrice.toFixed(2)));

  if (confirmPay) {
    localStorage.removeItem('cardProducts');
    renderWishlist();
    updateCartCount();
    wishlistContainer.innerHTML = "\n            <div class=\"text-center\">\n                <img src=\"images/Shopping-Cart.png\" class=\"heartimage\" alt=\"clearWishing\" style=\"width:30%\">\n            </div>\n        ";
    payNow.disabled = true;
  }
});
document.addEventListener('DOMContentLoaded', function () {
  renderWishlist();
  updateCartCount();
});