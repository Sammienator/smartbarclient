import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:4000";

// A single shared socket connection for the whole app. Each page decides
// which room(s) it needs to join (guest / admin / waiter:<id>) once
// connected - see the join:* events on the backend's src/config/socket.js.
export const socket = io(SOCKET_URL, {
  autoConnect: true,
});
