# Migration Notes

README entries were migrated into `profiles/*.yml` as the new source of truth.

## Preserved With Notes

- `profiles/emarat.yml`: the legacy README duplicated the `Skills` label inside the current role line. The migrated profile keeps the obvious role and skills but does not preserve the malformed duplicate markdown.
- `profiles/sanoarul123.yml`: the legacy email `sanoarul123gmail.com` is invalid, so `email` was left empty instead of inventing a corrected address.
- `profiles/imran110219.yml`: the legacy README showed `github.com/sadmansobhan` as the label but linked to `https://github.com/imran110219`. The migration preserved the actual URL target because slug generation must follow the real GitHub username.
- `profiles/nandands-ku.yml`: the legacy README label and URL pointed to different GitHub usernames. The migration preserved the URL target `nandands-ku`.
- `profiles/mashuq0068.yml` and `profiles/mazharul180203.yml`: the legacy labels differed from the linked GitHub usernames. The migration preserved the URL targets.
- `profiles/vimrul.yml`: the legacy README link labels were shortened (`imrull`, `vimrul`) while the target URLs were valid. The migration preserved the target URLs.

## Not Invented

- No availability values were invented from the legacy README, so migrated profiles default to `unknown`.
- No portfolio links were added where none existed.
- No LinkedIn scraping or inferred social links were added.
