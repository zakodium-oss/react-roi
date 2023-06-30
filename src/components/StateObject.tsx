import { useContext } from 'react';
import { ObjectInspector } from 'react-inspector';

import { DynamicContext } from '../context/DynamicContext';

export function StateObject() {
  const { dynamicState } = useContext(DynamicContext);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}
    >
      <div style={{ width: '50%', height: '100%', padding: '15px' }}>
        <ObjectInspector expandLevel={2} data={{ dynamicState }} />
      </div>
      {/* <div style={{ width: '50%', height: '100%', padding: '15px' }}>
        <ObjectInspector expandLevel={2} data={state} />
      </div> */}
    </div>
  );
}
