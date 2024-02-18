import {readable, writable} from "svelte/store";

/**
 * User UUID
 * @type {string}
 */
let user = localStorage.getItem("userUuid");
if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}

export const userUuid = readable(user);

