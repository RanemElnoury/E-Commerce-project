//slider
document.querySelector('.carousel').addEventListener('click', function () {
    interval: 1000
});

//active nav
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-item a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.parentElement.classList.add('active');
        }
    });
});

// arrow scroll
const scrollIcon = document.querySelector('.scroll-icon');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollIcon.style.display = 'flex';
    } else {
        scrollIcon.style.display = 'none';
    }
});


// Toggle Heart Function
function toggleHeart(element) {
    const productElement = element.closest('.product');
    if (!productElement) {
        console.error("Product element not found!");
        return;
    }

    const heartIcon = productElement.querySelector('.heart i');
    if (!heartIcon) {
        console.error("Heart icon not found!");
        return;
    }

    heartIcon.classList.toggle('fa-heart');
    heartIcon.classList.toggle('fa-heart-broken');

    const productData = {
        id: productElement.getAttribute('data-id'),
        name: productElement.getAttribute('data-name'),
        price: parseFloat(productElement.getAttribute('data-price')) || 0,
        image: productElement.getAttribute('data-image'),
        count: 1
    };

    let savedProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    const productIndex = savedProducts.findIndex(product => product.id === productData.id);

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
    const savedProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    const countElement = document.querySelector('#favorite-count');
    if (countElement) {
        countElement.textContent = savedProducts.length;
    }
}

function initializeHearts() {
    const savedProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productId = product.getAttribute('data-id');
        const heartIcon = product.querySelector('.heart i');

        if (savedProducts.some(p => p.id === productId)) {
            heartIcon.classList.remove('fa-heart');
            heartIcon.classList.add('fa-heart-broken');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeHearts();
    updateFavoriteCount();
});


//get data to products
let Products = [];

document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", function () {
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        let filter = this.getAttribute("data-filter");
        console.log("Filter selected:", filter);

        disProducts(filter, ".featured-products");
    });
});

document.querySelectorAll("[data-show]").forEach(button => {
    button.addEventListener("click", function () {
        document.querySelectorAll("[data-show]").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        let filter = this.getAttribute("data-show");
        console.log("Filter selected:", filter);

        disProducts(filter, ".featured-section");
    });
});

async function getAllProducts() {
    try {
        let res = await fetch(`https://ecommerce.routemisr.com/api/v1/products`);
        let result = await res.json();
        Products = result.data;
        console.log("All Products:", Products);

        disProducts("true", ".featured-products");
        disProducts("featured", ".featured-section");
    } catch (error) {
        console.error("Error fetching products:", error);
        document.querySelector(".items").innerHTML = "<p>Error loading products. Please try again later.</p>";
    }
}

function disProducts(filter, targetClass) {
    let products = ``;
    let filteredProducts = [];

    function filterProducts(filter) {
        let filteredProducts = [];

        if (filter === "true") {
            filteredProducts = Products.slice(0, 8);
        } else if (filter === "false") {
            filteredProducts = Products.filter(product => product.price < 200);
            filteredProducts = filteredProducts.slice(0, 8);
        } else if (filter === "falsee") {
            filteredProducts = Products.filter(product => product.ratingsAverage >= 4.9);
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
        filteredProducts.forEach(product => {
            let newClass = product.sold < 2000 ? 'new' : '';
            let saleClass = product.price < 200 ? 'sale' : '';
            products += `
            <div class="item product col-lg-3 col-md-4 col-sm-6 cardProduct ${newClass} ${saleClass}" 
            data-id="${product.id}" 
            data-type="${product.title.split(" ", 2).join(" ")}" 
            data-price="${product.price}" 
            data-image="${product.imageCover}"
            data-name="${product.title}">
                <div class="item-img ${newClass} ${saleClass}">
                    <img src="${product.imageCover}" alt="${product.title}">
                    <div class="heart" onclick="toggleHeart(this)">
                        <i class="fa-solid fa-heart"></i>
                    </div>
                </div>
                <div class="item-info">
                    <h6>$${product.price}</h6>
                    <span>${product.category.name}</span>
                    <p class="title">${product.title.split(" ", 2).join(" ")}</p>
                </div>
                <div class="itembtn">
                    <a>Add to Cart</a>
                </div> 
            </div>`;
        });
        initializeCartButtons();
        initializeHearts();
    }

    document.querySelector(targetClass).innerHTML = products;
    initializeCartButtons();
    initializeHearts();
}
getAllProducts();


//add card button
function toggleCart(element) {
    const productElement = element.closest('.cardProduct');
    if (!productElement) {
        console.error("Product element not found!");
        return;
    }

    const addBtn = productElement.querySelector(".itembtn a");
    const productId = productElement.getAttribute('data-id');
    const productName = productElement.getAttribute('data-name');
    const productPrice = parseFloat(productElement.getAttribute('data-price')) || 0;
    const productImage = productElement.getAttribute('data-image');

    const productData = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        count: 1
    };

    let savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
    const productIndex = savedProducts.findIndex(product => product.id === productData.id);

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
    const savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
    const countElement = document.querySelector('#card-count');
    if (countElement) {
        countElement.textContent = savedProducts.length;
    }
}

function initializeCartButtons() {
    const savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
    const allCards = document.querySelectorAll('.cardProduct');

    allCards.forEach(card => {
        const cardId = card.getAttribute('data-id');
        const addBtn = card.querySelector(".itembtn a");

        const productExists = savedProducts.some(product => product.id === cardId);

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
    const addBtn = event.currentTarget;
    toggleCart(addBtn);
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    initializeCartButtons();
});



//get data for trends
async function fetchProducts() {
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/products');
    const data = await response.json();
    console.log(data);

    if (data && data.data) {
        displayProducts(data.data);
    } else {
        console.error('No products found or error fetching data');
    }
}

function displayProducts(products) {
    const carouselInner = document.getElementById('carouselProducts');
    let carouselItems = '';
    let itemsPerCarousel = 3;
    let currentIndex = 0;

    while (currentIndex < products.length) {
        let carouselItemContent = `<div class="carousel-item ${currentIndex === 0 ? 'active' : ''}">`;
        carouselItemContent += '<div class="row">';

        for (let i = 0; i < itemsPerCarousel; i++) {
            if (currentIndex < products.length) {
                const product = products[currentIndex];
                carouselItemContent += `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="product" data-id="${product._id}" data-name="${product.title}" 
                            data-description="${product.description}" data-price="${product.price}" 
                            data-image="${product.imageCover}">
                            <div class="product-img">
                                <img src="${product.imageCover}" alt="${product.title}">
                            </div>
                            <div class="product-info">
                                <span>${product.title.split(" ", 2).join(" ")}</span>
                                <div class="text">
                                    <p>${product.description.split(" ", 1).join(" ")}</p>
                                    <p>$${product.price}</p>
                                </div>
                            </div>
                            <div class="heart" onclick="toggleHeart(this)">
                                <i class="fa-solid fa-heart" id="heart-icon"></i>
                            </div>
                        </div>
                    </div>
                `;
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
