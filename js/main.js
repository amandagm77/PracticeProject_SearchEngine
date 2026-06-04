// GIPHY SEARCH ENGINE
// Giphy API key
const API_KEY = "7NjwF4i6A4s8amz6wfq4RoPU0xEKaSDz";

// ELEMENTS
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const gifContainer = document.getElementById("gif-container");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const closeModal = document.getElementById("close-modal");
const homeLink = document.getElementById("home-link");
const trendingLink = document.getElementById("trending-link");
const favoritesLink = document.getElementById("favorites-link");
const aboutLink = document.getElementById("about-link");
const backToTopBtn = document.getElementById("back-to-top");
// STATE
let offset = 0;
let currentSearchTerm = "";
let isLoading = false;
let scrollCooldown = false;
// BACK TO TOP
if (backToTopBtn) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 600) {
            backToTopBtn.classList.remove("hidden");
        } else {
            backToTopBtn.classList.add("hidden");
        }
    });
    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
// MODAL REUSABLE FUNCTION
function attachModal(imageElement, url) {
    imageElement.addEventListener("click", function () {
        modal.classList.remove("hidden");
        modalImage.src = url;
    });
}
// Close modal logic
closeModal.addEventListener("click", closeModalFn);
modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModalFn();
});
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModalFn();
});
function closeModalFn() {
    modal.classList.add("hidden");
    modalImage.src = "";
}
// FORM SUBMIT
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = input.value.trim();
    if (searchTerm !== "") {
        currentSearchTerm = searchTerm;
        offset = 0;
        searchGiphy(searchTerm, true);
    }
});
// AUTO LOAD MORE IF NOT SCROLLABLE
function ensureScrollableContent() {
    const pageHeight = document.documentElement.scrollHeight;
    if (pageHeight <= window.innerHeight + 50) {
        searchGiphy(currentSearchTerm, false);
    }
}
// API FETCH
async function searchGiphy(searchTerm, isNewSearch = false) {
    if (isLoading) return;
    isLoading = true;
    if (isNewSearch) {
        offset = 0;
        gifContainer.innerHTML = "";
    }
    const url =
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=12&offset=${offset}`;
    loader.classList.remove("hidden");
    errorMessage.textContent = "";
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.data.length === 0) {
            errorMessage.textContent = "No GIFs found. Try another search.";
            return;
        }
        displayGifs(data.data);
        offset += 12;
        setTimeout(ensureScrollableContent, 100);
    }
    catch (error) {
        console.log("Error fetching GIFs:", error);
        errorMessage.textContent = "Something went wrong. Please try again.";
    }
    finally {
        loader.classList.add("hidden");
        isLoading = false;
    }
}
// DISPLAY GIFS (SEARCH + TRENDING)
function displayGifs(gifs) {
    gifs.forEach(function (gif) {
        const gifCard = document.createElement("div");
        gifCard.classList.add("gif-card");
        const gifImage = document.createElement("img");
        gifImage.src = gif.images.downsized_medium.url;
        gifImage.alt = gif.title;
        attachModal(gifImage, gif.images.original.url);
        const favoriteButton = document.createElement("button");
        favoriteButton.textContent = "❤️ Favorite";
        favoriteButton.addEventListener("click", function () {
            let favorites =
                JSON.parse(localStorage.getItem("favorites")) || [];
            const gifData = {
                id: gif.id,
                url: gif.images.original.url,
                title: gif.title
            };
            const alreadySaved = favorites.some(item => item.id === gif.id);
            if (!alreadySaved) {
                favorites.push(gifData);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                favoriteButton.textContent = "❤️ Saved";
            } else {
                favoriteButton.textContent = "✔ Already Saved";
            }
        });
        gifCard.appendChild(gifImage);
        gifCard.appendChild(favoriteButton);
        gifContainer.appendChild(gifCard);
    });
}
// HOME
function showHomePage() {
    currentSearchTerm = "";
    errorMessage.textContent = "";
    gifContainer.innerHTML = `
        <div class="home-message">
            <p>Search for GIFs or browse Trending.</p>
        </div>
    `;
}
// TRENDING
async function loadTrendingGifs() {
    const url =
        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=36`;
    try {
        loader.classList.remove("hidden");
        const response = await fetch(url);
        const data = await response.json();
        gifContainer.innerHTML = "";
        displayGifs(data.data);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        loader.classList.add("hidden");
    }
}

// ABOUT
function showAboutPage() {
    currentSearchTerm = "";
    errorMessage.textContent = "";
    gifContainer.innerHTML = `
        <div class="about-section">
            <h2>About This Project</h2>
            <br>
             <p>
                This Front-End project was created for the AI Centric Software Engineering Bootcamp by QuickStart. It is intended for educational purposes only.
            </p>
            <br>
            <p>
                This project uses the GIPHY API,
                JavaScript, HTML, and CSS.
            </p>
        </div>
    `;
}

// FAVORITES
function loadFavorites() {
    gifContainer.innerHTML = "";
    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.length === 0) {
        errorMessage.textContent = "No favorites saved yet.";
        return;
    }
    favorites.forEach(function (gif) {
        const gifCard = document.createElement("div");
        gifCard.classList.add("gif-card");
        const gifImage = document.createElement("img");
        gifImage.src = gif.url;
        gifImage.alt = gif.title;
        attachModal(gifImage, gif.url);
        gifCard.appendChild(gifImage);
        gifContainer.appendChild(gifCard);
    });
}

// ======================
// INFINITE SCROLL
// ======================
window.addEventListener("scroll", function () {
    if (isLoading) return;
    if (!currentSearchTerm) return;
    if (scrollCooldown) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200) {
        scrollCooldown = true;

        searchGiphy(currentSearchTerm, false);

        setTimeout(() => {
            scrollCooldown = false;
        }, 500);
    }
});

// ======================
// NAV LINKS
// ======================
homeLink.addEventListener("click", function (e) {
    e.preventDefault();
    showHomePage();
});

trendingLink.addEventListener("click", function (e) {
    e.preventDefault();
    currentSearchTerm = "";
    loadTrendingGifs();
});

favoritesLink.addEventListener("click", function (e) {
    e.preventDefault();
    currentSearchTerm = "";
    loadFavorites();
});

aboutLink.addEventListener("click", function (e) {
    e.preventDefault();
    showAboutPage();
});
showHomePage();