// GIPHY SEARCH ENGINE
// Giphy API key
const API_KEY = "7NjwF4i6A4s8amz6wfq4RoPU0xEKaSDz";

// Select elements from HTML
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const gifContainer = document.getElementById("gif-container");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");
let offset = 0;
// FORM SUBMIT EVENT
form.addEventListener("submit", function(event) {
    // Prevents the page from refreshing
    event.preventDefault();
    // Get what the user typed
    const searchTerm = input.value.trim();
    if (searchTerm !== "") {
        searchGiphy(searchTerm);
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
   async function searchGiphy(searchTerm) {
    loader.classList.remove("hidden");
    errorMessage.textContent = "";
    const url =
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=12`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        // RESET container safely
        gifContainer.innerHTML = "";
        // Handle empty results FIRST
        if (data.data.length === 0) {
            errorMessage.textContent =
                "No GIFs found. Try another search.";
            return; // stop function early
        }
        displayGifs(data.data);
    }
    catch (error) {
        console.log("Error fetching GIFs:", error);
        errorMessage.textContent =
            "Something went wrong. Please try again.";
    }
    finally {
        loader.classList.add("hidden");
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
function displayGifs(gifs) {
    // Clear old search results
    gifContainer.innerHTML = "";
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
        // Put image inside card
        gifCard.appendChild(gifImage);
        // Put card inside container
        gifContainer.appendChild(gifCard);
    });
}
loadTrendingGifs();