export type Element = "fire" | "earth" | "wood" | "metal" | "water";
export const directions = [
    ["SE", "S", "SW"],
    ["E", "C", "W"],
    ["NE", "N", "NW"],
];

export const currentYear: Star[][] = [
    [2, 7, 9],
    [1, 3, 5],
    [6, 8, 4],
]
export const period9: Star[][] = [
    [8, 4, 6],
    [7, 9, 2],
    [3, 5, 1],
]
export type Star = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const elementNumberMap: Record<Star, { auspicious: boolean, color: string, elementIcon: string, theme: string; element: Element }> = {
    1: {
        auspicious: true, color: 'black', elementIcon: '💧',
        theme: "fame and wealth ", element: 'water'
    },
    2: {
        auspicious: false, color: 'black', elementIcon: '🌏',
        theme: " illness", element: 'earth'
    },
    3: {
        auspicious: false, color: 'jade', elementIcon: '🪵',
        theme: " quarrels", element: 'wood'
    },
    4: {
        auspicious: true, color: 'green', elementIcon: '🪵',
        theme: " intelligence & education", element: 'wood'
    },
    5: {
        auspicious: false, color: 'yellow', elementIcon: '🌏',
        theme: "  illness and misfortune", element: 'earth'
    },
    6: {
        auspicious: true, color: 'white', elementIcon: '🪙',
        theme: " wealth & career promotion", element: 'metal'
    },
    7: {
        auspicious: false, color: 'red', elementIcon: '🪙',
        theme: "conflicts & arguments ", element: 'metal'
    },
    8: {
        auspicious: true, color: 'white', elementIcon: '🌏',
        theme: " health & wealth", element: 'earth'
    },
    9: {
        auspicious: true, color: 'purple', elementIcon: '🔥',
        theme: "celebration star, rules all things auspicious ", element: 'fire'
    },
}

export const elementRelationship: Element[] = [
    "fire", "earth", "metal", "water", "wood"
]


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


