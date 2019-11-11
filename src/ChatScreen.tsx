import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Form
} from 'react-bootstrap';

export type ReceivedMessage = { from: string; to: string; message: string };

const ChatScreen: React.FC<{
  receivedMessages: Array<ReceivedMessage>;
  users: Array<string>;
  sendMessage: (to: Array<string>, message: string) => void;
  nickname: string;
}> = ({ receivedMessages, users, sendMessage, nickname }) => {
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<Array<string>>([]);

  return (
    <Form
      className="h-100"
      onSubmit={(e: any) => {
        sendMessage(recipients, message);
        setMessage('');
        e.preventDefault();
      }}
    >
      <Container fluid className="py-3 h-100 d-flex flex-column">
        <Row className="flex-grow-1 mb-2">
          <Col>
            <div
              className="p-2 border rounded w-100 h-100"
              style={{ overflowY: 'scroll' }}
            >
              {receivedMessages.map((message, index) => {
                return (
                  <p key={index}>
                    <span>{message.from}</span>
                    <span> disse para </span>
                    <span>{message.to}</span>
                    <span>: {message.message}</span>
                  </p>
                );
              })}
            </div>
          </Col>
          <Col md={2}>
            <Form.Control
              as="select"
              multiple
              className="h-100"
              value={recipients as any}
              onChange={(e: any) => {
                setRecipients(
                  [...e.target.selectedOptions].map(op => op.value)
                );
              }}
            >
              {users.map(user => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>
        <Row className="chat-form">
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>{nickname} diz:</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Button variant="outline-secondary" type="submit" block>
              Enviar
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default ChatScreen;
