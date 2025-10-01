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
    textresponse += `Stars: .#${starHome} | ${elHome.element} - ${elHome.theme} [HOME] .#${starCurrentYear} | ${elCurrentYear.element} - ${elCurrentYear.theme} [Current Year] .`;
    textresponse += shouldAddSaltCure(elHome, elCurrentYear, drainHome, drainCurrentYear) + " .";
    textresponse += addremoveBaseElement(elHome, elCurrentYear) + " ."; // TODO:
    textresponse += reccomendElements(elHome, nourishHome, drainHome, elCurrentYear, nourishCurrentYear, drainCurrentYear) + " .";
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
        if (el.includes("remove")) {
            const idx = uniqueElements.findIndex(e => e === "add " + currEl);
            if (idx !== -1) {
                return "\n remove " + currEl;
            }
            return "\n " + el;
        } else if (el.includes("add")) {
            const idx = uniqueElements.findIndex(e => e === "remove " + currEl);
            if (idx !== -1) {
                return "\n remove " + currEl;
            }
            return "\n " + el;
        }
        return "\n " + el;
    });

    return Array.from(new Set(textresponse)).join(" . ");

}

const addremoveBaseElement = (elHome: { element: Element; auspicious: boolean }, elCurrentYear: { element: Element; auspicious: boolean }): string => {
    let textResponse = (elHome.auspicious ? "Add " : "remove ") + elHome.element + ". [HOME, can be permamnent change] . ";
    if (elHome.element === elCurrentYear.element) {
        return textResponse
    }
    textResponse += (elCurrentYear.auspicious ? "Add " : "remove ") + elCurrentYear.element + ". [Current Year, non permanent change] . "
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
            return "NO salt cure here.  .";
        }
    }
    if (!elCurrentYear.auspicious) {
        if (drainCurrentYear === Element.water) {
            return "NO salt cure here.  .";
        }
    }
    if (drainHome === Element.water || drainCurrentYear === Element.water) {
        return "NO salt cure here.  .";
    }
    return "ADD a salt cure here.  .";
}

const getAuspiciousnessLevel = (auspiciousness1: boolean, auspiciousness2: boolean): string => {
    if (auspiciousness1 && auspiciousness2) {
        return "This is one of the best areas of your home . Add astrocartography here .";
    } else if (!auspiciousness1 && !auspiciousness2) {
        return "This is one of the worst areas of your home. Spend less time here .";
    } else {
        return "This is a mixed area of your home .";
    }
}


export const ElementExamples = {
    "fire": "Candles, fireplaces, lamps, lighting (especiy bright or warm), incense burners, triangle-shaped décor, triangle motifs in art or textiles, animal prints, red cushions, red rugs, red throws, sun symbols, phoenix imagery, active electronics (TVs, toasters, hairdryers).",
    "earth": "Clay pottery, ceramic tiles, ceramic bowls, bricks, stone surfaces, marble countertops, crystals (amethyst, citrine, rose quartz), terra-cotta planters, beige or earth-tone rugs, square coffee tables, low wide furniture (ottomans, sideboards), salt lamps.",
    "metal": "Metal picture frames, metal bowls, stainless steel appliances, silver sculptures, gold sculptures, round mirrors, wind chimes, quartz stones, white stones, metic w art, metic wpaper, bells, clocks, tools, white linens, smooth surfaces and finishes.",
    "water": "Mirrors, glass tables, glass vases, aquariums, fish tanks, water fountains, wavy-patterned fabric, wavy art, navy curtains, navy rugs, ocean artwork, lake imagery, rain imagery, deep blue cushions, abstract or asymmetrical décor forms.",
    "wood": "Wooden tables, chairs, shelves, potted plants, trees, herbs, wicker furniture, rattan furniture, botanical wpaper, botanical artwork, books, vertical stripes, t decor pieces, fresh flowers in vases, essential oil diffusers, bamboo blinds.",
}
