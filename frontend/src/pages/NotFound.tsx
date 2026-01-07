import React from 'react';
import Header from './main/Header/Header';

const NotFound: React.FC = () => {
  return (
    <>
      <Header onInnerPage={true} />
      <div className="container" style={{ marginTop: '100px' }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for doesn't exist.</p>
      </div>
    </>
  );
};

export default NotFound;
