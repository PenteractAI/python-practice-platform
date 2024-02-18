import http from "k6/http";

export const options = {
    duration: "10s",
    vus: 10,
    summaryTrendStats: ["med", "p(99)"]
}

/**
 * Sends an HTTP GET request to http://localhost:7800/.
 *
 * @function sendHttpRequest
 */
export default function () {
    const payload = JSON.stringify({
       userUuid: 'perftest_uuid',
       assignmentId: 1,
       code: 'Wrong code'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    http.post("http://localhost:7800/api/grade", payload, params);
}