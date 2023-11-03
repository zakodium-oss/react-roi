import { Meta } from '@storybook/react';
import { RoiProvider } from '../src';
import { Box, BoxAnnotationProps } from '../src/components/Box';

export default {
  title: 'Box',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <RoiProvider>
        <Story />
      </RoiProvider>
    ),
  ],
  args: {
    id: 'abcd-efgh-ijkl-mnop',
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    label: 'Label of the box',
    className: 'orange',
    style: {
      backgroundColor: 'red',
    },
  },
} as Meta<BoxAnnotationProps>;

export function Control(props: BoxAnnotationProps) {
  return <Box {...props} />;
}

export function WithOnlyStyle(props: BoxAnnotationProps) {
  const { className, ...otherProps } = props;
  return <Box {...otherProps} />;
}

export function WithOnlyClassname(props: BoxAnnotationProps) {
  const { style, ...otherProps } = props;
  return <Box {...otherProps} />;
}
