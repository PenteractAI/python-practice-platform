## Run the app
1. Move into the folder /grader-image
2. Run the following command: docker build -t grader-image .
3. Then come back to the root of the project and play one of these command:
   - (Development) docker compose --profile migrate  -f .\docker-compose.yml up -d
   - (Production) docker compose --profile migrate  -f .\docker-compose.prod.yml up -d

## Play the tests
1. Go to /e2e-playwright
2. Run the command: docker compose run e2e-plawyright

