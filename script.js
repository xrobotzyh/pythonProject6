
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