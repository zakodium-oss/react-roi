import { useContext, useEffect, useState } from 'react';
import { Image } from 'image-js';
import { DragContext } from '../context/DragContext';
import { ObjectInspector } from 'react-inspector';

export function StateObject({ image }: { image: Image }) {
  const { state } = useContext(DragContext);
  const [data, setData] = useState(state);
  useEffect(() => {
    setData(state);
  }, [image]);
  return (
    <div style={{ width: '80%', height: '100%' }}>
      <ObjectInspector expandLevel={2} data={data} />
    </div>
  );
}
