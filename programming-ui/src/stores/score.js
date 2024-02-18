import {writable} from "svelte/store";

/**
 * Score
 * @type {Writable<number>}
 */
const createScoreStore = () => {
    const { subscribe, set, update } = writable(0);

    return {
        subscribe,
        loadScore: async (userUuid) => {
            const response = await fetch("/api/score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userUuid: userUuid }),
            });
            const data = await response.json();
            set(data.score);
        }
    }
}
export const score = createScoreStore();