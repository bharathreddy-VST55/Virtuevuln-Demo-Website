import type { FC } from 'react';
import ChatWidget from './ChatWidget';
import UserSidebarLayout from '../../components/UserSidebarLayout';

export const Chat: FC = () => {
  return (
    <UserSidebarLayout>
      <div style={{ color: '#E0E0E0' }}>
        <h1 style={{ color: '#87CEEB', marginBottom: '30px', fontSize: '32px' }}>
          Chat
        </h1>
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '30px', borderRadius: '10px', border: '1px solid #333' }}>
          <ChatWidget />
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default Chat;
