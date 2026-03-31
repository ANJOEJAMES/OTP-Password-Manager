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
            const response = await fetch("/api/get-passwords", {
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

            // Dashboard Elements
            const modal = document.getElementById("add-password-modal");
            const closeModalBtn = document.getElementById("close-modal-btn");
            const cancelBtn = document.getElementById("cancel-btn");

            // Form Elements
            const lengthRange = document.getElementById("length-range");
            const lengthInput = document.getElementById("length");
            const searchInput = document.getElementById("search-passwords");
            const userEmailDisplay = document.getElementById("user-email-display");
            const totalCountDisplay = document.getElementById("total-count");

            if (!userEmail) {
                alert("No user logged in. Redirecting to login...");
                window.location.href = "index.html";
            } else {
                userEmailDisplay.textContent = userEmail;
                fetchPasswords(userEmail);
            }

            // Modal Logic
            function openModal() {
                modal.classList.remove("hidden");
                // Check for saved password from generator page
                const savedPassword = sessionStorage.getItem("savedPassword");
                if (savedPassword) {
                    passwordInput.value = savedPassword;
                    sessionStorage.removeItem("savedPassword"); // Clear it
                } else {
                    // Generate a fresh one if empty
                    if (!passwordInput.value) passwordInput.value = generatePassword();
                }
                websiteInput.focus();
            }

            function closeModal() {
                modal.classList.add("hidden");
                // Reset to generate mode
                setPasswordMode('generate');
                // Clear inputs
                websiteInput.value = "";
                passwordInput.value = "";
                document.getElementById("manual-password").value = "";
            }

            addPasswordBtn.addEventListener("click", openModal);
            closeModalBtn.addEventListener("click", closeModal);
            cancelBtn.addEventListener("click", closeModal);

            // Password Mode Toggle
            const modeBtns = document.querySelectorAll(".mode-btn");
            const generatorSection = document.getElementById("generator-section");
            const manualSection = document.getElementById("manual-password-section");
            const manualPasswordInput = document.getElementById("manual-password");
            const toggleManualVisibility = document.getElementById("toggle-manual-visibility");

            function setPasswordMode(mode) {
                modeBtns.forEach(btn => {
                    if (btn.dataset.mode === mode) {
                        btn.classList.add("active");
                    } else {
                        btn.classList.remove("active");
                    }
                });

                if (mode === "generate") {
                    generatorSection.classList.remove("hidden");
                    manualSection.classList.add("hidden");
                } else {
                    generatorSection.classList.add("hidden");
                    manualSection.classList.remove("hidden");
                    manualPasswordInput.focus();
                }
            }

            modeBtns.forEach(btn => {
                btn.addEventListener("click", () => setPasswordMode(btn.dataset.mode));
            });

            // Toggle manual password visibility
            toggleManualVisibility.addEventListener("click", function () {
                if (manualPasswordInput.type === "password") {
                    manualPasswordInput.type = "text";
                    this.textContent = "🙈";
                } else {
                    manualPasswordInput.type = "password";
                    this.textContent = "👁️";
                }
            });

            // Sync Length Range and Number Input
            lengthRange.addEventListener("input", (e) => lengthInput.value = e.target.value);
            lengthInput.addEventListener("input", (e) => lengthRange.value = e.target.value);

            // Logout
            logoutBtn.addEventListener("click", function () {
                if (confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem("userEmail");
                    sessionStorage.clear();
                    window.location.href = "index.html";
                }
            });

            async function fetchPasswords(email) {
                try {
                    const response = await fetch("/api/get-passwords", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                    });

                    const data = await response.json();
                    if (data.success) {
                        renderPasswords(data.passwords);
                        updateStats(data.passwords.length);
                    } else {
                        console.error("Failed to fetch passwords");
                    }
                } catch (error) {
                    console.error("Error fetching passwords:", error);
                }
            }

            function renderPasswords(passwords) {
                const passwordTable = document.getElementById("password-table");
                passwordTable.innerHTML = "";

                if (passwords.length === 0) {
                    const emptyRow = document.createElement("tr");
                    emptyRow.innerHTML = `
                <td colspan="3">
                    <div class="empty-state">
                        <div class="empty-icon">📭</div>
                        <div class="empty-text">
                            <h3>No passwords yet</h3>
                            <p>Click "Add Password" to secure your first account.</p>
                        </div>
                    </div>
                </td>
            `;
                    passwordTable.appendChild(emptyRow);
                    return;
                }

                passwords.forEach((item) => {
                    const domain = new URL(item.website).hostname;
                    // Use Google's favicon service or a generic icon on error
                    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

                    const row = document.createElement("tr");
                    row.innerHTML = `
                <td>
                    <div class="website-cell">
                        <div class="favicon-wrapper">
                            <img src="${faviconUrl}" alt="icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDggLTggOHoiLz48L3N2Z24+='">
                        </div>
                        <div class="website-info">
                            <span class="website-name">${domain}</span>
                            <a href="${item.website}" target="_blank" class="website-url">${item.website}</a>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="password-cell">
                        <input type="password" value="${item.password}" readonly class="password-text" id="pass-${item.id}">
                        <button class="action-btn toggle" onclick="togglePasswordVisibility('${item.id}')" title="Show/Hide">
                            👁️
                        </button>
                    </div>
                </td>
                <td>
                    <div class="actions-cell">
                        <button class="action-btn copy" onclick="copyToClipboard('${item.password}', this)" title="Copy Password">
                            📋
                        </button>
                        <button class="action-btn delete" onclick="confirmDelete('${item.user_id}', '${item.id}')" title="Delete">
                            🗑️
                        </button>
                    </div>
                </td>
            `;
                    passwordTable.appendChild(row);
                });
            }

            // Expose functions to window scope for onclick handlers
            window.togglePasswordVisibility = function (id) {
                const input = document.getElementById(`pass-${id}`);
                const btn = input.nextElementSibling; // The toggle button
                if (input.type === "password") {
                    input.type = "text";
                    btn.textContent = "🙈"; // Eye slash
                } else {
                    input.type = "password";
                    btn.textContent = "👁️"; // Eye
                }
            }

            window.copyToClipboard = function (text, btnElement) {
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = btnElement.textContent;
                    btnElement.textContent = "✅";
                    btnElement.classList.add("success");
                    setTimeout(() => {
                        btnElement.textContent = originalText;
                        btnElement.classList.remove("success");
                    }, 1500);
                });
            }

            window.confirmDelete = async function (userId, passwordId) {
                if (confirm("Are you sure you want to delete this password permanently?")) {
                    await deletePassword(userId, passwordId);
                }
            }

            function updateStats(count) {
                totalCountDisplay.textContent = count;
                // Logic for security score could go here
            }

            // Search Functionality
            searchInput.addEventListener("input", (e) => {
                const term = e.target.value.toLowerCase();
                const rows = document.querySelectorAll("#password-table tr");
                rows.forEach(row => {
                    const website = row.querySelector("a")?.textContent.toLowerCase() || "";
                    if (website.includes(term)) {
                        row.style.display = "";
                    } else {
                        row.style.display = "none";
                    }
                });
            });

            // Save Password Logic
            savePasswordBtn.addEventListener("click", async function () {
                const website = websiteInput.value.trim();

                // Check which mode is active
                const isManualMode = !manualSection.classList.contains("hidden");
                const password = isManualMode
                    ? manualPasswordInput.value.trim()
                    : passwordInput.value;

                if (!website) {
                    alert("Please enter a website or app name.");
                    return;
                }

                if (!password) {
                    const modeText = isManualMode ? "enter a password" : "generate a password";
                    alert(`Please ${modeText}.`);
                    return;
                }

                const email = localStorage.getItem("userEmail");

                try {
                    const response = await fetch("/api/save-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, website, password }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert("Password saved successfully!");
                        fetchPasswords(email);
                        closeModal();
                    } else {
                        alert("Failed to save password.");
                    }
                } catch (error) {
                    console.error("Error saving password:", error);
                    alert("Error saving password. Please try again.");
                }
            });

            // Generate Password Function
            function generatePassword() {
                const length = parseInt(document.getElementById("length").value);
                const includeUppercase = document.getElementById("uppercase").checked;
                const includeLowercase = document.getElementById("lowercase").checked;
                const includeNumbers = document.getElementById("numbers").checked;
                const includeSymbols = document.getElementById("symbols").checked;
                const mandatoryString = document.getElementById("mandatory-string").value;

                const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
                const numberChars = "0123456789";
                const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

                let charPool = "";
                if (includeUppercase) charPool += uppercaseChars;
                if (includeLowercase) charPool += lowercaseChars;
                if (includeNumbers) charPool += numberChars;
                if (includeSymbols) charPool += symbolChars;

                if (charPool === "") {
                    alert("Please select at least one character type.");
                    return "";
                }

                let password = "";
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * charPool.length);
                    password += charPool[randomIndex];
                }

                if (mandatoryString) {
                    const insertIndex = Math.floor(Math.random() * (password.length + 1));
                    password = password.slice(0, insertIndex) + mandatoryString + password.slice(insertIndex);
                }

                return password;
            }

            generatePasswordBtn.addEventListener("click", () => {
                passwordInput.value = generatePassword();
            });

            copyPasswordBtn.addEventListener("click", () => {
                if (!passwordInput.value) return;
                navigator.clipboard.writeText(passwordInput.value).then(() => {
                    const originalText = copyPasswordBtn.textContent;
                    copyPasswordBtn.textContent = "✅";
                    setTimeout(() => copyPasswordBtn.textContent = originalText, 1500);
                });
            });

            async function deletePassword(userId, passwordId) {
                try {
                    const response = await fetch("/api/delete-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId, passwordId }),
                    });

                    const result = await response.json();
                    if (result.success) {
                        fetchPasswords(userEmail); // Refresh list
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error("Error deleting password:", error);
                }
            }
        } catch (error) {
            console.error("Error fetching passwords:", error);
            alert("Error fetching passwords. Please try again.");
        }
    }

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

