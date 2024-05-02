document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const productListContainer = document.getElementById("productListContainer");


    // Function to send a GET request and fetch product data
    const sendGetRequest = async (category) => {
        const url = `https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const productObject = data.categories.find(item => item.category_name === category);
            displayProducts(productObject.category_products);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    // Function to display products in the product list container
    const displayProducts = (products) => {
        productListContainer.innerHTML = ""; // Clear previous content

        products.forEach(product => {
            const { badge_text, image, title, vendor, price, compare_at_price } = product;
            const discount = Math.round(((compare_at_price - price) / compare_at_price) * 100); //Calculates discount

            const productListEl = document.createElement("li");
            productListEl.classList.add("product-item-container");
            productListEl.innerHTML = getProductHTML({ badge_text, image, title, vendor, price, compare_at_price, discount });

            productListContainer.appendChild(productListEl);
        });
    };


    // Function to generate HTML for a product item
    const getProductHTML = ({ badge_text, image, title, vendor, price, compare_at_price, discount }) => `
        <div class="product-item-image" style="background-image: url(${image})">
            <p class="badge ${badge_text ? "" : "d-none"}">${badge_text}</p>
        </div>
        <div class="product-item-details-card">
            <div class="product-item-card">
                <h1 class="product-item-title">${title}</h1>
                <p class="product-item-vendor">${vendor}</p>
            </div>
            <div class="price-discount-card">
                <div class="price-card">
                    <p class="price">Rs. ${price}.00</p>
                    <p class="compare-price">${compare_at_price}.00</p>
                </div>
                <p class="discount">${discount}% Off</p>
            </div>
            <button class="add-to-cart-button">Add to Cart</button>
        </div>
    `;

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            document.querySelector(".tab.active-tab-btn").classList.remove("active-tab-btn");
            this.classList.add("active-tab-btn");

            const category = this.getAttribute("data-tab");
            sendGetRequest(category);
        });
    });

    
    // Initially load products for the default active tab
    const defaultActiveTab = document.querySelector(".tab.active-tab-btn");
    const defaultCategory = defaultActiveTab.getAttribute("data-tab");
    sendGetRequest(defaultCategory);
});