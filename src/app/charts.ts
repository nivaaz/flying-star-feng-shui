export type Element = "fire" | "earth" | "wood" | "metal" | "water";
export const directions = [
  ["SW", "S", "SE"],
  ["W", "C", "E"],
  ["NW", "N", "NE"],
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

export const elementNumberMap: Record<Star, { auspicious: boolean, color: string, elementIcon: string, element: Element }> = {
    1: {
        auspicious: true, color: 'black', elementIcon: '💧'
        , element: 'water'
    },
    2: {
        auspicious: false, color: 'black', elementIcon: '🌏'
        , element: 'earth'
    },
    3: {
        auspicious: false, color: 'jade', elementIcon: '🪵'
        , element: 'wood'
    },
    4: {
        auspicious: true, color: 'green', elementIcon: '🪵'
        , element: 'wood'
    },
    5: {
        auspicious: false, color: 'yellow', elementIcon: '🌏'
        , element: 'earth'
    },
    6: {
        auspicious: true, color: 'white', elementIcon: '🪙'
        , element: 'metal'
    },
    7: {
        auspicious: false, color: 'red', elementIcon: '🪙'
        , element: 'metal'
    },
    8: {
        auspicious: true, color: 'white', elementIcon: '🌏'
        , element: 'earth'
    },
    9: {
        auspicious: true, color: 'purple', elementIcon: '🔥'
        , element: 'fire'
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


