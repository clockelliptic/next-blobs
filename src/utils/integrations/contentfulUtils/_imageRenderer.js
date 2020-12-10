const resolveConfig = require("tailwindcss/resolveConfig")
const tailwindConfig = require("../../../../tailwind.config");

const fullConfig = resolveConfig(tailwindConfig);
const ORDERED_FORMATS = ["webp", "jpg"];
const TARGET_SCALE_FACTOR = 0.8;

module.exports = (src, alt, dimensions) => {
    let targetScreens = calcTargetScreens(dimensions)
    let widths = calcWidths(targetScreens)

    if (widths) return `
        <div class="blogImageContainer">
            <picture>
                ${
                    widths.map(width => {
                        return ORDERED_FORMATS.map(fmt => {
                            return `
                                <source type="${mimeType(fmt)}" srcset="${srcset(src, width, fmt)}"  media="${mediaQuery(widths, width, targetScreens)}" />
                            `
                        }).join('\n')
                    }).join('\n')
                }
                <img class="blogImage" src="${src}" alt="${alt}" />
            </picture>
        </div>
    `;
}

/*
    Helper functions for generating img src set
 */

function calcWidths(targetScreens) {  
    return targetScreens.map(s => Math.floor(TARGET_SCALE_FACTOR * s));
}
function srcset(src, width, fmt) {
    const url = `${src}?fm=${fmt}&w=${width}`;
    return `${url}`;
}

function calcTargetScreens(dimensions) {
    const screenSizesPx = Object.values(fullConfig.theme.screens).map(s =>
        parseInt(s.substring(0, s.length - 2), 10)
    );
    return screenSizesPx.filter(s => s <= dimensions.width);
}

function mediaQuery(widths, width, targetScreens) {
    const index = widths.indexOf(width);
    return `(max-width: ${targetScreens[index]}px)`;
}

function mimeType(fmt) {
    const key = { jpg: "image/jpeg", webp: "image/webp" };
    return key[fmt];
}