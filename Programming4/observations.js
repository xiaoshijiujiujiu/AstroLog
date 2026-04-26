console.log('observations.js loaded!');

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

function protectCardClick() {
    const cards = document.querySelectorAll('.observation-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isLoggedIn()) {
                alert('Please login to view observation details!');
                window.location.href = 'login.html';
            } else {
                const url = this.getAttribute('data-url') || this.getAttribute('href');
                if (url && url !== '#') {
                    window.location.href = url;
                }
            }
        });
    });
}


function protectAddNewButton() {
    const addNewBtn = document.getElementById('addNewBtn');
    
    if (addNewBtn) {
        addNewBtn.addEventListener('click', function() {
            if (!isLoggedIn()) {
                alert('Please login to add new observations!');
                window.location.href = 'login.html';
            } else {
                window.location.href = 'add-observation.html';
            }
        });
    }
}


function getAllObservations() {
    const obsStr = localStorage.getItem('userObservations');
    console.log('Raw observations from localStorage:', obsStr);
    return obsStr ? JSON.parse(obsStr) : [];
}


function createObservationCard(observation) {
    console.log('Creating card for:', observation.objectName);
    
    const card = document.createElement('a');
    card.href = '#';
    card.className = 'observation-card user-observation';
    card.setAttribute('data-observation-id', observation.id);
    

    const currentUser = getCurrentUser();
    const isMyObservation = currentUser && observation.observer === currentUser.username;
    
    const imageUrl = observation.imageUrl || '';
    const imageHtml = imageUrl 
        ? `<img src="${imageUrl}" alt="${observation.objectName}" style="width: 100%; height: 100%; object-fit: cover;">`
        : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #999;">No Image</div>`;
    

    // create the card
    card.innerHTML = `
        <div class="card-image">
            ${imageHtml}
        </div>
        <div class="card-content">
            <h3>${observation.objectName}</h3>
            <p class="observer">Observer: ${observation.observer}</p>
            <p class="location">${observation.locationName}</p>
        </div>
    `;
    
    card.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!isLoggedIn()) {
            alert('Please login to view observation details!');
            window.location.href = 'login.html';
        } else {
            window.location.href = `observation-detail.html?id=${observation.id}`;
        }
    });
    
    return card;
}

function loadUserObservations() {
    console.log('loadUserObservations called!');
    
    const cardGrid = document.getElementById('cardGrid');
    if (!cardGrid) {
        console.error('cardGrid not found!');
        return;
    }
    
    console.log('cardGrid found:', cardGrid);
    
    const observations = getAllObservations();
    console.log('Total observations to load:', observations.length);
    
    if (observations.length === 0) {
        console.log('No user observations found');
        return;
    }
    
    observations.forEach((observation, index) => {
        console.log(`Adding observation ${index + 1}/${observations.length}:`, observation.objectName);
        const card = createObservationCard(observation);
        cardGrid.appendChild(card);
    });
    
    console.log('Finished loading observations');
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded!');
    
    checkLoginStatus();
    protectCardClick();
    protectAddNewButton();
    loadUserObservations();
    
    console.log('All initialization complete!');
});