import React, { useState, useEffect } from 'react';

export default function Notification(props) {
  const { name } = props;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div className={`notif ${isVisible ? 'show' : ''}`}>
          <h5>{name} joined the room</h5>
          <div className='time-bar'></div>
        </div>
      )}
    </>
  );
}
