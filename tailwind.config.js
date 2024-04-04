import typographyPlugin from '@tailwindcss/typography'; // Import modul typography

export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: 'Poppins, sans-serif',
          },
        },
      }),
    },
  },
  plugins: [
    typographyPlugin,
  ],
};
