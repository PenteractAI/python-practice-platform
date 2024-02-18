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
    http.get("http://localhost:7800/");
}