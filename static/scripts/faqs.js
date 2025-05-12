// Toggle the visibility of answers
function toggleAnswer(element) {
    const answer = element.nextElementSibling; // Select the answer div
    if (answer.style.display === "block") {
        answer.style.display = "none"; // Hide the answer if it is currently visible
    } else {
        answer.style.display = "block"; // Show the answer if it is hidden
    }
}
