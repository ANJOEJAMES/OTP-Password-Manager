document.addEventListener("DOMContentLoaded", function () {
  // Get references to elements
  const emailInput = document.getElementById("email");
  const sendOTPBtn = document.getElementById("send-otp-btn");
  const otpContainer = document.getElementById("otp-container");
  const otpInput = document.getElementById("otp");
  const verifyOTPBtn = document.getElementById("verify-otp-btn");

  function sendOTP() {
    const email = emailInput.value.trim();

    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    sendOTPBtn.disabled = true; // Disable button to prevent multiple clicks

    fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "OTP sent successfully") {
          alert(`OTP sent to ${email}`);
          otpContainer.style.display = "block"; // Show OTP field
        } else {
          alert("Failed to send OTP. Try again.");
        }
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        alert("Error sending OTP. Check console for details.");
      })
      .finally(() => {
        setTimeout(() => {
          sendOTPBtn.disabled = false; // Re-enable button after 30 seconds
        }, 30000);
      });
  }

  function verifyOTP() {
    const otp = otpInput.value.trim();
    const email = emailInput.value.trim();

    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("OTP verified successfully! Login successful.");

          // Store user email in localStorage for session management
          localStorage.setItem("userEmail", data.email || email);

          // Redirect to the page specified by backend
          window.location.href = data.redirect;
        } else {
          alert("Invalid OTP. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        alert("Error verifying OTP.");
      });
  }

  // Attach event listeners
  sendOTPBtn.addEventListener("click", sendOTP);
  verifyOTPBtn.addEventListener("click", verifyOTP);
});
