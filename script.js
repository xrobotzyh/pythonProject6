// get all the blocks of images
const blocks = document.querySelectorAll('.slider-container');

// for every block
blocks.forEach(block => {
  const slider = block.querySelector('.slider'); // get slide element
  const images = slider.querySelectorAll('img'); //get images elements
  const arrowLeft = block.querySelector('.arrow-left'); // get arrow left icon
  const arrowRight = block.querySelector('.arrow-right'); // get arrow right icon
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
  arrowLeft.addEventListener('click',slideLeft);

  // listen click arrow right and do slide action
  arrowRight.addEventListener('click',slideRight);

});

function fetchMoviesData(baseUrl, containerId, genre,moviesCount) {
    let container = document.getElementById(containerId);
    let slider = container.querySelector(".slider");
    let moviesLoaded = 0;
    let page = 1;
    let moviesPerPage = 5;
//    while (moviesLoaded < moviesCount) {
     while (page < 3) {
        let url = baseUrl + "?genre=" + genre + "&limit=" + moviesPerPage + "&page=" + page + "&sort_by=-imdb_score";
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('movies not found'); // throw error message
                }
                return response.json();
            })
            .then(data => {
                let moviesToAdd =  Math.min(moviesCount - moviesLoaded, data.results.length);
                for (let i = 0; i < moviesToAdd; i++) {
                    let movieElement = createMovieElement(data.results[i]);
                    slider.appendChild(movieElement);
                    moviesLoaded++;
                }
            })
            .catch(error => {
                console.log(error);
            });

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
            <img src="${movie.image_url}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button class="view-details-button" data-movie-id="${movie.id}">view details</button>
        `;
    };

    image.onerror = function() {
        console.error('Image not found');
    };

    return movieElement;
}


function showMovieDetails(movieId) {
    let modal = document.getElementById("modal");
    modal.style.display = "block";

    fetch(`http://localhost:8000/api/v1/titles/${movieId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            return response.json();
        })
        .then(data => {
            let movieDetailsElement = modal.querySelector(".movie-details");
            movieDetailsElement.innerHTML = `
                <h3>${data.title}</h3>
                <p>Year: ${data.year}</p>
                <p>IMDB Score: ${data.imdb_score}</p>
                <p>Directors: ${data.directors.join(", ")}</p>
                <p>Actors: ${data.actors.join(", ")}</p>
                <p>Duration: ${data.duration}</p>
                <p>Country: ${data.countries.join(", ")}</p>
                <p>Income: ${data.worldwide_gross_income}</p>
                <p>Description: ${data.description}</p>
            `;
        })
        .catch(error => {
            console.log(error);
        });
}

function closeMovieDetails() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";
}

function initializePage() {
    fetchMoviesData("http://localhost:8000/api/v1/titles/", "banner","",1);
    fetchMoviesData("http://localhost:8000/api/v1/titles/", "top-rated-movies-list","",7);
    fetchMoviesData("http://localhost:8000/api/v1/titles/", "action","Action",7);
    fetchMoviesData("http://localhost:8000/api/v1/titles/", "animation","Animation",7);
    fetchMoviesData("http://localhost:8000/api/v1/titles/", "adventure","Adventure",7);


    let viewDetailsButtons = document.querySelectorAll(".view-details-button");
    viewDetailsButtons.forEach(button => {
        button.addEventListener("click", function() {
            let movieId = this.getAttribute("data-movie-id");
            showMovieDetails(movieId);
        });
    });


    let closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", closeMovieDetails);
}


document.addEventListener("DOMContentLoaded", initializePage);