## User Stories

## Senior Software Engineer:

1. As an authenticated user, I want to be able to create testing subject records.
2. As an authenticated user, I want to be able to edit testing subject records.
3. As a testing subject, I want to be able to log into the system, but I should only be able to see/edit my own subject data.
4. As a testing subject, I want to be able to reset my password


## Changes
- Add @guard directive to subjects graphql queries so queries get authenticated ref: https://lighthouse-php.com/5/api-reference/directives.html#guard
- Refactored rendering for subjects component to have functions for displaying form and list
- Added form toggle button
- Added create new testing subjects record form (User story 1 complete)

