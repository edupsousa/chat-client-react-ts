import React from 'react';
import ChatScreen, { ReceivedMessage } from './ChatScreen';
import { w3cwebsocket as WsClient } from 'websocket';
import { uniqueNamesGenerator } from 'unique-names-generator';

const myName = uniqueNamesGenerator({ separator: '-', length: 2 })
  .split('-')
  .map(name => name.substr(0, 1).toUpperCase() + name.substr(1))
  .join(' ');

type AppState = {
  receivedMessages: Array<ReceivedMessage>;
  users: Array<string>;
};

class App extends React.Component<{}, AppState> {
  wsClient: WsClient = new WsClient('ws://127.0.0.1:4322/');
  state: AppState = {
    receivedMessages: [],
    users: []
  };
  render() {
    return (
      <ChatScreen
        nickname={myName}
        users={this.state.users}
        receivedMessages={this.state.receivedMessages}
        sendMessage={this.sendMessage.bind(this)}
      />
    );
  }
  componentDidMount() {
    this.wsClient.onopen = () => {
      this.wsClient.send(`login:${myName}`);
      this.newReceivedMessage('Servidor', myName, 'Você está conectado!');
    };
    this.wsClient.onmessage = e => {
      this.parseMessage(e.data as string);
    };
  }
  sendMessage(to: Array<string>, message: string): void {
    let recipients = to.join(';');
    if (recipients === '') recipients = '*';
    console.log(`mensagem:${recipients}:${message}`);
    this.wsClient.send(`mensagem:${recipients}:${message}`);
  }
  parseMessage(data: string) {
    const serverMessage = data.trim().split(':');
    const command = serverMessage[0];
    if (command === 'lista_usuarios' && serverMessage.length === 2) {
      const users = serverMessage[1].split(';');
      this.setState({
        ...this.state,
        users
      });
    } else if (command === 'transmitir' && serverMessage.length === 4) {
      const from = serverMessage[1];
      const to =
        serverMessage[2] === '*'
          ? 'Todos'
          : serverMessage[2].replace(';', ', ');
      const message = serverMessage[3];
      this.newReceivedMessage(from, to, message);
    }
  }
  newReceivedMessage(from: string, to: string, message: string) {
    this.setState({
      ...this.state,
      receivedMessages: [...this.state.receivedMessages, { from, to, message }]
    });
  }
}

export default App;
