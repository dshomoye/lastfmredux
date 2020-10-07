module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './pages/**/*.js',
    './.next/**/*.js',
    './.next/**/*.html',
    './.next/**/*.css'
  ],
  theme: {
    extend: {},
    container: {
      center: true,
    },
  },
  variants: {},
  plugins: [],
}
