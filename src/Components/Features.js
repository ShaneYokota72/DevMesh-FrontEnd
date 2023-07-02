import React, { useEffect, useState } from 'react';
import Indfeatures from './Indfeatures';

export default function Features() {
  const features = [
    { icon: '🔒', desc: '1Day', desc2: 'Free Code Storage' },
    { icon: '👨‍💻', desc: '100+', desc2: 'Coing Language Support' },
    { icon: '⚡️', desc: '10ms', desc2: 'Low Latency' },
    { icon: '🔓/🔒', desc: 'Privacy', desc2: 'Public/Private Room' },
    { icon: '💬', desc: 'Unlimited', desc2: 'Chatting In Room' }
  ];

  const [featureidx, setFeatureidx] = useState(1);

  const prevfeature = features[(featureidx - 1) % features.length];
  const currfeature = features[featureidx % features.length];
  const nextfeature = features[(featureidx + 1) % features.length];

  if(featureidx < 1) {
    setFeatureidx((prevIdx) => prevIdx + 4);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const elements = document.querySelectorAll('.indfeatures');
      elements.forEach((element) => {
        element.classList.add('moveLeftAnimation');
      });
  
      setTimeout(() => {
        elements.forEach((element) => {
          element.classList.remove('moveLeftAnimation');
        });
        setFeatureidx((prevIdx) => prevIdx + 1);
      }, 3000);
    }, 10000);
  
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  

  return (
    <div className='featurescaro' id='feature'>
      <h1 className='featuretitle'>Features</h1>
      <div className='carosel'>
        <Indfeatures
          icon={prevfeature.icon}
          desc={prevfeature.desc}
          desc2={prevfeature.desc2} 
          opcaity={true}
        ></Indfeatures>
        <Indfeatures
          icon={currfeature.icon}
          desc={currfeature.desc}
          desc2={currfeature.desc2}
          opcaity={false}
        ></Indfeatures>
        <Indfeatures
          icon={nextfeature.icon}
          desc={nextfeature.desc}
          desc2={nextfeature.desc2} 
          opcaity={true}
        ></Indfeatures>
      </div>
      
    </div>
  );
}
