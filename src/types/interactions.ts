export interface ContainerInteractions {
  pan?: boolean;
  zoom?: boolean;
  unselect?: boolean;
}

export type ResolvedContainerInteractions = Required<ContainerInteractions>;

export const defaultContainerInteractions: ResolvedContainerInteractions = {
  pan: true,
  zoom: true,
  unselect: true,
};

export interface RoiInteractions {
  select?: boolean;
  move?: boolean;
  resize?: boolean;
  /**
   * Allow rotating the ROI with the rotation handle.
   */
  rotate?: boolean;
}

export type ResolvedRoiInteractions = Required<RoiInteractions>;

export function resolveRoiInteractions(
  interactions: RoiInteractions | undefined,
): ResolvedRoiInteractions {
  const {
    select = true,
    move = true,
    resize = true,
    rotate = true,
  } = interactions ?? {};
  return { select, move, resize, rotate };
}
