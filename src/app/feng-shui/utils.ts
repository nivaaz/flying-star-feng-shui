import { text } from "stream/consumers";
import { currentYear, elementNumberMap, elementRelationship } from "./charts";
import { Element, Star } from "./types";

export const getNourishingElement = (curentElement: Element): Element => {
    const index = elementRelationship.indexOf(curentElement);
    return elementRelationship[getCircularIndex(index - 1)];
}
export const getDrainingElement = (curentElement: Element): Element => {
    const index = elementRelationship.indexOf(curentElement);
    return elementRelationship[getCircularIndex(index + 1)];
}

const getCircularIndex = (index: number) => {
    if (index < 0) {
        return (elementRelationship.length + index) % elementRelationship.length
    }
    return index % elementRelationship.length
}

/**
 * 
 * @param starHome 
 * @param starCurrentYear 
 * @returns 
 */
export const generateFengShuiTemplate = (starHome: Star, starCurrentYear: Star) => {
    const elHome = elementNumberMap[starHome];
    const nourishHome = getNourishingElement(elHome.element);
    const drainHome = getDrainingElement(elHome.element);

    const elCurrentYear = elementNumberMap[starCurrentYear];
    const nourishCurrentYear = getNourishingElement(elCurrentYear.element);
    const drainCurrentYear = getDrainingElement(elCurrentYear.element);

    let textresponse = getAuspiciousnessLevel(elHome.auspicious, elCurrentYear.auspicious);
    textresponse += `\n\nStars:\n - [HOME] ${starHome} | ${elHome.element} - ${elHome.theme}\n - [YEAR] ${starCurrentYear} | ${elCurrentYear.element} - ${elCurrentYear.theme}.`;
    textresponse += "\n\n⚪️ In this area:\n";
    textresponse += "\n" + shouldAddSaltCure(elHome, elCurrentYear, drainHome, drainCurrentYear) + ".";
    textresponse += "\nThe elements for the two ruling stars here: add/remove these first, then balance with secondary elements.\n" + addremoveBaseElement(elHome, elCurrentYear) + ".";
    textresponse += "\n" + reccomendElements(elHome, nourishHome, drainHome, elCurrentYear, nourishCurrentYear, drainCurrentYear) + ".";
    return textresponse;

}

/**
 * 
 * @param elHome 
 * @param nourishHome 
 * @param drainHome 
 * @param elCurrentYear 
 * @param nourishCurrentYear 
 * @param drainCurrentYear 
 * @returns 
 */
export const reccomendElements = (
    elHome: {
        element: Element;
        auspicious: boolean
    },
    nourishHome: Element,
    drainHome: Element,
    elCurrentYear: {
        element: Element; auspicious: boolean
    },
    nourishCurrentYear: Element,
    drainCurrentYear: Element
): string => {
    // TODO: try using an array instead. Obvious focus more on the element, and then seconsary on the enhancers. 
    const homeels = [
        elHome.auspicious ? "add " + elHome.element : "remove " + elHome.element,
        (elHome.auspicious ? "add " : "remove ") + nourishHome,
        (elHome.auspicious ? "remove " : "add ") + drainHome
    ]
    const currentYearels = [
        elCurrentYear.auspicious ? "add " + elCurrentYear.element : "remove " + elCurrentYear.element,
        (elCurrentYear.auspicious ? "add " : "remove ") + nourishCurrentYear,
        (elCurrentYear.auspicious ? "remove " : "add ") + drainCurrentYear
    ];
    const allElements = [...homeels, ...currentYearels];

    const uniqueElements = Array.from(new Set(allElements)); // remove duplicates 

    const textresponse = uniqueElements.map(el => {
        const currEl = el.split(" ")[1].trim();
        const elExamples = (shortElementsExamples[currEl as keyof typeof shortElementsExamples] ? ` (${shortElementsExamples[currEl as keyof typeof shortElementsExamples]})` : "");

        if (el.includes("remove")) {
            const idx = uniqueElements.findIndex(e => e === "add " + currEl);
            if (idx !== -1) {
                return "\n 📌 remove " + currEl + " " + elExamples;
            }
            return "\n 📌 " + el + " " + elExamples;
        } else if (el.includes("add")) {
            const idx = uniqueElements.findIndex(e => e === "remove " + currEl);
            if (idx !== -1) {
                return "\n 📌 remove " + currEl + " " + elExamples;
            }
            return "\n ✅ " + el + " " + elExamples;
        }
        return "\n " + el + " " + elExamples;
    });

    return "\n" + Array.from(new Set(textresponse)).join(" . ");

}

const addremoveBaseElement = (elHome: { element: Element; auspicious: boolean }, elCurrentYear: { element: Element; auspicious: boolean }): string => {
    let textResponse = "\n - " + (elHome.auspicious ? "Add " : "remove ") + elHome.element + " [HOME, can be a permanent change].";
    if (elHome.element === elCurrentYear.element) {
        return textResponse
    }
    textResponse += "\n - " + (elCurrentYear.auspicious ? "Add " : "remove ") + elCurrentYear.element + " [CURRENT YEAR, keep non-permanent]."
    return textResponse;
}

const shouldAddSaltCure = (
    elHome: { element: Element; auspicious: boolean },
    elCurrentYear: { element: Element; auspicious: boolean },
    drainHome: Element, drainCurrentYear: Element): string => {
    if (elHome.auspicious && elCurrentYear.auspicious) {
        return ""
    }
    if (!elHome.auspicious) {
        if (drainHome === Element.water) {
            return "NO salt cure here.\n";
        }
    }
    if (!elCurrentYear.auspicious) {
        if (drainCurrentYear === Element.water) {
            return "NO salt cure here.\n";
        }
    }
    if (drainHome === Element.water || drainCurrentYear === Element.water) {
        return "NO salt cure here.\n";
    }
    return "🧂 ADD a salt cure here.\n";
}

const getAuspiciousnessLevel = (auspiciousness1: boolean, auspiciousness2: boolean): string => {
    if (auspiciousness1 && auspiciousness2) {
        return "⭐️ This is one of the best areas of your home . \n ⭐️ Add astrocartography here.";
    } else if (!auspiciousness1 && !auspiciousness2) {
        return "‼️ This is one of the worst areas of your home. Spend less time here.";
    } else {
        return "🌀 This is a mixed area of your home.";
    }
}


export const ElementExamples = {
    "fire": "Candles, fireplaces, lamps, lighting (especiy bright or warm), incense burners, triangle-shaped décor, triangle motifs in art or textiles, animal prints, red cushions, red rugs, red throws, sun symbols, phoenix imagery, active electronics (TVs, toasters, hairdryers).",
    "earth": "Clay pottery, ceramic tiles, ceramic bowls, bricks, stone surfaces, marble countertops, crystals (amethyst, citrine, rose quartz), terra-cotta planters, beige or earth-tone rugs, square coffee tables, low wide furniture (ottomans, sideboards), salt lamps.",
    "metal": "Metal picture frames, metal bowls, stainless steel appliances, silver sculptures, gold sculptures, round mirrors, wind chimes, quartz stones, white stones, metic w art, metic wpaper, bells, clocks, tools, white linens, smooth surfaces and finishes.",
    "water": "Mirrors, glass tables, glass vases, aquariums, fish tanks, water fountains, wavy-patterned fabric, wavy art, navy curtains, navy rugs, ocean artwork, lake imagery, rain imagery, deep blue cushions, abstract or asymmetrical décor forms.",
    "wood": "Wooden tables, chairs, shelves, potted plants, trees, herbs, wicker furniture, rattan furniture, botanical wpaper, botanical artwork, books, vertical stripes, t decor pieces, fresh flowers in vases, essential oil diffusers, bamboo blinds.",
}

const shortElementsExamples = {
    "fire": "candles, lighting elements, electronics, triangle, animals.",
    "earth": "clay, pottery, ceramic tiles, stone surfaces, marble, earth colours, salt lamps.",
    "metal": "metal picture frames, metal bowls, steel, silver, gold, wind chimes.",
    "water": "mirrors, glass, water fountains, wavy-patterns, ocean artwork, blue.",
    "wood": "plants, wood, books, vertical stripes, botanical artwork.",
}
