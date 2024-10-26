// script.js
async function loadProfiles() {
    try {
        const response = await fetch('developer.json');
        const developers = await response.json();
        const container = document.getElementById('profile-container');

        developers.forEach(developer => {
            const profileCard = document.createElement('div');
            profileCard.classList.add('profile-card');

            profileCard.innerHTML = `
        <h2>${developer.name}</h2>
        <p><strong>Email:</strong> ${developer.email}</p>
        <p><strong>Experience:</strong> ${developer.experience}</p>
        <p><strong>Current Role:</strong> ${developer.currentRole}</p>
        <p><strong>Skills:</strong> ${developer.skills}</p>
        <p><strong>Location:</strong> ${developer.location}</p>
        <p><strong>Remote Work:</strong> ${developer.remoteWork}</p>
        <div class="profile-links">
          <a href="${developer.linkedin}" target="_blank">LinkedIn</a>
          <a href="${developer.github}" target="_blank">GitHub</a>
        </div>
      `;
            container.appendChild(profileCard);
        });
    } catch (error) {
        console.error('Error loading developer profiles:', error);
    }
}

// Load profiles on page load
document.addEventListener('DOMContentLoaded', loadProfiles);
