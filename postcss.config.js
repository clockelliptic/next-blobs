const purgecss = {
    "@fullhuman/postcss-purgecss": {
        content: [
            './src/pages/**/*.{js,jsx,ts,tsx}',
            './src/pages/**/**/*.{js,jsx,ts,tsx}',
            './src/components/**/*.{js,jsx,ts,tsx}',
            './src/components/**/**/*.{js,jsx,ts,tsx}',
            './src/components/**/**/**/*.{js,jsx,ts,tsx}',
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
        "autoprefixer": {},
        "postcss-preset-env": { stage: 1 },
        ...productionPlugins,
    }
}