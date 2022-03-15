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
- Added edit test subject record form (User story 1 complete))
- Added Pagination to test subjects table
- Added user_id fk relationship + updated laravel models

## Asumptions
- A "testing subject" persona/user refers to users stored in the "users" db table
   - We therefore need to associated created test subject records with the logged in user
   - This will allow us to scope the subjects table down to only allowed records