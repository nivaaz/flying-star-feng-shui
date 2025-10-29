const Signs: ZodiacSigns[] = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
];

type ZodiacSigns = "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo" | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export const houseIndexByRisingSign = (rising: ZodiacSigns, sign: ZodiacSigns) => {
    const risingIndex = Signs.indexOf(rising);
    const signIndex = Signs.indexOf(sign);
    return (signIndex - risingIndex + 12) % 12 + 1;
}

export const findRisingSign = (planets: AstrologyPlanet[]): ZodiacSigns => {
    const ascendant = planets.find(planet => planet.planet.en === "Ascendant");
    return ascendant ? (ascendant.zodiac_sign.name.en as ZodiacSigns) : "Aries";
};

export type AstrologyPlanet = {
    planet: {
        en: string;
    };
    fullDegree: number;
    normDegree: number;
    isRetro: string;
    zodiac_sign: {
        number: number;
        name: {
            en: string;
        };
    };
};

export type AstrologyAspect = {
    planet_1: {
        en: string;
    };
    planet_2: {
        en: string;
    };
    aspect: {
        en: string;
    };
};



export const astrologyDefaultData = {
    "planets": {
        "statusCode": 200,
        "output": [
            {
                "planet": {
                    "en": "Ascendant"
                },
                "fullDegree": 114.07928000779809,
                "normDegree": 24.07928000779809,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 4,
                    "name": {
                        "en": "Cancer"
                    }
                }
            },
            {
                "planet": {
                    "en": "Sun"
                },
                "fullDegree": 251.3371392049412,
                "normDegree": 11.337139204941195,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 9,
                    "name": {
                        "en": "Sagittarius"
                    }
                }
            },
            {
                "planet": {
                    "en": "Moon"
                },
                "fullDegree": 92.14350027871964,
                "normDegree": 2.1435002787196424,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 4,
                    "name": {
                        "en": "Cancer"
                    }
                }
            },
            {
                "planet": {
                    "en": "Mars"
                },
                "fullDegree": 153.55430024654981,
                "normDegree": 3.554300246549815,
                "isRetro": "false",
                "zodiac_sign": {
                    "number": 6,
                    "name": {
                        "en": "Virgo"
                    }
                }
            },
            {
                "planet": {
                    "en": "Mercury"
                },
                "fullDegree": 264.6416545138003,
                "normDegree": 24.64165451380029,
                "isRetro": "true",
                "zodiac_sign": {
                    "number": 9,
                    "name": {
                        "en": "Sagittarius"
                    }
                }
            },
            {
                "planet": {
                    "en": "Jupiter"
                },
                "fullDegree": 270.1308172545715,
                "normDegree": 0.13081725457152515,
                "isRetro": "false",
                "zodiac_sign": {
                    "number": 10,
                    "name": {
                        "en": "Capricorn"
                    }
                }
            },
            {
                "planet": {
                    "en": "Venus"
                },
                "fullDegree": 227.94341584868334,
                "normDegree": 17.943415848683344,
                "isRetro": "false",
                "zodiac_sign": {
                    "number": 8,
                    "name": {
                        "en": "Scorpio"
                    }
                }
            },
            {
                "planet": {
                    "en": "Saturn"
                },
                "fullDegree": 337.278446790423,
                "normDegree": 7.278446790423004,
                "isRetro": "false",
                "zodiac_sign": {
                    "number": 12,
                    "name": {
                        "en": "Pisces"
                    }
                }
            },
            {
                "planet": {
                    "en": "Uranus"
                },
                "fullDegree": 279.1687492583086,
                "normDegree": 9.168749258308594,
                "isRetro": "false",
                "zodiac_sign": {
                    "number": 10,
                    "name": {
                        "en": "Capricorn"
                    }
                }
            },
            {
                "planet": {
                    "en": "Neptune"
                },
                "fullDegree": 272.82399474097656,
                "normDegree": 2.823994740976559,
                "isRetro": "false",
                "zodiac_sign": {
                    "number": 10,
                    "name": {
                        "en": "Capricorn"
                    }
                }
            },
            {
                "planet": {
                    "en": "Pluto"
                },
                "fullDegree": 220.37874030759247,
                "normDegree": 10.378740307592466,
                "isRetro": "false",
                "zodiac_sign": {
                    "number": 8,
                    "name": {
                        "en": "Scorpio"
                    }
                }
            },
            {
                "planet": {
                    "en": "Ceres"
                },
                "fullDegree": 286.8510336608796,
                "normDegree": 16.85103366087958,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 10,
                    "name": {
                        "en": "Capricorn"
                    }
                }
            },
            {
                "planet": {
                    "en": "Vesta"
                },
                "fullDegree": 294.4962027713696,
                "normDegree": 24.49620277136961,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 10,
                    "name": {
                        "en": "Capricorn"
                    }
                }
            },
            {
                "planet": {
                    "en": "Juno"
                },
                "fullDegree": 13.363055266535882,
                "normDegree": 13.363055266535882,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 1,
                    "name": {
                        "en": "Aries"
                    }
                }
            },
            {
                "planet": {
                    "en": "Pallas"
                },
                "fullDegree": 265.36839447032526,
                "normDegree": 25.368394470325256,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 9,
                    "name": {
                        "en": "Sagittarius"
                    }
                }
            },
            {
                "planet": {
                    "en": "Chiron"
                },
                "fullDegree": 209.68543000099075,
                "normDegree": 29.68543000099075,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 7,
                    "name": {
                        "en": "Libra"
                    }
                }
            },
            {
                "planet": {
                    "en": "Lilith"
                },
                "fullDegree": 140.8544981045933,
                "normDegree": 20.85449810459329,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 5,
                    "name": {
                        "en": "Leo"
                    }
                }
            },
            {
                "planet": {
                    "en": "Mean Node"
                },
                "fullDegree": 159.52817262651706,
                "normDegree": 9.528172626517062,
                "isRetro": "True",
                "zodiac_sign": {
                    "number": 6,
                    "name": {
                        "en": "Virgo"
                    }
                }
            },
            {
                "planet": {
                    "en": "True Node"
                },
                "fullDegree": 182.96593376110604,
                "normDegree": 2.9659337611060437,
                "isRetro": "True",
                "zodiac_sign": {
                    "number": 7,
                    "name": {
                        "en": "Libra"
                    }
                }
            },
            {
                "planet": {
                    "en": "Descendant"
                },
                "fullDegree": 294.0792800077981,
                "normDegree": 24.079280007798104,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 10,
                    "name": {
                        "en": "Capricorn"
                    }
                }
            },
            {
                "planet": {
                    "en": "MC"
                },
                "fullDegree": 47.90375536821309,
                "normDegree": 17.90375536821309,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 2,
                    "name": {
                        "en": "Taurus"
                    }
                }
            },
            {
                "planet": {
                    "en": "IC"
                },
                "fullDegree": 227.9037553682131,
                "normDegree": 17.903755368213098,
                "isRetro": "False",
                "zodiac_sign": {
                    "number": 8,
                    "name": {
                        "en": "Scorpio"
                    }
                }
            }
        ]
    },
    "aspects": {
        "statusCode": 200,
        "output": [
            {
                "planet_1": {
                    "en": "Ascendant"
                },
                "planet_2": {
                    "en": "Venus"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Ascendant"
                },
                "planet_2": {
                    "en": "Ceres"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Ascendant"
                },
                "planet_2": {
                    "en": "Vesta"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Sun"
                },
                "planet_2": {
                    "en": "Juno"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Sun"
                },
                "planet_2": {
                    "en": "Mean Node"
                },
                "aspect": {
                    "en": "Square"
                }
            },
            {
                "planet_1": {
                    "en": "Moon"
                },
                "planet_2": {
                    "en": "Mars"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Moon"
                },
                "planet_2": {
                    "en": "Mercury"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Moon"
                },
                "planet_2": {
                    "en": "Jupiter"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Moon"
                },
                "planet_2": {
                    "en": "Saturn"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Moon"
                },
                "planet_2": {
                    "en": "Uranus"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Moon"
                },
                "planet_2": {
                    "en": "Neptune"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Moon"
                },
                "planet_2": {
                    "en": "Pallas"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Moon"
                },
                "planet_2": {
                    "en": "Chiron"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Moon"
                },
                "planet_2": {
                    "en": "True Node"
                },
                "aspect": {
                    "en": "Square"
                }
            },
            {
                "planet_1": {
                    "en": "Mars"
                },
                "planet_2": {
                    "en": "Jupiter"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Mars"
                },
                "planet_2": {
                    "en": "Saturn"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Mars"
                },
                "planet_2": {
                    "en": "Uranus"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Mars"
                },
                "planet_2": {
                    "en": "Neptune"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Mars"
                },
                "planet_2": {
                    "en": "Chiron"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Mars"
                },
                "planet_2": {
                    "en": "Mean Node"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Mercury"
                },
                "planet_2": {
                    "en": "Jupiter"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Mercury"
                },
                "planet_2": {
                    "en": "Pallas"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Mercury"
                },
                "planet_2": {
                    "en": "Chiron"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Mercury"
                },
                "planet_2": {
                    "en": "Lilith"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Jupiter"
                },
                "planet_2": {
                    "en": "Neptune"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Jupiter"
                },
                "planet_2": {
                    "en": "Pallas"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Jupiter"
                },
                "planet_2": {
                    "en": "Chiron"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Jupiter"
                },
                "planet_2": {
                    "en": "True Node"
                },
                "aspect": {
                    "en": "Square"
                }
            },
            {
                "planet_1": {
                    "en": "Venus"
                },
                "planet_2": {
                    "en": "Pluto"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Venus"
                },
                "planet_2": {
                    "en": "Ceres"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Venus"
                },
                "planet_2": {
                    "en": "Lilith"
                },
                "aspect": {
                    "en": "Square"
                }
            },
            {
                "planet_1": {
                    "en": "Venus"
                },
                "planet_2": {
                    "en": "MC"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Venus"
                },
                "planet_2": {
                    "en": "IC"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Saturn"
                },
                "planet_2": {
                    "en": "Uranus"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Saturn"
                },
                "planet_2": {
                    "en": "Neptune"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Saturn"
                },
                "planet_2": {
                    "en": "Pluto"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Saturn"
                },
                "planet_2": {
                    "en": "Chiron"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Saturn"
                },
                "planet_2": {
                    "en": "Mean Node"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Uranus"
                },
                "planet_2": {
                    "en": "Neptune"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Uranus"
                },
                "planet_2": {
                    "en": "Pluto"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Uranus"
                },
                "planet_2": {
                    "en": "Ceres"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Uranus"
                },
                "planet_2": {
                    "en": "Mean Node"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Neptune"
                },
                "planet_2": {
                    "en": "Pallas"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Neptune"
                },
                "planet_2": {
                    "en": "Chiron"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Neptune"
                },
                "planet_2": {
                    "en": "Mean Node"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Neptune"
                },
                "planet_2": {
                    "en": "True Node"
                },
                "aspect": {
                    "en": "Square"
                }
            },
            {
                "planet_1": {
                    "en": "Pluto"
                },
                "planet_2": {
                    "en": "Mean Node"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Pluto"
                },
                "planet_2": {
                    "en": "MC"
                },
                "aspect": {
                    "en": "Opposition"
                }
            },
            {
                "planet_1": {
                    "en": "Pluto"
                },
                "planet_2": {
                    "en": "IC"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Ceres"
                },
                "planet_2": {
                    "en": "Vesta"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Ceres"
                },
                "planet_2": {
                    "en": "Juno"
                },
                "aspect": {
                    "en": "Square"
                }
            },
            {
                "planet_1": {
                    "en": "Ceres"
                },
                "planet_2": {
                    "en": "Mean Node"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Ceres"
                },
                "planet_2": {
                    "en": "Descendant"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Ceres"
                },
                "planet_2": {
                    "en": "MC"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Ceres"
                },
                "planet_2": {
                    "en": "IC"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Vesta"
                },
                "planet_2": {
                    "en": "Descendant"
                },
                "aspect": {
                    "en": "Conjunction"
                }
            },
            {
                "planet_1": {
                    "en": "Vesta"
                },
                "planet_2": {
                    "en": "MC"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Juno"
                },
                "planet_2": {
                    "en": "Lilith"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Pallas"
                },
                "planet_2": {
                    "en": "Chiron"
                },
                "aspect": {
                    "en": "Sextile"
                }
            },
            {
                "planet_1": {
                    "en": "Pallas"
                },
                "planet_2": {
                    "en": "Lilith"
                },
                "aspect": {
                    "en": "Trine"
                }
            },
            {
                "planet_1": {
                    "en": "Lilith"
                },
                "planet_2": {
                    "en": "MC"
                },
                "aspect": {
                    "en": "Square"
                }
            },
            {
                "planet_1": {
                    "en": "Lilith"
                },
                "planet_2": {
                    "en": "IC"
                },
                "aspect": {
                    "en": "Square"
                }
            }
        ]
    }
}