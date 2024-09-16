// Ensure GSAP and ScrollTrigger plugins are registered
gsap.registerPlugin(ScrollTrigger);

// Get all panel sections
let sections = gsap.utils.toArray(".panel");

// Create the horizontal scrolling tween
let scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
        trigger: ".container",
        pin: true,
        scrub: 0.1,
        end: "+=3000", // Adjust based on content length
        markers: true // Set to true to debug, false for production
    }
});
 
// Initial setup for boxes
gsap.set(".box", { y: 100 }); // Ensure all boxes start at the same initial position

// Apply animations for each box individually
gsap.utils.toArray(".box").forEach((box, index) => {
    gsap.to(box, {
        y: -130,
        duration: 2,
        ease: "elastic",
        scrollTrigger: {
            trigger: box,
            containerAnimation: scrollTween,
            start: "left center", // Adjust this based on your needs
            toggleActions: "play none none reset",
            id: `boxAnimation-${index + 1}` // Unique ID for each animation
        }
    });
});

// Example for special cases
ScrollTrigger.create({
    trigger: ".box-3",
    containerAnimation: scrollTween,
    toggleClass: "active",
    start: "center 60%",
    id: "3"
});

// Green section callbacks
ScrollTrigger.create({
    trigger: ".green",
    containerAnimation: scrollTween,
    start: "center 65%",
    end: "center 51%",
    onEnter: () => console.log("enter"),
    onLeave: () => console.log("leave"),
    onEnterBack: () => console.log("enterBack"),
    onLeaveBack: () => console.log("leaveBack"),
    onToggle: self => console.log("active", self.isActive),
    id: "4"
});

// Only show the relevant section's markers at any given time
gsap.set(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end", { autoAlpha: 0 });
["red", "gray", "purple", "green"].forEach((triggerClass, i) => {
    ScrollTrigger.create({
        trigger: "." + triggerClass,
        containerAnimation: scrollTween,
        start: "left 30%",
        end: i === 3 ? "right right" : "right 30%",
        markers: false,
        onToggle: self => gsap.to(".marker-" + (i + 1), { duration: 0.25, autoAlpha: self.isActive ? 1 : 0 })
    });
});




setInterval(toggleStars, 1000); // Check every second

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');

    // Function to handle scroll behavior
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');  // Add a class for when scrolled
        } else {
            navbar.classList.remove('scrolled');  // Remove class when back to top
        }
    });

    // Preserve hover effect by detecting mouse enter and leave
    navbar.addEventListener('mouseenter', function() {
        navbar.classList.add('hovered');
    });

    navbar.addEventListener('mouseleave', function() {
        navbar.classList.remove('hovered');
    });
});

function generateStars() {
    const starContainer = document.getElementById('stars');
    const numStars = 100; // Number of stars
    starContainer.innerHTML = ''; // Clear previous stars
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        starContainer.appendChild(star);
    }
}

// Function to show or hide stars depending on the time of day
function toggleStars() {
    const stars = document.getElementById('stars');
    const currentTime = new Date().getSeconds() % 30; // Cycle every 30 seconds
    if (currentTime > 15) { // Simulating night from 60% of cycle onwards
        stars.style.display = 'block';
        generateStars();
    } else {
        stars.style.display = 'none';
    }
}

setInterval(toggleStars, 1000); // Check every second





const audio = document.getElementById('background-audio');
const unmuteBtn = document.getElementById('unmute-btn');

// Function to toggle audio play/pause
function toggleAudio() {
    if (audio.paused) {
        audio.muted = false;
        audio.volume = 0.3; // Set the volume
        audio.play().catch(error => {
            console.log('Audio play was blocked:', error);
        });
        unmuteBtn.textContent = '🔊'; // Update button text
    } else {
        audio.pause(); // Pause the audio
        audio.currentTime = 0; // Optional: reset to the start
        unmuteBtn.textContent = '🔇'; // Update button text
    }
}

// Play or pause audio when the button is clicked
unmuteBtn.addEventListener('click', toggleAudio);

// Ensure the audio element is initially set up
window.addEventListener('load', function() {
    // Set button text based on initial audio state
    unmuteBtn.textContent = '🔇'; // Set to '🔇' as default
    // Attach an event listener to start audio on user interaction
    document.body.addEventListener('click', function() {
        if (audio.paused) {
            audio.muted = false;
            audio.volume = 0.3; // Set the volume
            audio.play().catch(error => {
                console.log('Audio play was blocked:', error);
            });
            unmuteBtn.textContent = '🔊'; // Update button text
        }
        document.body.removeEventListener('click', arguments.callee); // Remove listener after first click
    }, { once: true }); // Ensure it only runs once
});
