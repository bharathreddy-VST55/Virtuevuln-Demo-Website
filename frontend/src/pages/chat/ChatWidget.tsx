import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { queryChat } from '../../api/httpClient';
import type { ChatMessage } from '../../interfaces/ChatMessage';

const UnsafeComponent: FC<{ html: string }> = ({ html }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export const ChatWidget: FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesRef.current?.lastElementChild?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!userInput.trim()) {
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    const messages = [...chatMessages, userMessage];
    setChatMessages(messages);
    setLoading(true);

    try {
      const answer = await queryChat(messages);

      const serverMessage: ChatMessage = {
        role: 'assistant',
        content: answer
      };
      setChatMessages((messages) => [...messages, serverMessage]);
    } catch {
      setChatMessages((messages) => [
        ...messages,
        {
          role: 'assistant',
          content: ''
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setUserInput('');
      await sendMessage();
    }
  };

  return (
    <div className="chat-widget">
      <div className="messages" ref={messagesRef}>
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`message message-role-${msg.role} ${
              !msg.content ? 'message-error' : ''
            }`}
          >
            {msg.role === 'user' ? (
              msg.content
            ) : msg.content ? (
              <UnsafeComponent html={msg.content} />
            ) : (
              'Chat API Error'
            )}
          </div>
        ))}
        {loading && (
          <div className={`message message-role-assistant message-loading`}>
            Typing
            <span className="animated-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        )}
      </div>
      <div className="input-area">
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="form-control"
        />
        <button className="au-btn au-btn--green" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
