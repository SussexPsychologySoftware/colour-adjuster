export const colourConstraints = {
    White: {
        l: 85,
        c: 20, // max Ch
        hueRanges: [
            { min: 0, max: 360 }  // Full hue circle, but Ch is constrained
        ]
    },
    Red: {
        l: 40,
        c: 45,
        hueRanges: [
            { min: 0, max: 152 },
            { min: 276, max: 360 }
        ]
    },
    Green: {
        l: 45,
        c: 25,
        hueRanges: [
            { min: 0, max: 360 }  // Full hue circle
        ]
    },
    Blue: {
        l: 40,
        c: 25,
        hueRanges: [
            { min: 0, max: 360 }  // Full hue circle
        ]
    },
    Yellow: {
        l: 50,
        c: 50,
        hueRanges: [
            { min: 0, max: 155 },
            { min: 274, max: 360 }
        ]
    }
};