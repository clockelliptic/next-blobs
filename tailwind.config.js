module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: '"BwModelica"'
      },
      colors: {
        'white': '#fff',
        'black': '#000',
        'green-spirulina': '#012021ff',
        'blue-glass': '#01C8CA12',
        'blue-spirulina': '#005b68ff',
        'blue-light-cyan': '#DDFBFBff',
        'blue-powder': '#4091F0ff',
        'blue-teal': '#00c8cbff',
        'blue-foam': '#d6fbfbff',
        'blue-skies': '#3b8ef3ff',
        'blue-depths': '#286eebff',
        'pink-mousse': '#F8B0D1ff',
        'pink-bubblegum': '#faafd1ff',
        'pink-rose': '#ff84b7ff',
        'yellow-golden': '#FEC53Dff',
        'yellow-mustard': '#ffc627ff',
        'orange-toast': '#ee6328ff',
        'red-blood': '#d44220ff',

        'focus': '#01C8CAff',
        'primary-typecolor': '#012021ff',
        'secondary-typecolor': '#286eebff'
      },
      boxShadow: {
        'outline-primary': '0 0 0 1px #ffffffff',
        'outline-primary-thick': '0 0 0 8px #ffffffff',
        'outline-primary-focus': '0 0 0 1px #01C8CAff',

        'menuClosed': '0 0 0 1px #286eebff',
        'menuSticky': '0 0 0 1px #ffffffff',
        'menuOpen': '0 0 0 1px #01C8CAff',
        'menuMorphed': '0 0 0 1px #ffffffff',

        'card': '1px 1px 11px -7px #000'
      }
    },
  },
  variants: {
    boxShadow: ['focus', 'hover']
  },
  plugins: [],
}