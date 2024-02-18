# Brief description of the application 

Web application designed to assist users in practicing their Python skills through a series of assignments.
While an assignment handout is shown on the right-side of the window, the user can type its code directly on the page and send a grading request.
On the one hand, the user has successfully passed the exercise and its score is incremented by 100; the user can pass to the next assignment.
On the other hand, the user has failed the assignment, and has to correct its code. 
The platform is built with scalability in mind, supporting multiple users simultaneously, using load balancing, caching, queuing and websockets.

# Key design decisions
## Backend
First, when the user sends a grading request, a WebSocket connection opens between the client and the server to check at 
a periodic time if the status of the submission changes. This allows the user to get its feedback without having to reload the page.
If the user quit the page during the grading request, the connection is closed by the programming-api.
Once the user comes back on the assignment, the connection is re-opened by the client.

To ensure that the user does not send multiple grading request, the user's UUID is saved into a shared Redis cache during the first grading request.
If the user sends a new grading request, the application check if the UUID is already present in the shared cache.
Once the submission has been graded, the UUID is removed from the Redis cache.

(Note: even if the user can only work on its current assignment, they can still send a grading submission, move to next assignment 
and send a new grading submission.)

If the user successfully passes the assignment, then its score is incremented by 100. However, the application checks
in the database if the user has made other submission on the same assignment, in order to prevent the user from gaining points
if the assignment has already been graded.

In order to manage the traffic on the application, there is two deployments of grader-api and programming-api.
The communication between them is made using Redis Stream, allowing queuing of the grading requests and load balancing.

Request to get assignments are cached using Redis, reducing the number of access to the database for that specific task.

Finally there is a production and a development configuration for the environment. I had several issues with services starting
while their dependencies were not ready. For example, the programming-api starts when the database is running, which not mean
that the database is ready to process requests. To prevent that issue, I tried to use different techniques found on the web
(wait-for-it scripts and dockerizer) but it does not work 100% of the time.

(Note: if this happens during your test, stop the containers and remove them. Then, start again.)


## Frontend
- As it was not specifically asked, I decided to not implement a menu bar. Thus, the user has only access to its current assignment. 
This decision has been made because of a lack of time allowed for the project.
- At the top-right part of the window, the user can see its score. 
- On the right part of the screen, there is a fixed sidebar with the title and handout of the assignment. The user can also see its feedbacks, the status of its assignment and the button to send a grading request and navigate to the next assignment.
- The Code Editor takes the whole window, allowing the user to focus on its code.


# Possible improvements

## Performance Improvements
- Automatically scale the number of instances of grader-api and programming-api depending on the traffic
- Adopt a microservices architecture, enabling more scalability and modularity
- Use an orchestration tool to improve the load distribution and reducing the number of issues with dependencies
- Refactor certain portion of the code for better performances and readability; find bottlenecks
- As the user usually navigates assignment by assignment, load in cache the next assignment could also increase the performances

## UX Improvements
- A first step is to add a sidebar menu, allowing the user to navigate through the different assignments
- Make the website responsive for any devices and ensure its accessibility to anyone
- Improve the feedbacks (UX aspect) by implementing more animations, sounds and details

## Functionalities
- Simplify the creation of assignments by implementing a dashboard for administrators
- Add a feedback system

## Test
- Test more deeply the different part of the application with more specific tests and mocks