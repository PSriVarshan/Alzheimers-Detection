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
