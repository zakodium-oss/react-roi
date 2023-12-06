import { Meta } from '@storybook/react';
import { ChangeEvent, useEffect } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiMode,
  RoiProvider,
  TargetImage,
  useActions,
} from '../../../src';
import { CommittedRoisButton } from '../../utils/CommittedRoisButton';
import { Layout } from '../../utils/Layout';

export default {
  title: 'hooks/useActions',
} as Meta;

export function ChangeMode() {
  function ChangeModeButton() {
    const { setMode } = useActions();

    useEffect(() => {
      setMode('draw');
    }, [setMode]);

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
      setMode(event.target.value as RoiMode);
    }

    return (
      <select name="select-mode" onChange={onChange}>
        <option value="draw">Draw</option>
        <option value="select">Select</option>
      </select>
    );
  }

  return (
    <RoiProvider>
      <Layout>
        <ChangeModeButton />
        <RoiContainer target={<TargetImage src="/barbara.jpg" />}>
          <RoiList />
        </RoiContainer>
        <CommittedRoisButton />
      </Layout>
    </RoiProvider>
  );
}
