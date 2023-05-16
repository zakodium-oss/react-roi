import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { ObjectInspector } from 'react-inspector';

export function StateObject() {
  const { state, eventState } = useContext(DataContext);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}
    >
      <div style={{ width: '50%', height: '100%', padding: '15px' }}>
        <ObjectInspector expandLevel={2} data={eventState} />
      </div>
      <div style={{ width: '50%', height: '100%', padding: '15px' }}>
        <ObjectInspector expandLevel={2} data={state} />
      </div>
    </div>
  );
}
