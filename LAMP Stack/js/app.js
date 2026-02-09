// API Base URL
const API_URL = "/LAMPAPI";

// User session data
let userId = 0;
let firstName = "";
let lastName = "";

// ============ Authentication Functions ============

function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
    clearMessages();
}

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    clearMessages();
}

function clearMessages() {
    document.getElementById("loginResult").textContent = "";
    document.getElementById("loginResult").className = "message";
    document.getElementById("registerResult").textContent = "";
    document.getElementById("registerResult").className = "message";
}

async function doLogin() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const resultEl = document.getElementById("loginResult");

    if (!username || !password) {
        resultEl.textContent = "Please enter username and password";
        resultEl.className = "message error";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/Login.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: username, password: password })
        });

        const data = await response.json();

        if (data.error && data.error !== "") {
            resultEl.textContent = data.error;
            resultEl.className = "message error";
        } else {
            // Store user data
            userId = data.id;
            firstName = data.firstName;
            lastName = data.lastName;

            // Save to cookie
            saveCookie();

            // Show contacts section
            showContactsSection();
        }
    } catch (error) {
        resultEl.textContent = "Connection error. Please try again.";
        resultEl.className = "message error";
        console.error("Login error:", error);
    }
}

async function doRegister() {
    const first = document.getElementById("regFirstName").value.trim();
    const last = document.getElementById("regLastName").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;
    const resultEl = document.getElementById("registerResult");

    if (!first || !last || !username || !password) {
        resultEl.textContent = "Please fill in all fields";
        resultEl.className = "message error";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/Register.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: first,
                lastName: last,
                login: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.error && data.error !== "") {
            resultEl.textContent = data.error;
            resultEl.className = "message error";
        } else {
            resultEl.textContent = "Registration successful! Please login.";
            resultEl.className = "message success";

            // Clear form
            document.getElementById("regFirstName").value = "";
            document.getElementById("regLastName").value = "";
            document.getElementById("regUsername").value = "";
            document.getElementById("regPassword").value = "";

            // Switch to login after 1.5 seconds
            setTimeout(showLogin, 1500);
        }
    } catch (error) {
        resultEl.textContent = "Connection error. Please try again.";
        resultEl.className = "message error";
        console.error("Registration error:", error);
    }
}

function doLogout() {
    // Clear user data
    userId = 0;
    firstName = "";
    lastName = "";

    // Clear cookie
    document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Show auth section
    document.getElementById("authSection").style.display = "flex";
    document.getElementById("contactsSection").style.display = "none";

    // Clear login form
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
    clearMessages();
}

// ============ Cookie Functions ============

function saveCookie() {
    const minutes = 20;
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = `userData=${userId},${firstName},${lastName}; expires=${date.toUTCString()}; path=/`;
}

function readCookie() {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const parts = cookie.trim().split("=");
        if (parts[0] === "userData" && parts[1]) {
            const data = parts[1].split(",");
            if (data.length >= 3 && data[0] !== "0" && data[0] !== "") {
                userId = parseInt(data[0]);
                firstName = data[1];
                lastName = data[2];
                return true;
            }
        }
    }
    return false;
}

// ============ UI Functions ============

function showContactsSection() {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("contactsSection").style.display = "block";
    document.getElementById("welcomeUser").textContent = `Welcome, ${firstName} ${lastName}`;

    // Load contacts
    searchContacts();
}

// ============ Contact Functions ============

async function addContact() {
    const first = document.getElementById("addFirstName").value.trim();
    const last = document.getElementById("addLastName").value.trim();
    const phone = document.getElementById("addPhone").value.trim();
    const email = document.getElementById("addEmail").value.trim();
    const resultEl = document.getElementById("addResult");

    if (!first || !last) {
        resultEl.textContent = "First and last name are required";
        resultEl.className = "message error";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/AddContact.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: first,
                lastName: last,
                phone: phone,
                email: email,
                userId: userId
            })
        });

        const data = await response.json();

        if (data.error && data.error !== "") {
            resultEl.textContent = data.error;
            resultEl.className = "message error";
        } else {
            resultEl.textContent = "Contact added successfully!";
            resultEl.className = "message success";

            // Clear form
            document.getElementById("addFirstName").value = "";
            document.getElementById("addLastName").value = "";
            document.getElementById("addPhone").value = "";
            document.getElementById("addEmail").value = "";

            // Refresh contacts list
            searchContacts();

            // Clear message after 2 seconds
            setTimeout(() => {
                resultEl.textContent = "";
            }, 2000);
        }
    } catch (error) {
        resultEl.textContent = "Connection error. Please try again.";
        resultEl.className = "message error";
        console.error("Add contact error:", error);
    }
}

function handleSearchKeyup(event) {
    if (event.key === "Enter") {
        searchContacts();
    }
}

async function searchContacts() {
    const searchTerm = document.getElementById("searchInput").value.trim();
    const resultEl = document.getElementById("searchResult");
    const listEl = document.getElementById("contactsList");

    try {
        const response = await fetch(`${API_URL}/SearchContact.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                search: searchTerm,
                userId: userId
            })
        });

        const data = await response.json();

        if (data.error && data.error !== "" && data.error !== "No Records Found") {
            resultEl.textContent = data.error;
            resultEl.className = "message error";
            listEl.innerHTML = '<p class="no-contacts">No contacts found</p>';
        } else if (data.results && data.results.length > 0) {
            resultEl.textContent = "";
            displayContacts(data.results);
        } else {
            resultEl.textContent = "";
            listEl.innerHTML = '<p class="no-contacts">No contacts found. Add your first contact above!</p>';
        }
    } catch (error) {
        resultEl.textContent = "Connection error. Please try again.";
        resultEl.className = "message error";
        console.error("Search error:", error);
    }
}

function displayContacts(contacts) {
    const listEl = document.getElementById("contactsList");
    listEl.innerHTML = "";

    contacts.forEach(contact => {
        const div = document.createElement("div");
        div.className = "contact-item";
        div.innerHTML = `
            <div class="contact-info">
                <h3>${escapeHtml(contact.FirstName)} ${escapeHtml(contact.LastName)}</h3>
                ${contact.Phone ? `<p><span>Phone:</span> ${escapeHtml(contact.Phone)}</p>` : ''}
                ${contact.Email ? `<p><span>Email:</span> ${escapeHtml(contact.Email)}</p>` : ''}
            </div>
            <div class="contact-actions">
                <button class="btn btn-edit" onclick="openEditModal(${contact.ID}, '${escapeHtml(contact.FirstName)}', '${escapeHtml(contact.LastName)}', '${escapeHtml(contact.Phone || '')}', '${escapeHtml(contact.Email || '')}')">Edit</button>
                <button class="btn btn-delete" onclick="openDeleteModal(${contact.ID}, '${escapeHtml(contact.FirstName)} ${escapeHtml(contact.LastName)}')">Delete</button>
            </div>
        `;
        listEl.appendChild(div);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============ Edit Modal Functions ============

function openEditModal(id, first, last, phone, email) {
    document.getElementById("editContactId").value = id;
    document.getElementById("editFirstName").value = first;
    document.getElementById("editLastName").value = last;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editEmail").value = email;
    document.getElementById("editResult").textContent = "";
    document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

async function updateContact() {
    const id = document.getElementById("editContactId").value;
    const first = document.getElementById("editFirstName").value.trim();
    const last = document.getElementById("editLastName").value.trim();
    const phone = document.getElementById("editPhone").value.trim();
    const email = document.getElementById("editEmail").value.trim();
    const resultEl = document.getElementById("editResult");

    if (!first || !last) {
        resultEl.textContent = "First and last name are required";
        resultEl.className = "message error";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/UpdateContact.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: parseInt(id),
                firstName: first,
                lastName: last,
                phone: phone,
                email: email
            })
        });

        const data = await response.json();

        if (data.error && data.error !== "") {
            resultEl.textContent = data.error;
            resultEl.className = "message error";
        } else {
            closeEditModal();
            searchContacts();
        }
    } catch (error) {
        resultEl.textContent = "Connection error. Please try again.";
        resultEl.className = "message error";
        console.error("Update error:", error);
    }
}

// ============ Delete Modal Functions ============

function openDeleteModal(id, name) {
    document.getElementById("deleteContactId").value = id;
    document.getElementById("deleteContactName").textContent = name;
    document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

async function confirmDelete() {
    const id = document.getElementById("deleteContactId").value;

    try {
        const response = await fetch(`${API_URL}/DeleteContact.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: parseInt(id) })
        });

        const data = await response.json();

        if (data.error && data.error !== "") {
            alert("Error deleting contact: " + data.error);
        } else {
            closeDeleteModal();
            searchContacts();
        }
    } catch (error) {
        alert("Connection error. Please try again.");
        console.error("Delete error:", error);
    }
}

// ============ Initialize ============

// Check for existing session on page load
window.onload = function() {
    if (readCookie()) {
        showContactsSection();
    }
};

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.className === "modal") {
        event.target.style.display = "none";
    }
};
