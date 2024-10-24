const fs = require('fs');
const path = require('path');

// Define file paths
const readmePath = path.join(__dirname, 'README.md');
const jsonPath = path.join(__dirname, 'developer.json');

// Read README.md
const readmeContent = fs.readFileSync(readmePath, 'utf-8');

// Regex to match each developer block
const developerRegex = /### (.+?)\n- \*\*Email\*\*: (.+?)\n- \*\*LinkedIn\*\*: (.+?)\n- \*\*GitHub\*\*: (.+?)\n- \*\*Experience\*\*: (.+?)\n- \*\*Current Role\*\*: (.+?)\n- \*\*Skills\*\*: (.+?)\n- \*\*Location\*\*: (.+?)\n- \*\*Remote Work\*\*: (.+?)(?=\n\n|$)/g;

const developers = [];
let match;

// Loop through all matches of the regex
while ((match = developerRegex.exec(readmeContent)) !== null) {
    const skills = match[7].split(',').map(skill => skill.trim()); // Split skills into an array
    const remoteWork = match[9].trim().toLowerCase() === 'yes'; // Convert remote work string to boolean

    developers.push({
        name: match[1].trim(),
        email: match[2].trim(),
        linkedin: match[3].trim(),
        github: match[4].trim(),
        experience: match[5].trim(),
        currentRole: match[6].trim(),
        skills: skills,
        location: match[8].trim(),
        remoteWork: remoteWork
    });
}

// Write to developer.json
fs.writeFileSync(jsonPath, JSON.stringify(developers, null, 2));
