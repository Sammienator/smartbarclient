import { io } from "socket.io-client";

/**
 * Shared Socket.IO client.
 *
 * Connects to the same origin as the REST API unless
 * REACT_APP_SOCKET_URL is set explicitly.
 *
 * Events used by the app:
 *   emit  join:waiter / leave:waiter
 *   emit  join:station / leave:station
 *   emit  join:admin
 *   on    order:new
 *   on    station:neworder
 *   on    station:itemReady
 *   on    order:completed
 *   on    inventory:lowstock
 */
const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export default socket;
