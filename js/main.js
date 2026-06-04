// GIPHY SEARCH ENGINE
// Giphy API key
const API_KEY = "7NjwF4i6A4s8amz6wfq4RoPU0xEKaSDz";

// Select elements from HTML
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const gifContainer = document.getElementById("gif-container");
const loader = document.getElementById("loader");
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
async function searchGiphy(searchTerm) {
    /*
        This is the API endpoint URL.
        We are telling Giphy:
        - q = user's search
        - api_key = our API key
        - limit = number of GIFs
    */
   // Show Loader
   loader.classList.remove("hidden");
    const url =
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=12`;
    try {
        // Make the API request
        const response = await fetch(url);
        // Convert response into JavaScript data
        const data = await response.json();
        // Send GIF data to display function
        displayGifs(data.data);
    // Hide Loader
    loader.classList.add("hidden");
    }
    catch(error) {
        console.log("Error fetching GIFs:", error);
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