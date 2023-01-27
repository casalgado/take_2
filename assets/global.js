class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('[id^="Slider-"]');
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');

    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    this.paginationButtons = this.querySelectorAll(
      ".slider-pagination__button"
    );

    if (!this.slider || !this.nextButton) return;

    this.initPages();

    this.slider.addEventListener("scroll", this.update.bind(this));
    this.prevButton.addEventListener("click", this.onButtonClick.bind(this));
    this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter(
      (element) => element.clientWidth > 0
    );
    if (this.sliderItemsToShow.length < 2) return;
    this.sliderItemOffset =
      this.sliderItemsToShow[1].offsetLeft -
      this.sliderItemsToShow[0].offsetLeft;
    this.slidesPerPage = Math.floor(
      (this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) /
        this.sliderItemOffset
    );
    this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;

    if (this.paginationButtons.length > 0)
      this.paginationButtons[0].classList.add("is-active");

    this.update();
  }

  update() {
    // Temporarily prevents unneeded updates resulting from variant changes
    // This should be refactored as part of https://github.com/Shopify/dawn/issues/2057
    if (!this.slider || !this.nextButton) return;

    if (
      this.isSlideVisible(this.sliderItemsToShow[0]) &&
      this.slider.scrollLeft === 0
    ) {
      this.prevButton.setAttribute("disabled", "disabled");
    } else {
      this.prevButton.removeAttribute("disabled");
    }

    if (
      this.isSlideVisible(
        this.sliderItemsToShow[this.sliderItemsToShow.length - 1]
      )
    ) {
      this.nextButton.setAttribute("disabled", "disabled");
    } else {
      this.nextButton.removeAttribute("disabled");
    }
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide =
      this.slider.clientWidth + this.slider.scrollLeft - offset + 1;
    return (
      element.offsetLeft + element.clientWidth <= lastVisibleSlide &&
      element.offsetLeft >= this.slider.scrollLeft - 1
    );
  }

  setActivePaginationButton() {
    const numberOfItems = this.sliderItems.length;
    // first determine which pagination button should be active
    let activePaginationButton = 0;
    let scrollPosition = Math.floor(this.slideScrollPosition) || 0;

    for (let i = 0; i < numberOfItems; i++) {
      if (scrollPosition <= this.sliderItemOffset * i) {
        activePaginationButton = i;
        break;
      }
      activePaginationButton = i;
    }

    // then set the styles
    if (this.paginationButtons.length > 0) {
      for (let i = 0; i < this.paginationButtons.length; i++) {
        const paginationButton = this.paginationButtons[i];
        if (activePaginationButton == i) {
          paginationButton.classList.add("is-active");
        } else {
          paginationButton.classList.remove("is-active");
        }
      }
    }
  }

  onButtonClick(event) {
    event.preventDefault();

    const step = event.currentTarget.dataset.step || 1;
    this.slideScrollPosition =
      event.currentTarget.name === "next"
        ? this.slider.scrollLeft + step * this.sliderItemOffset
        : this.slider.scrollLeft - step * this.sliderItemOffset;
    this.slider.scrollTo({
      left: this.slideScrollPosition,
    });

    this.setActivePaginationButton();
  }
}

customElements.define("slider-component", SliderComponent);
