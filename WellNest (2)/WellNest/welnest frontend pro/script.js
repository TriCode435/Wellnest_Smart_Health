const textElement = document.getElementById("typing-text");
const words = ["Weightlifting", "Bodybuilding", "Powerlifting"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Word type panni mudichathum 2 seconds wait pannum
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}
// AOS initialize


// Browser load aanathum function start aagum
document.addEventListener("DOMContentLoaded", typeEffect);
// AOS initialize
AOS.init({
    duration: 1000, // animation speed
    once: true      // oru vaati scroll panna pothum
});