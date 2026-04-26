// ===== Login Status =====
function checkLoginStatus() {
    const user = getCurrentUser();
    const userControls = document.getElementById('userControls');

    if (user) {
        userControls.innerHTML = `
            <span class="welcome-text">Welcome, ${user.username}!</span>
            <button onclick="logoutUser()" class="logout-btn">Logout</button>
        `;
    } else {
        userControls.innerHTML = `
            <button onclick="window.location.href='login.html'" class="login-btn-header">Login</button>
        `;
    }
}

// ===== Collection Storage =====
function getCollection() {
    const user = getCurrentUser();
    if (!user) return [];
    const key = `collection_${user.username}`;
    const str = localStorage.getItem(key);
    return str ? JSON.parse(str) : [];
}

function saveCollection(collection) {
    const user = getCurrentUser();
    if (!user) return;
    const key = `collection_${user.username}`;
    localStorage.setItem(key, JSON.stringify(collection));
}

function removeFromCollection(observationId) {
    if (!confirm('Remove this observation from your collection?')) return;
    let collection = getCollection();
    collection = collection.filter(obs => obs.id !== observationId);
    saveCollection(collection);
    renderCollection();
}

function clearCollection() {
    if (!confirm('Clear your entire collection? This cannot be undone.')) return;
    saveCollection([]);
    renderCollection();
}

// ===== Render =====
function renderCollection() {
    const collection = getCollection();
    const grid = document.getElementById('collectionGrid');
    const emptyState = document.getElementById('emptyState');

    grid.innerHTML = '';

    if (collection.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    collection.forEach(obs => {
        const card = document.createElement('div');
        card.className = 'collection-card';

        const imageHtml = obs.imageUrl
            ? `<img src="${obs.imageUrl}" alt="${obs.objectName}">`
            : `<div class="no-image">No Image</div>`;

        card.innerHTML = `
            <div class="card-image">${imageHtml}</div>
            <div class="card-body">
                <h3>${obs.objectName}</h3>
                <p class="observer">Observer: ${obs.observer}</p>
                <p class="location">📍 ${obs.locationName}</p>
                <p class="description-preview">${obs.description}</p>
                <div class="card-actions">
                    <button class="view-btn" onclick="window.location.href='observation-detail.html?id=${obs.id}'">View Detail</button>
                    <button class="remove-btn" onclick="removeFromCollection('${obs.id}')">Remove</button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    buildPrintView(collection);
}

// ===== Print =====
function buildPrintView(collection) {
    const printContent = document.getElementById('printContent');
    const printDate = document.getElementById('printDate');

    printDate.textContent = `Printed on: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    printContent.innerHTML = collection.map(obs => {
        const imgHtml = obs.imageUrl
            ? `<img class="print-observation-img" src="${obs.imageUrl}" alt="${obs.objectName}">`
            : `<div class="print-no-img">No Image</div>`;

        return `
            <div class="print-observation">
                ${imgHtml}
                <div class="print-observation-content">
                    <h2>${obs.objectName}</h2>
                    <p><strong>Observer:</strong> ${obs.observer}</p>
                    <p><strong>Location:</strong> ${obs.locationName}</p>
                    <p><strong>Date:</strong> ${new Date(obs.date).toLocaleDateString()}</p>
                    <p style="margin-top:8px;">${obs.description}</p>
                    ${obs.rightAscension || obs.declination ? `
                    <ul>
                        ${obs.rightAscension ? `<li>Right Ascension: ${obs.rightAscension}</li>` : ''}
                        ${obs.declination ? `<li>Declination: ${obs.declination}</li>` : ''}
                    </ul>` : ''}
                    ${obs.weather || obs.equipment || obs.visibility ? `
                    <ul>
                        ${obs.weather ? `<li>Weather: ${obs.weather}</li>` : ''}
                        ${obs.equipment ? `<li>Equipment: ${obs.equipment}</li>` : ''}
                        ${obs.visibility ? `<li>Visibility: ${obs.visibility}</li>` : ''}
                    </ul>` : ''}
                </div>
            </div>
        `;
    }).join('') + `<p class="print-footer-note">&copy; 2026 AstroLog Sky Observations | University of Oulu Coursework</p>`;
}

function printCollection() {
    const collection = getCollection();
    if (collection.length === 0) {
        alert('Your collection is empty! Add some observations first.');
        return;
    }
    buildPrintView(collection);
    window.print();
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function () {
    if (!isLoggedIn()) {
        alert('Please login to view your collection!');
        window.location.href = 'login.html';
        return;
    }

    checkLoginStatus();
    renderCollection();
});