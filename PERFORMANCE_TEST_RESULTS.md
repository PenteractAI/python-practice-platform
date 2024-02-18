# Description of the computer
- Predator Helios 300
- Windows 11
- NVidia GeForce RTX 260
- 1 TB SSD
- 16 GB RAM
- Multiple applications were running during the performance tes

# Performance measurements
The performances were measured with the use of:
- Redis Cache for retrieving assignments
- 2 deployments of programming-api
- 2 deployments of grader-api
- Redis Stream for the communication between grader-api and programming-api

## Load the assignment page

http_reqs: 16411
http_req_duration - median: 5.49ms
http_req_duration - 99th percentile: 14.56ms

## Submitting an assignment

http_reqs: 5580
http_req_duration - median: 15.56ms
http_req_duration - 99th percentile: 48.04ms