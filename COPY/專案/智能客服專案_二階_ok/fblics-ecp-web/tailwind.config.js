/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  mode: 'jit',
  theme: {
    extend: {
      backgroundImage: () => ({
        gradient: `linear-gradient(to right, #0089D1, #01B6AD)`,
        system: "url('/src/assets/imgs/bg/image_applebg.svg')",
        cardType: "url('/src/assets/imgs/bg/image_lemonbg.svg')",
        reviewType: "url('/src/assets/imgs/bg/image_grapebg.svg')",
        chatMonitoringType: "url('/src/assets/imgs/bg/image_blueberrybg.svg')",
        reportType: "url('/src/assets/imgs/bg/image_blueberrybg.svg')",

        messageLeft: "url('/src/assets/imgs/message_left.svg')",
        messageWrittingLeft: "url('/src/assets/imgs/message_writting_left.svg')",
        messageRight: "url('/src/assets/imgs/message_right.svg')",
      }),
    },

    // 響應式 尺寸
    screens: {
      md: '1006px',
      lg: '1634px',
    },

    // 標準色
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#333333',
      primary: {
        DEFAULT: '#0089D1',
        light: '#EFF7FC',
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
        light: '#FFE8E8',
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
        light: '#F5F8FA',
        light2: '#999',
        light3: '#F5F5F5',
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
  },

  plugins: [],
}
