import {ColourConstraints} from "@/types/colours";

export const colourConstraints: ColourConstraints = {
    white: {
        l: 85,
        c: 20, // max Ch
        hueRanges: [
            { min: 0, max: 360 }  // Full hue circle, but Ch is constrained
        ]
    },
    red: {
        l: 40,
        c: 45,
        hueRanges: [
            { min: 0, max: 152 },
            { min: 276, max: 360 }
        ]
    },
    green: {
        l: 45,
        c: 25,
        hueRanges: [
            { min: 0, max: 360 }  // Full hue circle
        ]
    },
    blue: {
        l: 40,
        c: 25,
        hueRanges: [
            { min: 0, max: 360 }  // Full hue circle
        ]
    },
    yellow: {
        l: 50,
        c: 50,
        hueRanges: [
            { min: 0, max: 155 },
            { min: 274, max: 360 }
        ]
    }
};