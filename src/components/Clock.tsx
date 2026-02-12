import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center mt-12 mb-12">
      <h1 className="text-8xl font-thin tracking-tighter">
        {format(currentTime, 'h:mm')}
        <span className="text-3xl ml-2 opacity-50">{format(currentTime, 'a')}</span>
      </h1>
      <p className="text-2xl font-light text-gray-400 mt-2">
        {format(currentTime, 'EEEE, MMMM do')}
      </p>
    </div>
  );
};

export default Clock;
