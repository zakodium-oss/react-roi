import type {
  ContainerInteractions,
  RoiMode,
  RoiProviderInitialConfig,
} from '../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  usePanZoomTransform,
  useRoiState,
  useTargetRef,
} from '../src/index.ts';

interface ContainerInteractionsTestComponentProps {
  mode?: RoiMode;
  interactions?: ContainerInteractions;
  selectedRoiId?: string;
}

/**
 * Renders a 500x500 target with two ROIs and exposes the pan / zoom transform
 * and the selected ROI id in the DOM so that tests can observe them.
 */
export function ContainerInteractionsTestComponent(
  props: ContainerInteractionsTestComponentProps,
) {
  const { mode = 'hybrid', interactions, selectedRoiId } = props;
  const initialConfig: RoiProviderInitialConfig<unknown> = {
    rois: initialRois(),
    mode,
    selectedRoiId,
    // Make the transform identity so that the target fills the container exactly.
    resizeStrategy: 'none',
  };
  return (
    <RoiProvider initialConfig={initialConfig}>
      <StateProbe />
      <div style={{ width: '500px', height: '500px' }}>
        <RoiContainer
          id="container"
          target={<Target />}
          interactions={interactions}
          zoomWithoutModifierKey
        >
          <RoiList />
        </RoiContainer>
      </div>
    </RoiProvider>
  );
}

function StateProbe() {
  const transform = usePanZoomTransform();
  const { selectedRoi } = useRoiState();
  return (
    <>
      <div data-testid="transform">{transform}</div>
      <div data-testid="selected">{selectedRoi ?? 'none'}</div>
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
      x: 0,
      y: 0,
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
