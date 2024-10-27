import re
import os
import json

def read_profiles(filename):
    # Specify the path to README.md in the root folder
    filepath = os.path.join(os.path.dirname(__file__), '..', filename)

    with open(filepath, 'r') as file:
        content = file.read()

    # Regular expression to capture profile fields
    profile_pattern = re.compile(
        r'### (.+?)\n'                   # Capture the name
        r'- \*\*Email\*\*: (.+?)\n'      # Capture email
        r'- \*\*LinkedIn\*\*: \[(.+?)\]\(https?://.+?\)\n' # Capture only LinkedIn link text
        r'- \*\*GitHub\*\*: \[(.+?)\]\(https?://.+?\)\n'   # Capture only GitHub link text
        r'- \*\*Experience\*\*: (.+?)\n' # Capture experience
        r'- \*\*Current Role\*\*: (.+?)\n' # Capture current role
        r'- \*\*Skills\*\*: (.+?)\n'     # Capture skills
        r'- \*\*Location\*\*: (.+?)\n'   # Capture location
        r'- \*\*Remote Work\*\*: (.+?)\n',# Capture remote work
        re.DOTALL                       # Match across multiple lines
    )

    # Find all profiles in the content
    profiles = profile_pattern.findall(content)

    # Process and print each profile
    profile_data = []
    for profile in profiles:
        name, email, linkedin, github, experience, role, skills, location, remote = profile
        profile_data.append({
            'name': name.strip(),
            'email': email,
            'linkedin': f'https://{linkedin}',
            'github': f'https://{github}',
            'experience': experience,
            'currentRole': role,
            'skills': skills,
            'location': location,
            'remoteWork': remote
        })

    return profile_data

# Run the function
profiles = read_profiles('README.md')
developers = []
for profile in profiles:
    print(profile)
    developers.append(profile)
# Write to developer.json in the docs folder
with open('developer.json', 'w') as json_file:
    json.dump(developers, json_file, indent=4)
