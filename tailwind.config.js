/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}', './src/libs/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1E3A8A',
          base: '#2563EB',
          50: '#eff3ff',
          100: '#dbe4fe',
          200: '#bfcffe',
          300: '#93aefd',
          400: '#6088fa',
          500: '#3b6bf6',
          600: '#2558eb',
          700: '#1d4dd8',
          800: '#1e44af',
          900: '#1e3a8a',
          950: '#172754',
        },
        neutral: {
          light: '#F3F4F6',
          medium: '#6B7280',
          dark: '#111827',
        },
        status: {
          success: '#16A34A',
          warning: '#FACC15',
          error: '#DC2626',
        },
      },
    },
  },
  plugins: [],
};
