"use strict";

var wishlistContainer = document.querySelector(".wishlist ul");
var clearBtn = document.querySelector(".clearBtn");

function renderWishlist() {
  var favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

  if (favoriteProducts.length === 0) {
    wishlistContainer.innerHTML = getEmptyWishlistHTML();
    clearBtn.disabled = true;
    return;
  }

  clearBtn.disabled = false;
  wishlistContainer.innerHTML = favoriteProducts.map(function (product) {
    return getProductHTML(product);
  }).join('');
  attachRemoveListeners();
  attachAddToCartListeners();
}

function getEmptyWishlistHTML() {
  return "\n    <div class=\"text-center\">\n        <img src=\"images/clearWishing.svg\" class=\"heartimage\" alt=\"clearWishing\" style=\"width:30%\">\n        <h3 class=\"text-muted fs-5\">No Items in your wishlist!</h3>\n    </div>\n";
}

function getProductHTML(product) {
  return "\n        <li class=\"row justify-content-between align-items-center border-bottom py-3\">\n            <div class=\"col-4\">\n                <img src=\"".concat(product.image, "\" alt=\"").concat(product.name, "\" class=\"img-fluid rounded me-2\" style=\"width: 50px;\">\n                <span>").concat(product.name, "</span>\n            </div>\n            <div class=\"col-3 text-secondary\">$").concat(product.price, "</div>\n            <div class=\"col-2\">\n                <button class=\"btn btn-danger btn-sm remove-btn\" data-id=\"").concat(product.id, "\"><i class=\"fa-solid fa-heart-broken\"></i></button>\n                <button class=\"btn btn-primary btn-sm add-to-cart-btn\" data-id=\"").concat(product.id, "\"><i class=\"fa-solid fa-cart-shopping\"></i></button>\n            </div>\n        </li>\n    ");
}

function removeFromWishlist(productId) {
  var favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
  var updatedProducts = favoriteProducts.filter(function (product) {
    return product.id !== productId;
  });
  localStorage.setItem('favoriteProducts', JSON.stringify(updatedProducts));
  var listItemToRemove = document.querySelector("button[data-id=\"".concat(productId, "\"]")).closest('li');
  listItemToRemove.remove();

  if (updatedProducts.length === 0) {
    wishlistContainer.innerHTML = getEmptyWishlistHTML();
    clearBtn.disabled = true;
  }
}

function attachRemoveListeners() {
  document.querySelectorAll(".remove-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      var productId = button.getAttribute("data-id");
      removeFromWishlist(productId);
    });
  });
}

function attachAddToCartListeners() {
  document.querySelectorAll(".add-to-cart-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      var productId = button.getAttribute("data-id");
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  var favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
  var productToAdd = favoriteProducts.find(function (product) {
    return product.id === productId;
  });

  if (!productToAdd) {
    toastr.success("This product is not in your wishlist.");
    return;
  }

  var savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  var existingProduct = savedProducts.find(function (product) {
    return product.id === productToAdd.id;
  });

  if (existingProduct) {
    existingProduct.count = (existingProduct.count || 1) + 1;
    toastr.success("".concat(productToAdd.name, " count has been updated in your cart."));
  } else {
    productToAdd.count = 1;
    savedProducts.push(productToAdd);
    toastr.success("".concat(productToAdd.name, " has been added to your cart!"));
  }

  localStorage.setItem('cardProducts', JSON.stringify(savedProducts));
  updateCartCount();
}

function updateCartCount() {
  var savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  document.getElementById("cart-count").textContent = savedProducts.length;
}

function updateFavoriteCount() {
  var favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
  document.getElementById("favorite-count").textContent = favoriteProducts.length;
}

clearBtn.addEventListener("click", function () {
  var favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

  if (favoriteProducts.length === 0) {
    alert("Your wishlist is already empty!");
    wishlistContainer.innerHTML = getEmptyWishlistHTML();
    return;
  }

  if (confirm("Are you sure you want to clear the wishlist?")) {
    localStorage.removeItem('favoriteProducts');
    updateFavoriteCount();
    renderWishlist();
  }
});
document.addEventListener("DOMContentLoaded", renderWishlist);