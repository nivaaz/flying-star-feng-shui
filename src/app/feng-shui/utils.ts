import { text } from "stream/consumers";
import { elementNumberMap, elementRelationship } from "./charts";
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
    elHome: { element: Element; auspicious: boolean },
    nourishHome: Element, drainHome: Element,
    elCurrentYear: { element: Element; auspicious: boolean },
    nourishCurrentYear: Element, drainCurrentYear: Element
): string => {
    let textresponse = '';

    /**
     * check the home element 
      *  is it ausipicious?
        * check the noursh element
        * check the drain element 
     * check the current year element
         * is it ausipicious?   
        * check the noursh element
        * check the drain element 
     */
    if (elHome.auspicious && elCurrentYear.auspicious) {
        if (nourishCurrentYear === nourishHome) {
            textresponse += "Add " + nourishHome + " to enhance  .";
        }
        if (nourishHome === drainCurrentYear || elHome.element === drainCurrentYear) {
            textresponse += "remove " + drainCurrentYear + "in this location  .";
        }
        if (elCurrentYear.element === drainHome || nourishCurrentYear === drainHome) {
            textresponse += "remove " + drainHome + "in this location  .";
        }

        else if (drainHome === nourishCurrentYear) {
            textresponse += "remove " + drainHome + "in this location  .";
        } else {
            textresponse += "Add " + nourishHome + " and " + nourishCurrentYear + " .";
        }
    } else if (!elHome.auspicious && !elCurrentYear.auspicious) {
        if (elCurrentYear.element === elHome.element) {
            textresponse += `remove ${elHome.element}. `;
        }
        if (nourishHome === drainCurrentYear) {
            textresponse += "remove " + nourishHome + "in this location this permanently [current year] .";
        }
        if (drainHome === nourishCurrentYear) {
            textresponse += "remove " + nourishCurrentYear + "in this location this year [current year] .";
        }
        if (nourishHome === nourishCurrentYear) {
            textresponse += `remove ${nourishCurrentYear}`;
        }
        else {
            textresponse += "Add " + drainHome + " and " + drainCurrentYear + " if you can't remove " + elHome.element + " .";
        }
    }
    // mixed auspicious 
    else if (elHome.auspicious && !elCurrentYear.auspicious) {
        if (drainHome === nourishCurrentYear) {
            textresponse += `remove ${drainHome} this year.`
        }
        if (nourishHome === drainCurrentYear) {
            textresponse += `remove ${nourishHome} this year. Unless there is zero ${elCurrentYear.element}.`
        }
        if (nourishHome === nourishCurrentYear) {
            textresponse += `remove ${nourishCurrentYear} this year.`
        }
    }
    // mixed auspicious 
    else if (elHome.auspicious && !elCurrentYear.auspicious) {
        // if home element is the same as current year element
        if (elHome.element === elCurrentYear.element) {
            textresponse += `This cannot be balanced. Do not add ${elHome.element} this year.}  .`;
            textresponse += `If you can't remove  ${elHome.element}, ensure be sure to remove ${drainHome} and remove ${nourishHome}}  .`;
        }
        // if the drainhome is the same as the nourish
        if (drainHome === nourishCurrentYear) {
            textresponse += `remove ${drainHome} this year.  .`;
        }
        // if the nourishhome is the same as the drain
        else if (nourishHome === drainCurrentYear) {
            textresponse += `remove ${nourishHome} this year.  .`;
        }
    }
    return textresponse;
}

const addremoveBaseElement = (elHome: { element: Element; auspicious: boolean }, elCurrentYear: { element: Element; auspicious: boolean }): string => {
    let textResponse = (elHome.auspicious ? "Add " : "remove ") + elHome.element + ". [HOME, can be permamnent change] . ";
    if (elHome.element === elCurrentYear.element) {
        return textResponse
    }
    textResponse += (elCurrentYear.auspicious ? "Add " : "remove ") + elCurrentYear.element + ". [Current Year, non permanent change] . "
    return textResponse;
}

const shouldAddSaltCure = (elHome: { element: Element; auspicious: boolean }, elCurrentYear: { element: Element; auspicious: boolean }, drainHome: Element, drainCurrentYear: Element): string => {
    if (elHome.auspicious && elCurrentYear.auspicious) {
        return ""
    }
    if (drainHome == Element.water || drainCurrentYear == Element.water) {
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