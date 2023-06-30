import { useContext } from 'react';
import { ObjectInspector } from 'react-inspector';

import { RoiContext } from '../context/RoiContext';

export function StateObject() {
  const { roiState } = useContext(RoiContext);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}
    >
      <div style={{ width: '50%', height: '100%', padding: '15px' }}>
        <ObjectInspector expandLevel={2} data={{ roiState }} />
      </div>
      {/* <div style={{ width: '50%', height: '100%', padding: '15px' }}>
        <ObjectInspector expandLevel={2} data={state} />
      </div> */}
    </div>
  );
}
