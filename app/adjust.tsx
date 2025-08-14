import {Text, View, StyleSheet, Pressable} from "react-native";
import {useEffect, useState} from "react";
import AdjustColourButton from '@/components/AdjustColourButton'
import { ColourConverter } from '@/utils/colourConversion';
import { colourConstraints } from '@/constants/colourConstraints';
import WhiteTrial from '@/components/WhiteTrial'
import { ABAxis, LAB, RGB, LCH, Constraint, TargetColour, Range } from "@/types/colours";

type trialType = 'white'|'hue'

export default function AdjustColourScreen() {

    // Maybe background should be set here, and then the trial components change it as a prop?
        // but probably don't want them to rerender when it changes?
    const [backgroundColour, setBackgroundColour] = useState<RGB>({r: 50, g: 50, b: 50});
    const [submitting, setSubmitting] = useState(false);
    const [trialType, setTrialType] = useState<TargetColour|null>(null); // or just index on trial number??
    const [trialNumber, setTrialNumber] = useState(null);
    const [trials, setTrials] = useState<TargetColour[]>([]);
    const [targetColour, setTargetColour] = useState('white');


    function startTrials(){

    }

    // Function to shuffle the array (Fisher-Yates Shuffle)
    function shuffle(array: string[]) {
        for(let i=array.length-1; i>0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];  // Swap
        }
    }

    // Creating trials array
    function createTrialsArray(): string[]{
        const trials: TargetColour[] = []
        const hues: TargetColour[] = ['red', 'green', 'blue', 'yellow']
        const nBlocks = 3
        for (let b=0; b<nBlocks; b++) {
            shuffle(hues) // Random shuffle on hues
            for(let h=0; h<hues.length; h++){
                trials.push('white')
                trials.push(hues[h])
            }
        }
        return trials
    }

    function startNewTrial(){
        // Increase trial index
        const nextTargetColour = 'white'
        setTargetColour(nextTargetColour)
        const randomColour = randomStartingColour(nextTargetColour)
        setBackgroundColour(randomColour)
    }

    function getRandomHue(hueRanges: Range[]) {
        // Select a random range from hue ranges
        const randomRange = hueRanges[Math.floor(Math.random() * hueRanges.length)];
        // Generate a random hue within the selected range
        return Math.floor(Math.random() * (randomRange.max - randomRange.min+1) + randomRange.min);
    }

    function randomStartingColour(targetColour: TargetColour) {
        const constraints = colourConstraints[targetColour]
        const randomHue = getRandomHue(constraints.hueRanges) // random hue within the allowed ranges
        return ColourConverter.lch2rgb({ ...constraints, h: randomHue })
    }

    const handleSubmit = () => {
        setSubmitting(true)
        try {
            // Save data
        } catch (e) {
            console.log(e)
        } finally {
            setSubmitting(false)
        }
        // Save data, reset buttons and colour and restart
    }

    return (
        <WhiteTrial targetColour={targetColour} startColour={{r: 50, g: 50, b: 50}} onSubmit={handleSubmit}/>
    );
}

