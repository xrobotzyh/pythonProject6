// get all the blocks of images
const blocks = document.querySelectorAll(".slider-container");

// for every block
blocks.forEach(block => {
  const slider = block.querySelector(".slider"); // get slide element
  const images = slider.querySelectorAll("img"); //get images elements
  const arrowLeft = block.querySelector(".arrow-left"); // get arrow left icon
  const arrowRight = block.querySelector(".arrow-right"); // get arrow right icon
  const sliderWidth = slider.offsetWidth;
  const imageWidth = images[0].offsetWidth; // get single image width
  const maxIndex = images.length - 1;

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

  // listen click arrow left and do slide action
  arrowLeft.addEventListener("click",slideLeft);

  // listen click arrow right and do slide action
  arrowRight.addEventListener("click",slideRight);

});

async function fetchMoviesData(baseUrl, containerId, genre, moviesCount) {
  let container = document.getElementById(containerId);
  let slider = container.querySelector(".slider");
  let moviesLoaded = 0;
  let page = 1;
  let moviesPerPage = 5;

  while (page < 3) {
    let url = baseUrl + "?genre=" + genre + "&limit=" + moviesPerPage + "&page=" + page + "&sort_by=-imdb_score";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("movies not found");
      }

      const data = await response.json();

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

    let image = new Image();
    image.src = movie.image_url;

    image.onload = function() {
        movieElement.innerHTML = `
            <img src="${movie.image_url}" alt="${movie.title}" data-image-id="${movie.id}">
            <h3>${movie.title}</h3>
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

  modal.style.display = "block";
}


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

    // get moiveid and call the showmoviedetails function
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

document.addEventListener("DOMContentLoaded", initializePage);