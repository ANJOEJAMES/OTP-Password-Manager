document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const sendOTPBtn = document.getElementById("send-otp-btn");
    const otpSection = document.getElementById("otp-section");
    const otpInput = document.getElementById("otp");
    const verifyOTPBtn = document.getElementById("verify-otp-btn");
    const passwordTableContainer = document.getElementById("password-table-container");
    const passwordTable = document.getElementById("password-table");

    function sendOTP() {
        const email = emailInput.value.trim();
        if (!email) {
            alert("Please enter a valid email.");
            return;
        }

        fetch("http://localhost:3000/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("OTP sent. Check your email.");
                otpSection.style.display = "block";
            } else {
                alert("Failed to send OTP.");
            }
        });
    }

    function verifyOTP() {
        const otp = otpInput.value.trim();
        const email = emailInput.value.trim();
    
        fetch("http://localhost:3000/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("userEmail", email); // Store user email
                window.location.href = "indexprofile.html"; // Redirect to indexprofile.html
            } else {
                alert("Invalid OTP.");
            }
        });
    }
    


    function fetchPasswords(email) {
        fetch("http://localhost:3000/get-passwords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
        .then(response => response.json())
        .then(data => {
            passwordTable.innerHTML = "";
            data.passwords.forEach(item => {
                passwordTable.innerHTML += `
                    <tr>
                        <td><a href="${item.website}" target="_blank">${item.website}</a></td>
                        <td><button onclick="showPassword('${item.password}')">Show Password</button></td>
                    </tr>
                `;
            });
            passwordTableContainer.style.display = "block";
        });
    }

    sendOTPBtn.addEventListener("click", sendOTP);
    verifyOTPBtn.addEventListener("click", verifyOTP);
});
