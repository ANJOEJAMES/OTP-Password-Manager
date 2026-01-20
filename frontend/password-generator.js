document.addEventListener("DOMContentLoaded", function () {
  const generateBtn = document.getElementById("generate-btn");
  const copyBtn = document.getElementById("copy-btn");
  const saveBtn = document.getElementById("save-btn");
  const passwordInput = document.getElementById("generated-password");

  function generatePassword() {
    const length = parseInt(document.getElementById("length").value, 10);
    const includeUppercase = document.getElementById("uppercase").checked;
    const includeLowercase = document.getElementById("lowercase").checked;
    const includeNumbers = document.getElementById("numbers").checked;
    const includeSymbols = document.getElementById("symbols").checked;
    const mandatoryString = document.getElementById("mandatory-string").value; // Get user-defined string

    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/";

    let allowedChars = "";
    if (includeUppercase) allowedChars += uppercaseChars;
    if (includeLowercase) allowedChars += lowercaseChars;
    if (includeNumbers) allowedChars += numberChars;
    if (includeSymbols) allowedChars += symbolChars;

    if (allowedChars === "") {
      alert("Please select at least one character type.");
      return;
    }

    if (mandatoryString.length > length) {
      alert("The mandatory string is longer than the password length.");
      return;
    }

    let passwordArray = new Array(length);

    // Fill the password with random characters first
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      passwordArray[i] = allowedChars[randomIndex];
    }

    // Insert the mandatory string at a random position
    const startIndex = Math.floor(Math.random() * (length - mandatoryString.length + 1));
    for (let i = 0; i < mandatoryString.length; i++) {
      passwordArray[startIndex + i] = mandatoryString[i];
    }

    passwordInput.value = passwordArray.join("");
    sessionStorage.setItem("savedPassword", passwordInput.value);

  }

  function copyPassword() {
    if (!passwordInput.value) {
      alert("⚠️ No password to copy. Please generate one first.");
      return;
    }

    passwordInput.select();
    passwordInput.setSelectionRange(0, 99999); // For mobile devices

    try {
      document.execCommand("copy");
      alert("✅ Password copied to clipboard!");
    } catch (err) {
      console.error("❌ Copy failed:", err);
      alert("❌ Failed to copy password. Try manually selecting and copying.");
    }

    // Deselect the input after copying
    window.getSelection().removeAllRanges();
  }

  function saveToProfile() {
    const password = passwordInput.value;
    if (!password) {
      alert("Generate a password first.");
      return;
    }
    // Store password in sessionStorage and redirect to indexprofile.html
    sessionStorage.setItem("savedPassword", password);
    window.location.href = "indexprofile.html";
  }

  generateBtn.addEventListener("click", generatePassword);
  copyBtn.addEventListener("click", copyPassword);
  saveBtn.addEventListener("click", saveToProfile);
});
