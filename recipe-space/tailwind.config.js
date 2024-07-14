module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // 프로젝트의 경로에 맞게 수정하세요
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
