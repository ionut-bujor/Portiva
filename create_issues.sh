#!/bin/bash

set +H

REPO="ionut-bujor/Portiva"

gh issue create --repo "$REPO" --title "Create database schema" --body "Create Users and Projects tables with relationship"
gh issue create --repo "$REPO" --title "Create user signup endpoint" --body "Validate input, hash password, store user, return token"
gh issue create --repo "$REPO" --title "Implement login authentication" --body "Verify credentials and generate session/token"
gh issue create --repo "$REPO" --title "Persist authentication session" --body "Store token and restore login after refresh"
gh issue create --repo "$REPO" --title "Create dashboard UI" --body "Profile section and projects list layout"
gh issue create --repo "$REPO" --title "Fetch authenticated user data" --body "Load user data from backend API"
gh issue create --repo "$REPO" --title "Edit profile endpoint" --body "Update name, bio and links"
gh issue create --repo "$REPO" --title "Project CRUD endpoints" --body "Create, read, update and delete projects"
gh issue create --repo "$REPO" --title "Project management UI" --body "Frontend forms for project editing"
gh issue create --repo "$REPO" --title "Public portfolio endpoint" --body "Fetch user and projects by username"
gh issue create --repo "$REPO" --title "Public portfolio page" --body "Render portfolio at /u/:username"
gh issue create --repo "$REPO" --title "Docker setup" --body "Create Dockerfiles and docker-compose configuration"
