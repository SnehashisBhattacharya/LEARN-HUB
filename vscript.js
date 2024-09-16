document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.querySelector('.map-container');
    const img = new Image();
    img.src = 'treasure_map.jpg';
    img.onload = function() {
        document.body.style.height = `${img.height}px`; // Set body height based on image height
        mapContainer.style.height = `${img.height}px`; // Ensure the container matches the image height
    };
});
document.getElementById('marker1').addEventListener('click', function() {
    // Navigate to the desired page when marker is clicked
    window.location.href = 'sih_project/walking_animation.html';
});

