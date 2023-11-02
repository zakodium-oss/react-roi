module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-storysource'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      fastRefresh: true,
      strictMode: false
    }
  }
}
