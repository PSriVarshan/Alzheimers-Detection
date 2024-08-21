/* Login form */
document.addEventListener('DOMContentLoaded', () => {
    const passwordField = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');

    togglePassword.addEventListener('click', () => {
        // Toggle the type attribute of the password field
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);

        // Toggle the eye icon
        const icon = type === 'password' ? 'fa-eye' : 'fa-eye-slash';
        togglePassword.innerHTML = `<i class="fas ${icon}"></i>`;
    });
});

/* Sparkle effect */
function spark(event) {
    let i = document.createElement("i");

    // Set the position of the element based on the mouse event
    i.style.position = "absolute"; // Ensure the element is positioned absolutely
    i.style.left = event.pageX + "px";
    i.style.top = event.pageY + "px";

    // Randomly scale the element
    i.style.transform = `scale(${Math.random() * 2 + 1})`;

    // Set random transition values
    i.style.setProperty("--x", getRandomTransitionValue());
    i.style.setProperty("--y", getRandomTransitionValue());

    document.body.appendChild(i);

    // Remove the element after 2 seconds
    setTimeout(() => {
        document.body.removeChild(i);
    }, 2000);
}

function getRandomTransitionValue() {
    // Generate a random value between -200 and 200 pixels
    return `${Math.random() * 400 - 200}px`;
}

// Add event listener to track mouse movements and create spark effect
document.addEventListener("mousemove", spark);