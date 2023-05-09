import { Link } from 'react-router-dom';
import Moveable, { OnDrag, OnResize, OnScale, OnRotate } from 'react-moveable';
import { flushSync } from 'react-dom';
import { useRef, useState } from 'react';

export function MoveablePage() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const targetRef = useRef(null);
  const moveableRef = useRef<React.MutableRefObject<Moveable | null>>(null);

  return (
    <div className="page">
      <div className="bar-button">
        <button className="button" style={{ marginLeft: '20px' }}>
          {/* <Link to="/"> Draggable </Link> */}
          <Link to="/home"> Draggable </Link>
        </button>
      </div>
      <div className="container">
        <div className="target">Target</div>
        <Moveable
          target={'.target'}
          draggable={true}
          resizable={true}
          edgeDraggable={true}
          edge={['w', 'e']}
          onDrag={(e) => {
            e.target.style.transform = e.transform;
          }}
          onResize={(e) => {
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.transform = e.drag.transform;
          }}
        />
      </div>
    </div>
  );
}
