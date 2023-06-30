import { DynamicAction, RoiActions } from '../../context/DynamicContext';
import { RoiStateType } from '../../types/RoiStateType';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function selectObject(
  event: React.MouseEvent,
  roiState: RoiStateType,
  roiDispatch: React.Dispatch<DynamicAction>,
) {
  const { rois, roiID, ratio } = roiState;
  const object = rois.find((obj) => obj.id === roiID);
  if (!object) return;
  const scaledRectangle = getScaledRectangle(object.rectangle, ratio);

  roiDispatch({
    type: 'setRoiState',
    payload: {
      action: RoiActions.DRAG,
      delta: {
        dx:
          event.clientX -
          scaledRectangle.origin.column -
          roiState.offset?.left,
        dy:
          event.clientY - scaledRectangle.origin.row - roiState.offset?.top,
      },
    },
  });
}
