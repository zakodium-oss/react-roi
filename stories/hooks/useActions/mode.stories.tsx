import type { Meta } from '@storybook/react-vite';
import type { ChangeEvent } from 'react';

import type { RoiMode } from '../../../src/index.ts';
import {
  RoiContainer,
  RoiList,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../../src/index.ts';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton.tsx';
import { Layout } from '../../utils/Layout.tsx';

export default {
  title: 'hooks/useActions',
} as Meta;

export function ChangeMode() {
  function ChangeModeButton() {
    const { setMode } = useActions();

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
      setMode(event.target.value as RoiMode);
    }

    return (
      <select name="select-mode" onChange={onChange}>
        <option value="hybrid">Hybrid</option>
        <option value="draw">Draw</option>
        <option value="select">Select</option>
        <option value="select_rotate">Rotate selected</option>
      </select>
    );
  }

  return (
    <RoiProvider initialConfig={{}}>
      <Layout>
        <ChangeModeButton />
        <RoiContainer
          target={<TargetImage id="story-image" src="/barbara.jpg" />}
        >
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}
