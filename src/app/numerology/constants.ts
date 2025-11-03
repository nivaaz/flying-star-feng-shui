import { Levels } from "./types"

export const addressFields = [
    {
        example: "e.g. 3B",
        label: "Unit/Apartment Number + Building Number + Building Name / House Number",
        currentId: "unitNumber",
    },
    // {
    //     example: "e.g. 24 Astonia",
    //     label: "Building Number + Building Name / House Number",
    //     warning: ["Don't include direction e.g. W"],
    //     currentId: "buildingNumberAndName",
    // },
    // {
    //     example: "e.g. 32 Wallaby Road => 32",
    //     label: "Street Number",
    //     currentId: "streetNumber",
    // },
    {
        example: "e.g. Madison (Madison Ave)",
        label: "Street Name ",
        warning: ["Don't include direction e.g. W.", "Don't include 'Road' etc", "Don't include 'rd' from 3rd etc"],
        currentId: "streetName",
    },
    {
        example: "e.g. 2000",
        label: "  Postal Code:",
        currentId: "postalCode",
    },
    {
        example: "e.g. 1999",
        label: " Home built year",
        currentId: "homeYear"
    },

    {
        example: "e.g. 1996",
        label: " Your birth Year",
        currentId: "bornYear",
    },
]


export const levelLabels: Record<Levels, string> = {
    "L1": "(On-going life event/theme)",
    "L2": "(What super-charges the personal event)",
    "L1L2": "(The long-term result of the personal event)",
    "L3": "(Theme of friends/community)",
    "L4": "(City theme)",
    "Bonus 1": "(Chinese zodiac of Home build year)",
    "Bonus 2": "(Chinese zodiac of birth year)",
    "Bonus 1 & Bonus 2": "(Compatibility between home build year and birth year)"
}

export const NumerologyMeanings = {
    "1": {
        meaning: "The Leader",
        description: "masculine, independent, direct, leadership, originality, courage, new beginnings"
    },
    "2": {
        meaning: "The Peacemaker",
        description: "feminine, partnership, balance, peaceful"
    },
    "3": {
        meaning: "The Communicator",
        description: "social, network, friendships, cheating"
    },
    "4": {
        meaning: "The Worker",
        description: "stability, security, responsibility, overworking"
    },
    "5": {
        meaning: "The Adventurer",
        description: "change, travel, movement, chaos"
    },
    "6": {
        meaning: "The Nurturer",
        description: "family, pets, romance, intimacy, overgiving"
    },
    "7": {
        meaning: "The Seeker",
        description: "spirituality, creativity, artistic"
    },
    "8": {
        meaning: "The Achiever",
        description: "money, karma, power, privacy, make money fast, lose money fast"
    },
    "9": {
        meaning: "The Humanitarian",
        description: "wisdom, growth, mastery, shamanic journey"
    },
    "11": {
        meaning: "The Visionary",
        description: "partnership, inspiration, intuition, and enlightenment, visionary, the dreamer, and the seer. It is the number of the psychic, the healer, and the teacher. "
    },
    "22": {
        meaning: "The Master Builder",
        description: "building mastery, power, and achievement, master builder, the architect, and the engineer. It is the number of the visionary, the leader, and the manager. "
    },
    "33": {
        meaning: "The Master Teacher",
        description: "compassion, healing, and guidance, master teacher, the counselor, and the mentor. It is the number of the humanitarian, the philanthropist, and the healer."
    }
}
