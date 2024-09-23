document.getElementById('idForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const requestId = document.getElementById('requestId').value;

    // Redirect to the details page with query parameter
    window.location.href = `reqDetail.html?requestId=${requestId}`;
});
