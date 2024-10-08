function login() {
    window.location.href = "otp.html";  // Navigate to the OTP verification page
}
function resendOTP() {
    document.getElementById('otp-status').innerText = 'OTP Resent!';
    // Here you can add logic to send another OTP to the user's email
}

function submitOTP() {
    // Logic to verify the OTP entered
    let otp = '';
    document.querySelectorAll('.otp-box').forEach(box => {
        otp += box.value;
    });

    if (otp.length === 6) {
        document.getElementById('otp-status').innerText = 'OTP Verified!';
        // Here you can add logic to verify the OTP and navigate to the next page
        window.location.href = "main.html";
    } else {
        document.getElementById('otp-status').innerText = 'Invalid OTP!';
    }
}

function skipLogin() {
    window.location.href = "main.html";  // Navigate to the main page
}
