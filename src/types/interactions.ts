/**
 * Interactions the user may perform on the container with the pointer.
 * Every interaction is allowed unless explicitly set to `false`.
 * These settings only affect pointer interactions. The actions API is never restricted.
 */
export interface ContainerInteractions {
  /**
   * Allow panning the target, either with the alt key + drag, the middle / right mouse button,
   * or a plain drag on empty space when in `select` mode.
   * @default true
   */
  pan?: boolean;
  /**
   * Allow zooming the target with the mouse wheel.
   * @default true
   */
  zoom?: boolean;
  /**
   * Allow unselecting the current ROI by clicking on empty space of the container.
   * When `false`, a click on empty space (or a cancelled draw) keeps the current ROI selected.
   * @default true
   */
  unselect?: boolean;
}

export type ResolvedContainerInteractions = Required<ContainerInteractions>;

export const defaultContainerInteractions: ResolvedContainerInteractions = {
  pan: true,
  zoom: true,
  unselect: true,
};
