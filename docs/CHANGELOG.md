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
- Add scoping to logged in user on graphql schema + saving of logged in user_id on subject model (User story 3 completed)
- Updated db seeders to include test user id

## Asumptions
- A "testing subject" persona/user refers to users stored in the "users" db table
   - We therefore need to associated created test subject records with the logged in user
   - This will allow us to scope the subjects table down to only allowed records

## Notes
- I didnt have time to complete User story 4 unfortuneatly am curious to know how that can be implemented though

## Wiki
1. Open  http://localhost:3000 in your prefered browser
2. Login using
**Email:** GLaDOS@aperture.com
**Password:** ISawDeer
3. You should see a list of 30 subjects for this user
4. Clicking the "Create" button will open a form for you to add more subjects
5. Clicking the "Edit" button on the row of a subject will allow you to edit the subject
6. The "next" and "previous" buttons on the subjects table will allow you to look at subjects page by page
7. Clicking "logout" will log you out of that user
8. Login using
**Email:** new@user.com
**Password:** secret
9. An empty subjects list will be ready for you to popluate
10. Test out the above actions with your new user! have fun :)
