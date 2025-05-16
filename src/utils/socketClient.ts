import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../constant/BASE_URL';

const NAMESPACE = '/comments';

let socket: Socket | null = null;

/**
 * Initialize (or return existing) socket instance.
 * It will auto-connect on creation.
 */
function getSocket(): Socket {
  if (!socket) {
    socket = io(BASE_URL + NAMESPACE, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }
  return socket;
}

/**
 * Listen for the `commentCreated` event.
 */
export function onCommentCreated(cb: () => void) {
  getSocket().on('commentCreated', cb);
}

/**
 * Remove a specific listener.
 */
export function offCommentCreated(cb: () => void) {
  getSocket().off('commentCreated', cb);
}

/**
 * (Optional) Completely disconnect.
 */
export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
