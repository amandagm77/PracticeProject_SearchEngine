// GIPHY SEARCH ENGINE
// Giphy API key
const API_KEY = "7NjwF4i6A4s8amz6wfq4RoPU0xEKaSDz";

// Select elements from HTML
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const gifContainer = document.getElementById("gif-container");
const loader = document.getElementById("loader");
loader.classList.add("hidden");
const errorMessage = document.getElementById("error-message");
let offset = 0;
let currentSearchTerm = "";
let isLoading = false;
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const closeModal =document.getElementById("close-modal");
// FORM SUBMIT EVENT
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const searchTerm = input.value.trim();
    if (searchTerm !== "") {
        currentSearchTerm = searchTerm;
        offset = 0;
        searchGiphy(searchTerm, true);
    }
});
// FETCH DATA FROM GIPHY API
    /*
        This is the API endpoint URL.
        We are telling Giphy:
        - q = user's search
        - api_key = our API key
        - limit = number of GIFs
    */
   async function searchGiphy(searchTerm, isNewSearch = false) {
    loader.classList.remove("hidden");
    errorMessage.textContent = "";
    const url =
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=12&offset=${offset}`;
    if (isLoading) return;
    isLoading = true;
    loader.classList.remove("hidden");
    errorMessage.textContent = "";
    try {
        const response = await fetch(url);
        const data = await response.json();
        // RESET container safely
        if (isNewSearch) {
            gifContainer.innerHTML = "";
        }
        // Handle empty results FIRST
        if (data.data.length === 0) {
            errorMessage.textContent =
                "No GIFs found. Try another search.";
            return; // stop function early
        }
        displayGifs(data.data, isNewSearch);
        offset += 12;
    }
    catch (error) {
        console.log("Error fetching GIFs:", error);
        errorMessage.textContent =
            "Something went wrong. Please try again.";
    }
    finally {
        loader.classList.add("hidden");
        isLoading = false;
    }
}
// Trending Function
async function loadTrendingGifs() {
    const url =
        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=12`;
    try {
        loader.classList.remove("hidden");
        const response = await fetch(url);
        const data = await response.json();
        displayGifs(data.data);
        loader.classList.add("hidden");
    }
    catch(error) {
        console.log(error);
    }
}
// DISPLAY GIFS ON PAGE
function displayGifs(gifs, isNewSearch = false) {
    // Loop through each GIF
    gifs.forEach(function(gif) {
        // Create a div card
        const gifCard = document.createElement("div");
        gifCard.classList.add("gif-card");
        // Create image element
        const gifImage = document.createElement("img");
        /*
            Accessing image URL from API data
            downsized_medium gives a good quality image
        */
        gifImage.src = gif.images.downsized_medium.url;
        gifImage.alt = gif.title;
       // Open Modal
        gifImage.addEventListener("click", function() {
            modal.classList.remove("hidden");
            modalImage.src = gif.images.original.url;
        });
        gifCard.appendChild(gifImage);
        gifContainer.appendChild(gifCard);
    });
}
      // Close Modal
    closeModal.addEventListener("click", function() {
    modal.classList.add("hidden");
    modalImage.src = "";
});
    modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.classList.add("hidden");
        modalImage.src = "";
    }
});
    document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        modal.classList.add("hidden");
        modalImage.src = "";
    }
});
// Infinite Scroll
let scrollTimeout;
window.addEventListener("scroll", function() {
    if (isLoading) return;
    if (currentSearchTerm === "") return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const scrollPosition =
            window.innerHeight + window.scrollY;
        const pageHeight =
            document.body.offsetHeight;
        if (scrollPosition >= pageHeight - 500) {
            searchGiphy(currentSearchTerm, false);
        }
    }, 200);
});
loadTrendingGifs();