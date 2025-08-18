import {ColourConstraints} from "@/types/colours";

export const colourConstraints: ColourConstraints = {
    white: {
        l: 85,
        c: 20, // max Ch
    },
    red: {
        l: 40,
        c: 45,
        excludedHueRange: { min: 152, max: 275 }  // exclude greens/cyans/blues
    },
    green: {
        l: 45,
        c: 25,
    },
    blue: {
        l: 40,
        c: 25,
    },
    yellow: {
        l: 50,
        c: 50,
        excludedHueRange: { min: 155, max: 273 }  // exclude greens/cyans/blues
    }
};