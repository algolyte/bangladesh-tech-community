async function loadProfiles() {
    try {
        // Fetch developer data from JSON
        const response = await fetch('developer.json');
        const developers = await response.json();
        const container = document.getElementById('profile-container');

        // Iterate over each developer and create profile cards
        developers.forEach(developer => {
            const profileCard = document.createElement('div');
            profileCard.classList.add('profile-card');

            // Extracting name and link from currentRole
            const roleMatch = developer.currentRole.match(/(.+?)\s+\[(.+?)\]\((https?:\/\/[^\s]+)\)/);
            const roleTitle = roleMatch ? roleMatch[1] : developer.currentRole;
            const roleLabel = roleMatch ? roleMatch[2] : '';
            const roleUrl = roleMatch ? roleMatch[3] : '#';

            // Populate profile card with developer data
            profileCard.innerHTML = `
                <h2>${developer.name}</h2>
                <p><strong>Email:</strong> ${developer.email}</p>
                <p><strong>Experience:</strong> ${developer.experience}</p>
                <p><strong>Current Role:</strong> ${roleTitle} 
                    <a href="${roleUrl}" target="_blank" style="cursor:pointer;color:blue;">${roleLabel}</a>
                </p>
                <p><strong>Skills:</strong> ${developer.skills}</p>
                <p><strong>Location:</strong> ${developer.location}</p>
                <p><strong>Remote Work:</strong> ${developer.remoteWork}</p>
                <div class="profile-links">
                    <a href="${developer.linkedin}" target="_blank">LinkedIn</a>
                    <a href="${developer.github}" target="_blank">GitHub</a>
                </div>
            `;

            // Append profile card to the container
            container.appendChild(profileCard);
        });
    } catch (error) {
        console.error('Error loading developer profiles:', error);
    }
}

// Load profiles when the page loads
document.addEventListener('DOMContentLoaded', loadProfiles);
