import json
import re

# Read the README.md file
with open('README.md', 'r') as file:
    readme_content = file.read()

# Define a regex pattern to extract developer details
developer_pattern = re.compile(
    r'### (.+?)\n'
    r'- \*\*Email\*\*: (.+?)\n'
    r'- \*\*LinkedIn\*\*: \[(.+?)\]\((.+?)\)\n'
    r'- \*\*GitHub\*\*: \[(.+?)\]\((.+?)\)\n'
    r'- \*\*Experience\*\*: (.+?)\n'
    r'- \*\*Current Role\*\*: (.+?)\n'
    r'- \*\*Skills\*\*: (.+?)\n'
    r'- \*\*Location\*\*: (.+?)\n'
    r'- \*\*Remote Work\*\*: (.+?)\n',
    re.MULTILINE
)

# Extract developer details
developers = []
for match in developer_pattern.finditer(readme_content):
    developers.append({
        'name': match.group(1).strip(),
        'email': match.group(2).strip(),
        'linkedin': match.group(3).strip(),
        'linkedin_url': match.group(4).strip(),
        'github': match.group(5).strip(),
        'github_url': match.group(6).strip(),
        'experience': match.group(7).strip(),
        'current_role': match.group(8).strip(),
        'skills': match.group(9).strip().split(', '),  # Split skills into a list
        'location': match.group(10).strip(),
        'remote_work': match.group(11).strip()
    })

# Write to developer.json
with open('developer.json', 'w') as json_file:
    json.dump(developers, json_file, indent=4)

print(f'Extracted {len(developers)} developers.')
