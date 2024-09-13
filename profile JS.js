$(document).ready(function() {
    $('#id-form').submit(function(event) {
        event.preventDefault();
        const id = $('#profile-id').val();
        if (id) {
            window.location.href = `main.html?id=${id}`;
        }
    });
});
