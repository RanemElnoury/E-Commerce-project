"use strict";

//slider
document.querySelector('.carousel').addEventListener('click', function () {
  interval: 1000;
}); //active nav

var sections = document.querySelectorAll('section');
var navLinks = document.querySelectorAll('.nav-item a');
window.addEventListener('scroll', function () {
  var current = '';
  sections.forEach(function (section) {
    var sectionTop = section.offsetTop;
    var sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(function (link) {
    link.parentElement.classList.remove('active');

    if (link.getAttribute('href').includes(current)) {
      link.parentElement.classList.add('active');
    }
  });
}); // arrow scroll

var scrollIcon = document.querySelector('.scroll-icon');
window.addEventListener('scroll', function () {
  if (window.scrollY > 300) {
    scrollIcon.style.display = 'flex';
  } else {
    scrollIcon.style.display = 'none';
  }
}); // Toggle Heart Function

function toggleHeart(element) {
  var productElement = element.closest('.product');

  if (!productElement) {
    console.error("Product element not found!");
    return;
  }

  var heartIcon = productElement.querySelector('.heart i');

  if (!heartIcon) {
    console.error("Heart icon not found!");
    return;
  }

  heartIcon.classList.toggle('fa-heart');
  heartIcon.classList.toggle('fa-heart-broken');
  var productData = {
    id: productElement.getAttribute('data-id'),
    name: productElement.getAttribute('data-name'),
    price: parseFloat(productElement.getAttribute('data-price')) || 0,
    image: productElement.getAttribute('data-image'),
    count: 1
  };
  var savedProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
  var productIndex = savedProducts.findIndex(function (product) {
    return product.id === productData.id;
  });

  if (productIndex !== -1) {
    savedProducts.splice(productIndex, 1);
    toastr.success("Removed from wishlist");
  } else {
    savedProducts.push(productData);
    toastr.success("Added to wishlist");
  }

  localStorage.setItem('favoriteProducts', JSON.stringify(savedProducts));
  updateFavoriteCount();
}

function updateFavoriteCount() {
  var savedProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
  var countElement = document.querySelector('#favorite-count');

  if (countElement) {
    countElement.textContent = savedProducts.length;
  }
}

function initializeHearts() {
  var savedProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
  var products = document.querySelectorAll('.product');
  products.forEach(function (product) {
    var productId = product.getAttribute('data-id');
    var heartIcon = product.querySelector('.heart i');

    if (savedProducts.some(function (p) {
      return p.id === productId;
    })) {
      heartIcon.classList.remove('fa-heart');
      heartIcon.classList.add('fa-heart-broken');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initializeHearts();
  updateFavoriteCount();
}); //get data to products

var Products = [];
document.querySelectorAll(".tab-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      return btn.classList.remove("active");
    });
    this.classList.add("active");
    var filter = this.getAttribute("data-filter");
    console.log("Filter selected:", filter);
    disProducts(filter, ".featured-products");
  });
});
document.querySelectorAll("[data-show]").forEach(function (button) {
  button.addEventListener("click", function () {
    document.querySelectorAll("[data-show]").forEach(function (btn) {
      return btn.classList.remove("active");
    });
    this.classList.add("active");
    var filter = this.getAttribute("data-show");
    console.log("Filter selected:", filter);
    disProducts(filter, ".featured-section");
  });
});

function getAllProducts() {
  var res, result;
  return regeneratorRuntime.async(function getAllProducts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("https://ecommerce.routemisr.com/api/v1/products"));

        case 3:
          res = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          result = _context.sent;
          Products = result.data;
          console.log("All Products:", Products);
          disProducts("true", ".featured-products");
          disProducts("featured", ".featured-section");
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching products:", _context.t0);
          document.querySelector(".items").innerHTML = "<p>Error loading products. Please try again later.</p>";

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

function disProducts(filter, targetClass) {
  var products = "";
  var filteredProducts = [];

  function filterProducts(filter) {
    var filteredProducts = [];

    if (filter === "true") {
      filteredProducts = Products.slice(0, 8);
    } else if (filter === "false") {
      filteredProducts = Products.filter(function (product) {
        return product.price < 200;
      });
      filteredProducts = filteredProducts.slice(0, 8);
    } else if (filter === "falsee") {
      filteredProducts = Products.filter(function (product) {
        return product.ratingsAverage >= 4.9;
      });
      filteredProducts = filteredProducts.slice(0, 8);
    }

    if (filter === "featured") {
      filteredProducts = Products.slice(8, 16);
    } else if (filter === "sale") {
      filteredProducts = Products.slice(2, 10);
    } else if (filter === "rated") {
      filteredProducts = Products.slice(19, 27);
    }

    return filteredProducts;
  }

  filteredProducts = filterProducts(filter);

  if (filteredProducts.length === 0) {
    products = "<p>No products found for this filter.</p>";
  } else {
    products = '';
    filteredProducts.forEach(function (product) {
      var newClass = product.sold < 2000 ? 'new' : '';
      var saleClass = product.price < 200 ? 'sale' : '';
      products += "\n            <div class=\"item product col-lg-3 col-md-4 col-sm-6 cardProduct ".concat(newClass, " ").concat(saleClass, "\" \n            data-id=\"").concat(product.id, "\" \n            data-type=\"").concat(product.title.split(" ", 2).join(" "), "\" \n            data-price=\"").concat(product.price, "\" \n            data-image=\"").concat(product.imageCover, "\"\n            data-name=\"").concat(product.title, "\">\n                <div class=\"item-img ").concat(newClass, " ").concat(saleClass, "\">\n                    <img src=\"").concat(product.imageCover, "\" alt=\"").concat(product.title, "\">\n                    <div class=\"heart\" onclick=\"toggleHeart(this)\">\n                        <i class=\"fa-solid fa-heart\"></i>\n                    </div>\n                </div>\n                <div class=\"item-info\">\n                    <h6>$").concat(product.price, "</h6>\n                    <span>").concat(product.category.name, "</span>\n                    <p class=\"title\">").concat(product.title.split(" ", 2).join(" "), "</p>\n                </div>\n                <div class=\"itembtn\">\n                    <a>Add to Cart</a>\n                </div> \n            </div>");
    });
    initializeCartButtons();
    initializeHearts();
  }

  document.querySelector(targetClass).innerHTML = products;
  initializeCartButtons();
  initializeHearts();
}

getAllProducts(); //add card button

function toggleCart(element) {
  var productElement = element.closest('.cardProduct');

  if (!productElement) {
    console.error("Product element not found!");
    return;
  }

  var addBtn = productElement.querySelector(".itembtn a");
  var productId = productElement.getAttribute('data-id');
  var productName = productElement.getAttribute('data-name');
  var productPrice = parseFloat(productElement.getAttribute('data-price')) || 0;
  var productImage = productElement.getAttribute('data-image');
  var productData = {
    id: productId,
    name: productName,
    price: productPrice,
    image: productImage,
    count: 1
  };
  var savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  var productIndex = savedProducts.findIndex(function (product) {
    return product.id === productData.id;
  });

  if (productIndex !== -1) {
    savedProducts.splice(productIndex, 1);
    addBtn.innerText = "Add Card";
    addBtn.closest('.itembtn').style.backgroundColor = "#0099cc";
    toastr.success('Product removed from the cart!');
  } else {
    savedProducts.push(productData);
    addBtn.innerText = "Remove Card";
    addBtn.closest('.itembtn').style.backgroundColor = "red";
    toastr.success('Product added to the cart!');
  }

  localStorage.setItem('cardProducts', JSON.stringify(savedProducts));
  updateCartCount();
}

function updateCartCount() {
  var savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  var countElement = document.querySelector('#card-count');

  if (countElement) {
    countElement.textContent = savedProducts.length;
  }
}

function initializeCartButtons() {
  var savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
  var allCards = document.querySelectorAll('.cardProduct');
  allCards.forEach(function (card) {
    var cardId = card.getAttribute('data-id');
    var addBtn = card.querySelector(".itembtn a");
    var productExists = savedProducts.some(function (product) {
      return product.id === cardId;
    });

    if (productExists) {
      addBtn.innerText = "Remove Card";
      addBtn.closest('.itembtn').style.backgroundColor = "red";
    } else {
      addBtn.innerText = "Add Card";
      addBtn.closest('.itembtn').style.backgroundColor = "#0099cc";
    }

    addBtn.removeEventListener("click", handleCartButtonClick);
    addBtn.addEventListener("click", handleCartButtonClick);
  });
}

function handleCartButtonClick(event) {
  var addBtn = event.currentTarget;
  toggleCart(addBtn);
}

document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  initializeCartButtons();
}); //get data for trends

function fetchProducts() {
  var response, data;
  return regeneratorRuntime.async(function fetchProducts$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetch('https://ecommerce.routemisr.com/api/v1/products'));

        case 2:
          response = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          data = _context2.sent;
          console.log(data);

          if (data && data.data) {
            displayProducts(data.data);
          } else {
            console.error('No products found or error fetching data');
          }

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function displayProducts(products) {
  var carouselInner = document.getElementById('carouselProducts');
  var carouselItems = '';
  var itemsPerCarousel = 3;
  var currentIndex = 0;

  while (currentIndex < products.length) {
    var carouselItemContent = "<div class=\"carousel-item ".concat(currentIndex === 0 ? 'active' : '', "\">");
    carouselItemContent += '<div class="row">';

    for (var i = 0; i < itemsPerCarousel; i++) {
      if (currentIndex < products.length) {
        var product = products[currentIndex];
        carouselItemContent += "\n                    <div class=\"col-12 col-md-6 col-lg-4\">\n                        <div class=\"product\" data-id=\"".concat(product._id, "\" data-name=\"").concat(product.title, "\" \n                            data-description=\"").concat(product.description, "\" data-price=\"").concat(product.price, "\" \n                            data-image=\"").concat(product.imageCover, "\">\n                            <div class=\"product-img\">\n                                <img src=\"").concat(product.imageCover, "\" alt=\"").concat(product.title, "\">\n                            </div>\n                            <div class=\"product-info\">\n                                <span>").concat(product.title.split(" ", 2).join(" "), "</span>\n                                <div class=\"text\">\n                                    <p>").concat(product.description.split(" ", 1).join(" "), "</p>\n                                    <p>$").concat(product.price, "</p>\n                                </div>\n                            </div>\n                            <div class=\"heart\" onclick=\"toggleHeart(this)\">\n                                <i class=\"fa-solid fa-heart\" id=\"heart-icon\"></i>\n                            </div>\n                        </div>\n                    </div>\n                ");
        currentIndex++;
      }
    }

    carouselItemContent += '</div>';
    carouselItemContent += '</div>';
    carouselItems += carouselItemContent;
  }

  carouselInner.innerHTML = carouselItems;
}

document.addEventListener('DOMContentLoaded', fetchProducts);