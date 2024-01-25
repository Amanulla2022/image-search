const resultContainer = document.querySelector(".search-results-container");
let page = 1;

// function to debounce another function, preventing it from being called too frequently
function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

// Function to fetch images from Unsplash based on a search query
async function fetchImages(inputQuery, category = null) {
  const queryParam = category ? `&query=${category}` : "";
  const apiURL = `https://api.unsplash.com/search/photos?page=${page}&query=${inputQuery}${queryParam}&client_id=N4mxQrvH_ydGOOpgK4iVoZ51KXgbanfb3c2MkbS3MoA`;

  try {
    const response = await fetch(apiURL);
    const parsedData = await response.json();
    return parsedData.results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Function to handle the search process
async function handleSearch() {
  resultContainer.innerHTML = "";
  page = 1;

  const inputQuery = document.querySelector("#query").value;
  if (!inputQuery.trim()) {
    return;
  }

  const images = await fetchImages(inputQuery);
  displayImages(images);
}

// Function to handle the "More" button click and fetch additional images
async function handleShowMore() {
  page += 1;

  const inputQuery = document.querySelector("#query").value;
  if (!inputQuery.trim()) {
    return;
  }

  try {
    const images = await fetchImages(inputQuery);
    displayImages(images);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

// Function to handle category-based searches
async function handleCategory(category) {
  resultContainer.innerHTML = "";
  page = 1;

  const images = await fetchImages("", category);
  displayImages(images);
}

function createImageElement(imgURL) {
  const figure = document.createElement("figure");
  figure.classList.add("search-result");

  const image = document.createElement("img");
  image.src = imgURL;
  image.loading = "lazy"; // Lazy loading for improved performance
  image.alt = "Image";

  figure.appendChild(image);

  resultContainer.appendChild(figure);
}

function displayImages(images) {
  for (const item of images) {
    const imgURL = item.urls.raw;
    createImageElement(imgURL);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#query");
  const searchButton = document.querySelector("form button[type='submit']");
  const showMoreButton = document.querySelector(".show-more");

  const debouncedHandleSearch = debounce(handleSearch, 500);

  searchInput.addEventListener("input", debouncedHandleSearch);
  searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    handleSearch();
  });
  showMoreButton.addEventListener("click", handleShowMore);
});
