const purgecss = {
    "@fullhuman/postcss-purgecss": {
        content: [
            './pages/**/*.{js,jsx,ts,tsx}',
            './components/**/*.{js,jsx,ts,tsx}',
        ],
        defaultExtractor: content => {
        const broadMatches = content.match(/[^<>"'`\\s]*[^<>"'`\\s:]/g) || [],
                innerMatches = content.match(/[^<>"'`\\s.()]*[^<>"'`\\s.():]/g) || [];
        return broadMatches.concat(innerMatches);
        }
    }
};

const production = process.env.NODE_ENV === 'production'

const productionPlugins = production ? {
                            ...purgecss,
                            "cssnano": {},
                            "postcss-discard-comments": { removeAll: true }
                        } : {};

module.exports = {
    plugins: {
        "postcss-import": {},
        "tailwindcss": {},
        "postcss-simple-vars": {},
        "postcss-nested": { bubble: ['screen'] },
        "autoprefixer": {},
        ...productionPlugins,
        "postcss-preset-env": {},
    }
}