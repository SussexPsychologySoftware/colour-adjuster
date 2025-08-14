export type ABAxis = 'blue' | 'red' | 'yellow' | 'green';

export interface LAB {
    l: number;
    a: number;
    b: number;
}

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface LCH {
    l: number;
    c: number;
    h: number;
}

export interface Range { min: number, max: number }

export interface Constraint {
    l: number,
    c: number,
    hueRanges: Range[]
}

export type TargetColour = 'white'|'red'|'green'|'blue'|'yellow'

export type ColourConstraints = Record<TargetColour, Constraint>

