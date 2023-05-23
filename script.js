// get all the blocks of images
const blocks = document.querySelectorAll(".slider-container");

// for every block get the width of the image and index of
blocks.forEach(block => {
  const slider = block.querySelector(".slider"); // get slide element
  const images = slider.querySelectorAll("img"); //get images elements
  const arrowLeft = block.querySelector(".arrow-left"); // get arrow left icon
  const arrowRight = block.querySelector(".arrow-right"); // get arrow right icon
  const sliderWidth = slider.offsetWidth; //get slider images width
  const imageWidth = images[0].offsetWidth; // get single image width
  const maxIndex = 6 // max number of index for 7 images

  let currentIndex = 0;

  function slideLeft() {
    if (currentIndex > 0) {
        currentIndex--;
        slider.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
    }
  }

  function slideRight() {
    if (currentIndex < maxIndex) {
      currentIndex++;
      slider.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
    }
  }

  // listen click arrow left action and do slide left function
  arrowLeft.addEventListener("click",slideLeft);

  arrowRight.addEventListener("click",slideRight);

});

// async function to fetch movies data by using the api address
async function fetchMoviesData(baseUrl, containerId, genre, moviesCount) {
  let container = document.getElementById(containerId);
  let slider = container.querySelector(".slider");
  let moviesLoaded = 0;
  let page = 1;
  let moviesPerPage = 5;

  while (moviesLoaded < moviesCount) {
    // get url address of giving categories
    let url = baseUrl + "?genre=" + genre + "&limit=" + moviesPerPage + "&page=" + page + "&sort_by=-imdb_score";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("movies not found");
      }
      // wait the promise to be fulfilled
      const data = await response.json();
      // because one page has only 5 results,but we need 7 results in total for every category and also we ignore
      // the result which image can not be loaded
      let moviesToAdd = Math.min(moviesCount - moviesLoaded, data.results.length);

      for (let i = 0; i < moviesToAdd; i++) {
        let movieElement = createMovieElement(data.results[i]);
        slider.appendChild(movieElement);
        moviesLoaded++;
      }
    } catch (error) {
      console.log(error);
    }

    page++;
  }
}


function createMovieElement(movie) {
    let movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    // create new image object
    let image = new Image();
    image.src = movie.image_url;
    // if image can be load successful
    image.onload = function() {
        //Set the image source, alt text, and data attributes dynamically
        movieElement.innerHTML = `
            <img src="${movie.image_url}" alt="${movie.title}" data-image-id="${movie.id}">
        `;
    };

    image.onerror = function() {
        console.error("Image not found");
    };

    return movieElement;
}

async function fetchBannerData(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const bannerData = await response.json();
            return bannerData;
        } else {
            throw new Error("Failed to fetch image");
        }
    } catch (error) {
        console.error(error);
    }
}

// async function to set banner image,button and title
async function setBannerBackground() {
    const bannerElement = document.getElementById("banner-main");
    const data = await fetchBannerData("http://localhost:8000/api/v1/titles/?genre=&limit=5&page=1&sort_by=-imdb_score");
    const bannerData = await fetchBannerData(data.results[0].url);
    const bannerImage = data.results[0].image_url;
    bannerElement.style.backgroundImage = `url(${bannerImage})`;
    bannerElement.innerHTML = `
    <h3>${bannerData.title}</h3>
    <p class="banner-description">${bannerData.description}</p>
    <button class="banner-button" data-button-id="${bannerData.id}" >See detail</button>
    `;
}


async function showMovieDetails(movieId) {
  let modal = document.getElementById("modal");

  try {
    const response = await fetch(`http://localhost:8000/api/v1/titles/${movieId}`);

    if (!response.ok) {
      throw new Error("Failed to load movie details");
    }

    const data = await response.json();
    //Set the divers attributes of modal by using the movie data
    let movieDetailsElement = modal.querySelector(".movie-details");
    movieDetailsElement.innerHTML = `
      <img src=${data.image_url} alt=${data.title}>
      <h4>${data.title}</h4>
      <p>genres:${data.genres.join(", ")}</p>
      <p>Year: ${data.year}</p>
      <p>Rating: ${data.rated}</p>
      <p>IMDB Score: ${data.imdb_score}</p>
      <p>Directors: ${data.directors.join(", ")}</p>
      <p>Actors: ${data.actors.join(", ")}</p>
      <p>Duration: ${data.duration}</p>
      <p>Country: ${data.countries.join(", ")}</p>
      <p>Income: ${data.worldwide_gross_income}</p>
      <p>Description: ${data.description}</p>
    `;
  } catch (error) {
    console.log(error);
  }
  // set modal display as block,none by default
  modal.style.display = "block";
}

// close the modal by set display attribute as none
function closeMovieDetails() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";
}

async function initializePage() {
    setBannerBackground();
    await fetchMoviesData("http://localhost:8000/api/v1/titles/", "top-rated-movies-list","",7);
    await fetchMoviesData("http://localhost:8000/api/v1/titles/", "action","Action",7);
    await fetchMoviesData("http://localhost:8000/api/v1/titles/", "animation","Animation",7);
    await fetchMoviesData("http://localhost:8000/api/v1/titles/", "adventure","Adventure",7);

    // listen the click image action and get movie id to call show movie details function
    let imageElements = document.querySelectorAll("img");
    imageElements.forEach(image => {
        image.addEventListener("click", function() {
            let movieId = this.getAttribute("data-image-id");
            showMovieDetails(movieId);
        });
    });

    let bannerButton = document.querySelector(".banner-button");
    bannerButton.addEventListener("click", function() {
            let movieId = this.getAttribute("data-button-id");
            showMovieDetails(movieId);
             });

    let closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", closeMovieDetails);
}
//listen when the DOM content is fully loaded to execute the initializePage function
document.addEventListener("DOMContentLoaded", initializePage);