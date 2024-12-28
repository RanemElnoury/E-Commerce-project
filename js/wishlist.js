const wishlistContainer = document.querySelector(".wishlist ul");
let clearBtn = document.querySelector(".clearBtn");

function renderWishlist() {
    const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

    if (favoriteProducts.length === 0) {
        wishlistContainer.innerHTML = getEmptyWishlistHTML();
        clearBtn.disabled = true; 
        return;
    }

    clearBtn.disabled = false; 
    wishlistContainer.innerHTML = favoriteProducts.map(product => getProductHTML(product)).join('');
    
    attachRemoveListeners();
    attachAddToCartListeners();
}

function getEmptyWishlistHTML() {
    return `
    <div class="text-center">
        <img src="images/clearWishing.svg" class="heartimage" alt="clearWishing" style="width:30%">
        <h3 class="text-muted fs-5">No Items in your wishlist!</h3>
    </div>
`;

}

function getProductHTML(product) {
    return `
        <li class="row justify-content-between align-items-center border-bottom py-3">
            <div class="col-4">
                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded me-2" style="width: 50px;">
                <span>${product.name}</span>
            </div>
            <div class="col-3 text-secondary">$${product.price}</div>
            <div class="col-2">
                <button class="btn btn-danger btn-sm remove-btn" data-id="${product.id}"><i class="fa-solid fa-heart-broken"></i></button>
                <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}"><i class="fa-solid fa-cart-shopping"></i></button>
            </div>
        </li>
    `;
}

function removeFromWishlist(productId) {
    const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    const updatedProducts = favoriteProducts.filter(product => product.id !== productId);
    localStorage.setItem('favoriteProducts', JSON.stringify(updatedProducts));

    const listItemToRemove = document.querySelector(`button[data-id="${productId}"]`).closest('li');
    listItemToRemove.remove();

    if (updatedProducts.length === 0) {
        wishlistContainer.innerHTML = getEmptyWishlistHTML();
        clearBtn.disabled = true;
    }
}

function attachRemoveListeners() {
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            removeFromWishlist(productId);
        });
    });
}

function attachAddToCartListeners() {
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            addToCart(productId);
        });
    });
}

function addToCart(productId) {
    const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    const productToAdd = favoriteProducts.find(product => product.id === productId);

    if (!productToAdd) {
        toastr.success("This product is not in your wishlist.");
        return;
    }

    const savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
    const existingProduct = savedProducts.find(product => product.id === productToAdd.id);

    if (existingProduct) {
        existingProduct.count = (existingProduct.count || 1) + 1;
        toastr.success(`${productToAdd.name} count has been updated in your cart.`);
    } else {
        productToAdd.count = 1;
        savedProducts.push(productToAdd);
        toastr.success(`${productToAdd.name} has been added to your cart!`);
    }

    localStorage.setItem('cardProducts', JSON.stringify(savedProducts));
    updateCartCount();
}


function updateCartCount() {
    const savedProducts = JSON.parse(localStorage.getItem('cardProducts')) || [];
    document.getElementById("cart-count").textContent = savedProducts.length;
}

function updateFavoriteCount() {
    const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    document.getElementById("favorite-count").textContent = favoriteProducts.length;
}

clearBtn.addEventListener("click", function () {
    const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

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
