import { socket } from '../main';
import { renderChat } from './chatcomp';

export function initGlobalChatSockets() {
  socket.off('globalMessage');
  socket.on('globalMessage', (msg) => {
    let user = JSON.parse(sessionStorage.getItem('user'));

    const globalChat = {
      user: msg.user,
      message: msg.message,
      color: msg.color,
    };

    const globalMessages = JSON.parse(sessionStorage.getItem('globalMessages'));
    globalMessages.unshift(globalChat);
    sessionStorage.setItem('globalMessages', JSON.stringify(globalMessages));

    // messages.insertBefore(chat, messages.firstChild);
    // messages.scrollTop = messages.scrollHeight;

    if (user.currentChat == 'global') {
      renderChat(JSON.parse(sessionStorage.getItem('globalMessages')));
    }
  });
}

export function removeGlobalSockets() {
  socket.off('globalChat');
}
