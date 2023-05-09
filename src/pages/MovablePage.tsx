import { Link } from 'react-router-dom';
import Moveable from 'react-moveable';
import { useRef, useState } from 'react';

export function MoveablePage() {
  let [components, setComponents] = useState<number>(0);

  return (
    <div className="page">
      <div className="bar-button">
        <button className="button" style={{ margin: '10px' }}>
          <Link to="/"> Draggable </Link>
        </button>
        <button
          onClick={() => {
            setComponents(components + 1);
          }}
          style={{ margin: '10px' }}
        >
          +
        </button>
        <button
          onClick={() => {
            setComponents(components - 1);
          }}
          style={{ margin: '10px' }}
        >
          -
        </button>
      </div>
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        ></div>
        {new Array(components)
          .fill(0)
          .map((item, index) => MoveableRectangle({ index }))}
      </div>
    </div>
  );
}

function MoveableRectangle({ index }: { index: number }) {
  return (
    <>
      <div
        key={`moveable-div-${index}`}
        className={`target${index}`}
        style={{ background: 'black', width: '80px', height: '80px' }}
      ></div>
      <Moveable
        key={`moveable-rectangle-${index}`}
        target={`.target${index}`}
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
    </>
  );
}
