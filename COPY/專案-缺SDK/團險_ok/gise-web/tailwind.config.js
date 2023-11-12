/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: ['bg-primary', 'bg-secondary', 'bg-warning', 'bg-danger', 'bg-info', 'bg-neutral', 'ml-4'],
  theme: {
    extend: {
      backgroundImage: () => ({
        'gradient-primary': `linear-gradient(90deg,#4CAAF5,#28B4BE,#28B4BE,#4CAAF5)`,
        'gradient-header': `linear-gradient(to right, #008FC7, #009E9C)`,
        'gradient-cardHeader': `linear-gradient(to bottom, #1489D1, #20B6B2)`,
      }),
    },

    screens: {
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1366px',
    },

    container: {
      center: true,
      screens: {
        md: '720px',
        lg: '872px',
        xl: '1088px',
        xxl: '1200px',
      },
    },

    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#333333',
      primary: {
        DEFAULT: '#4CAAF5',
        light: '#69B7F5',
      },
      secondary: {
        DEFAULT: '#73B5EA',
      },
      warning: {
        DEFAULT: '#FAAD14',
        light: '#FFFFF2',
      },
      danger: {
        DEFAULT: '#F77878',
        light: '#FFEDED',
      },
      info: {
        DEFAULT: '#1589D1',
        light: '#F2F8FF',
      },
      success: {
        DEFAULT: '#52C41A',
      },
      neutral: {
        DEFAULT: '#6A6A6A',
        entry: '#D9D9D9',
        light: '#FAFAFA',
      },
    },

    fontSize: {
      sm: ['12px', '18px'],
      base: ['14px', '20px'],
      lg: ['16px', '24px'],
      xl: ['18px', '26px'],
      '2xl': ['20px', '30px'],
      '3xl': ['24px', '32px'],
    },

    fontFamily: {
      mark: ['SimSun', 'sans-serif'],
    },
  },

  plugins: [],
}
