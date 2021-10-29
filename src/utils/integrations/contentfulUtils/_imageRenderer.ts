import resolveConfig from "tailwindcss/resolveConfig";
import { TailwindConfig } from "tailwindcss/tailwind-config";
import tailwindConfig from "../../../../tailwind.config";

const fullConfig = resolveConfig((tailwindConfig as unknown as TailwindConfig));
const ORDERED_FORMATS = ["webp", "jpg"];
const TARGET_SCALE_FACTOR = 0.8;

type Dimensions = {width?: number, height?: number};

export const imageRenderer = (src: string, alt: string, dimensions: Dimensions) => {
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

function calcTargetScreens(dimensions: Dimensions) {
    const screenSizesPx = Object.values(fullConfig.theme.screens).map((s: string) =>
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