document.addEventListener("DOMContentLoaded", function () {
    const passwordTable = document.getElementById("password-table");
    const savePasswordBtn = document.getElementById("save-password-btn");
    const addPasswordBtn = document.getElementById("add-password-btn");
    const addPasswordSection = document.getElementById("add-password-section");
    const websiteInput = document.getElementById("website");
    const passwordInput = document.getElementById("password");
    const generatePasswordBtn = document.getElementById("generate-password-btn");
    const copyPasswordBtn = document.getElementById("copy-password-btn");
    const logoutBtn = document.getElementById("logout-btn");

    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        alert("No user logged in. Redirecting to login...");
        window.location.href = "index.html"; // Fixed: redirect to index.html instead of login.html
    } else {
        fetchPasswords(userEmail);
    }

    // Logout functionality
    logoutBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("userEmail");
            sessionStorage.clear();
            window.location.href = "index.html";
        }
    });

    async function fetchPasswords(email) {
        try {
            const response = await fetch("http://localhost:3000/get-passwords", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Failed to fetch passwords");
            }

            passwordTable.innerHTML = "";

            data.passwords.forEach((item, index) => {
                const formattedWebsite = formatURL(item.website);
                const savedPassword = item.password;

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td><a href="${formattedWebsite}" target="_blank">${formattedWebsite}</a></td>
                    <td>
                        <input type="password" id="password-${index}" value="${savedPassword}" readonly>
                        <button class="toggle-password" data-index="${index}">👁 Show</button>
                        <button class="copy-password" data-index="${index}">📋 Copy</button>
                        <button class="delete-password" data-id="${item.id}" data-user-id="${item.user_id}">🗑 Delete</button>
                    </td>
                `;

                passwordTable.appendChild(row);
            });

            document.querySelectorAll(".toggle-password").forEach(button => {
                button.addEventListener("click", function () {
                    togglePassword(this.dataset.index);
                });
            });

            document.querySelectorAll(".copy-password").forEach(button => {
                button.addEventListener("click", function () {
                    copyToClipboard(`password-${this.dataset.index}`);
                });
            });

            document.querySelectorAll(".delete-password").forEach(button => {
                button.addEventListener("click", function () {
                    const passwordId = this.getAttribute("data-id");
                    const userId = this.getAttribute("data-user-id");
                    deletePassword(passwordId, userId);
                });
            });

        } catch (error) {
            console.error("Error fetching passwords:", error);
            alert("Error fetching passwords. Please try again.");
        }
    }

    async function deletePassword(passwordId, userId) {
        if (!passwordId || !userId) {
            alert("Error: Invalid password ID or user ID.");
            return;
        }

        if (!confirm("Are you sure you want to delete this password?")) return;

        try {
            const response = await fetch("http://localhost:3000/delete-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, passwordId }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Password deleted successfully!");
                fetchPasswords(userEmail);
            } else {
                alert("Failed to delete password: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting password:", error);
            alert("Error deleting password. Please try again.");
        }
    }

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
            return "";
        }

        if (mandatoryString.length > length) {
            alert("The mandatory string is longer than the password length.");
            return "";
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

        const generatedPassword = passwordArray.join("");
        sessionStorage.setItem("savedPassword", generatedPassword);

        return generatedPassword; // ✅ Return the generated password
    }

    addPasswordBtn.addEventListener("click", function () {
        // Check if there's a saved password from password-generator.html
        const savedPassword = sessionStorage.getItem("savedPassword");

        if (savedPassword) {
            // If password exists, just show the form with the password pre-filled
            addPasswordSection.style.display = "block";
            passwordInput.value = savedPassword;

            // Hide the password generation options since we already have a password
            const lengthLabel = document.querySelector('label[for="length"]');
            const mandatoryLabel = document.querySelector('label[for="mandatory-string"]');
            const optionsHeading = document.querySelector('#add-password-section h3');

            document.getElementById("length").style.display = "none";
            if (lengthLabel) lengthLabel.style.display = "none";

            document.querySelectorAll(".checkbox-group").forEach(el => el.style.display = "none");
            if (optionsHeading && optionsHeading.textContent.includes("Password Options")) {
                optionsHeading.style.display = "none";
            }

            document.getElementById("mandatory-string").style.display = "none";
            if (mandatoryLabel) mandatoryLabel.style.display = "none";

            document.getElementById("generate-password-btn").style.display = "none";

            // Focus on website input for user convenience
            websiteInput.focus();
        } else {
            // Normal flow - generate a new password
            addPasswordSection.style.display = "block";
            passwordInput.value = generatePassword();

            // Show all password generation options
            const lengthLabel = document.querySelector('label[for="length"]');
            const mandatoryLabel = document.querySelector('label[for="mandatory-string"]');
            const optionsHeading = document.querySelector('#add-password-section h3');

            document.getElementById("length").style.display = "block";
            if (lengthLabel) lengthLabel.style.display = "block";

            document.querySelectorAll(".checkbox-group").forEach(el => el.style.display = "flex");
            if (optionsHeading) optionsHeading.style.display = "block";

            document.getElementById("mandatory-string").style.display = "block";
            if (mandatoryLabel) mandatoryLabel.style.display = "block";

            document.getElementById("generate-password-btn").style.display = "inline-block";
        }
    });

    savePasswordBtn.addEventListener("click", async function () {
        let website = websiteInput.value.trim();
        const password = passwordInput.value.trim();

        if (!website || !password) {
            alert("Please enter both website and password.");
            return;
        }

        website = formatURL(website);

        try {
            const response = await fetch("http://localhost:3000/save-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, website, password }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Password saved successfully!");
                fetchPasswords(userEmail);
                addPasswordSection.style.display = "none";

                // Clear the saved password from sessionStorage
                sessionStorage.removeItem("savedPassword");

                // Reset the form
                websiteInput.value = "";
                passwordInput.value = "";

                // Reset visibility of password generation options
                const lengthLabel = document.querySelector('label[for="length"]');
                const mandatoryLabel = document.querySelector('label[for="mandatory-string"]');
                const optionsHeading = document.querySelector('#add-password-section h3');

                document.getElementById("length").style.display = "block";
                if (lengthLabel) lengthLabel.style.display = "block";

                document.querySelectorAll(".checkbox-group").forEach(el => el.style.display = "flex");
                if (optionsHeading) optionsHeading.style.display = "block";

                document.getElementById("mandatory-string").style.display = "block";
                if (mandatoryLabel) mandatoryLabel.style.display = "block";

                document.getElementById("generate-password-btn").style.display = "inline-block";
            } else {
                alert("Failed to save password.");
            }
        } catch (error) {
            console.error("Error saving password:", error);
            alert("Error saving password. Please try again.");
        }
    });

    function togglePassword(index) {
        const passwordField = document.getElementById(`password-${index}`);
        if (passwordField.type === "password") {
            passwordField.type = "text";
            document.querySelector(`[data-index="${index}"]`).textContent = "🙈 Hide";
        } else {
            passwordField.type = "password";
            document.querySelector(`[data-index="${index}"]`).textContent = "👁 Show";
        }
    }

    function copyToClipboard(id) {
        const passwordField = document.getElementById(id);

        if (!passwordField) {
            alert("Error: Password field not found!");
            console.error("Element not found:", id);
            return;
        }

        const passwordText = passwordField.value;

        if (!passwordText) {
            alert("No password to copy!");
            return;
        }

        // Check if navigator.clipboard is available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(passwordText)
                .then(() => alert("Password copied to clipboard!"))
                .catch(err => {
                    console.error("Clipboard copy failed:", err);
                    fallbackCopyText(passwordField);
                });
        } else {
            // Fallback method for older browsers
            fallbackCopyText(passwordField);
        }
    }

    // Fallback function using select() + execCommand("copy")
    function fallbackCopyText(inputElement) {
        inputElement.select();
        inputElement.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand("copy");
            alert("Password copied (fallback method)!");
        } catch (err) {
            console.error("Fallback copy failed:", err);
            alert("Failed to copy password. Please copy manually.");
        }
    }

    // ✅ Fix the event listener for the Copy button
    document.querySelectorAll(".copy-password").forEach(button => {
        button.addEventListener("click", function () {
            const passwordId = `password-${this.dataset.index}`; // Get correct field ID
            copyToClipboard(passwordId);
        });
    });

    generatePasswordBtn.addEventListener("click", function () {
        const newPassword = generatePassword(); // ✅ Now it returns the password
        if (newPassword) {
            passwordInput.value = newPassword; // ✅ Correctly set the input field value
        }
    });

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

    copyPasswordBtn.addEventListener("click", copyPassword);

    function formatURL(url) {
        return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    }


});

