import type { RoiInteractions, RoiMode } from '../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  useCommittedRois,
  useRoiState,
  useTargetRef,
} from '../src/index.ts';

const DEFAULT_INTERACTIONS: Record<string, RoiInteractions> = {};

interface RoiInteractionsTestComponentProps {
  mode?: RoiMode;
  /**
   * Interactions per ROI id. Must be serializable because it crosses the Playwright boundary.
   */
  interactions?: Record<string, RoiInteractions>;
  selectedRoiId?: string;
  showRotationHandle?: boolean;
  showGrid?: boolean;
}

/**
 * Renders a 500x500 target with two ROIs and exposes the selected ROI id,
 * the number of committed ROIs and the geometry of each ROI in the DOM.
 */
export function RoiInteractionsTestComponent(
  props: RoiInteractionsTestComponentProps,
) {
  const {
    mode = 'hybrid',
    interactions = DEFAULT_INTERACTIONS,
    selectedRoiId,
    showRotationHandle = false,
    showGrid = false,
  } = props;
  return (
    <RoiProvider
      initialConfig={{
        rois: initialRois(),
        mode,
        selectedRoiId,
        resizeStrategy: 'none',
      }}
    >
      <StateProbe />
      <div style={{ width: '500px', height: '500px' }}>
        <RoiContainer id="container" target={<Target />}>
          <RoiList
            getInteractions={({ id }) => interactions[id]}
            showRotationHandle={showRotationHandle}
            showGrid={showGrid}
          />
        </RoiContainer>
      </div>
    </RoiProvider>
  );
}

function StateProbe() {
  const { selectedRoi = 'none' } = useRoiState();
  const rois = useCommittedRois();
  return (
    <>
      <div data-testid="selected">{selectedRoi}</div>
      <div data-testid="count">{rois.length}</div>
      {rois.map((roi) => (
        <div key={roi.id} data-testid={`geometry-${roi.id}`}>
          {[roi.x, roi.y, roi.width, roi.height, roi.angle.toFixed(3)].join(
            ',',
          )}
        </div>
      ))}
    </>
  );
}

function Target() {
  const ref = useTargetRef<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ width: '500px', height: '500px', backgroundColor: 'lightblue' }}
    />
  );
}

function initialRois() {
  return [
    {
      id: 'box-1',
      label: 'box1',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      angle: 0,
    },
    {
      id: 'box-2',
      label: 'box2',
      x: 300,
      y: 300,
      width: 100,
      height: 100,
      angle: 0,
    },
  ];
}
