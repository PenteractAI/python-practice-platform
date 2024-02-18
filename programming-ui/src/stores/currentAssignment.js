import { writable } from "svelte/store";

const createCurrentAssignmentStore = () => {
    const { subscribe, set, update } = writable(null);

    return {
        subscribe,
        loadCurrentAssignment: async (userUuid) => {
            const response = await fetch("/api/assignment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userUuid: userUuid }),
            });
            const data = await response.json();
            set(data);
        }
    }
}

export const currentAssignment = createCurrentAssignmentStore();
