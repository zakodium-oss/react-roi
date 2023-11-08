import { Meta } from '@storybook/react';
import { Layout } from '../utils/Layout';
import { RoiContainer, RoiList, RoiProvider, useRoiActions } from '../../src';
import { Image } from '../utils/Image';
import { useEffect, useRef } from 'react';

export default {
  title: 'Actions',
} as Meta;

export function Mode() {
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

function ChangeModeButton() {
  const ref = useRef<HTMLSelectElement>(null);
  const { setMode } = useRoiActions();

  useEffect(() => {
    setMode('draw');
  }, []);

  function onChange() {
    if (!ref.current) return;

    // @ts-expect-error value does not exist
    const value = ref.current.value;
    setMode(value);
  }

  return (
    <select ref={ref} name="select-mode" onChange={onChange}>
      <option value="draw">Draw</option>
      <option value="select">Select</option>
    </select>
  );
}
