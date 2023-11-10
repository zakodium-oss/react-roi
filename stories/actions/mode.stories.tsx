import { Meta } from '@storybook/react';
import { useEffect, useRef } from 'react';

import {
  RoiContainer,
  RoiList,
  RoiMode,
  RoiProvider,
  useRoiActions,
} from '../../src';
import { Image } from '../utils/Image';
import { Layout } from '../utils/Layout';

export default {
  title: 'Actions',
} as Meta;

export function Mode() {
  // eslint-disable-next-line react/no-unstable-nested-components
  function ChangeModeButton() {
    const ref = useRef<HTMLSelectElement>(null);
    const { setMode } = useRoiActions();

    useEffect(() => {
      setMode('draw');
    }, [setMode]);

    function onChange() {
      if (!ref.current) return;

      const value = ref.current.value;
      setMode(value as RoiMode);
    }

    return (
      <select ref={ref} name="select-mode" onChange={onChange}>
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
