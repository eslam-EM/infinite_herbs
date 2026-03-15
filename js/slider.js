class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');

        this.currentIndex = 0;
        this.interval = null;
        this.intervalTime = 5000; // 5 seconds

        // Safety check
        if (!this.slides.length) return;

        this.init();
    }

    init() {
        this.showSlide(this.currentIndex);
        this.startAutoSlide();

        // Buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause on hover
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => this.stopAutoSlide());
            sliderContainer.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }

        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }

        this.currentIndex = index;
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
        this.resetAutoSlide();
    }

    prevSlide() {
        const prevIndex =
            this.currentIndex === 0 ?
            this.slides.length - 1 :
            this.currentIndex - 1;

        this.showSlide(prevIndex);
        this.resetAutoSlide();
    }

    goToSlide(index) {
        if (index === this.currentIndex) return;
        this.showSlide(index);
        this.resetAutoSlide();
    }

    startAutoSlide() {
        if (this.interval) return;
        this.interval = setInterval(() => this.nextSlide(), this.intervalTime);
    }

    stopAutoSlide() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// Init slider
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
});