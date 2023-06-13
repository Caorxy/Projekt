//const boomSound = new Audio('assets/boom.wav');

function playBoom() {
    //boomSound.play();
}
  
function animateBoom(alien) {
    // Create a new element for the animation
    const boom = document.createElement('div'); // Add 'div' here
    // Set the position and size of the element to match the alien
    boom.style.position = 'absolute';
    boom.style.left = alien.x + canvas.offsetLeft + 'px';
    boom.style.top = alien.y + canvas.offsetTop + 'px';
    boom.style.width = '32px';
    boom.style.height = '28px';
    // Set the background image to the alien image
    if(alien instanceof AlienX){
        boom.style.backgroundImage = 'url(frontend/assets/alienX.png)';
    } else {
        boom.style.backgroundImage = 'url(frontend/assets/alien.png)';
    }
    // Set the initial opacity and scale of the element
    boom.style.opacity = '1';
    boom.style.transform = 'scale(1)';
    // Add a class name for the animation
    boom.className = 'boom';
    // Append the element to the body
    document.body.appendChild(boom);
    // Remove the element after the animation ends
setTimeout(function() {
    document.body.removeChild(boom);
    animations--;
}, 500);
}
