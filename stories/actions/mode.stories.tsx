import { Meta } from '@storybook/react';
import { ChangeEvent, useEffect } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiMode,
  RoiProvider,
  useActions,
} from '../../src';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';

export default {
  title: 'Actions',
} as Meta;

export function Mode() {
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
    <Layout>
      <RoiProvider>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <ChangeModeButton />

          <RoiContainer target={<Image />}>
            <RoiList />
          </RoiContainer>
        </div>
      </RoiProvider>
    </Layout>
  );
}
