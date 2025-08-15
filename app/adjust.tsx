import {Text, View, StyleSheet, Pressable} from "react-native";
import {useEffect, useState} from "react";
import AdjustColourButton from '@/components/AdjustColourButton'
import { ColourConverter } from '@/utils/colourConversion';
import { colourConstraints } from '@/constants/colourConstraints';
import WhiteTrial from '@/components/WhiteTrial'
import { ABAxis, LAB, RGB, LCH, Constraint, TargetColour, Range } from "@/types/colours";
import {useTrials} from "@/hooks/useTrials";
import HueTrial from "@/components/HueTrial";

type trialType = 'white'|'hue'

export default function AdjustColourScreen() {

    // Maybe background should be set here, and then the trial components change it as a prop?
        // but probably don't want them to rerender when it changes?
    const [submitting, setSubmitting] = useState(false);

    const {
        nextTrial,
        currentTrialIndex,
        targetColour,
        startingColour,
        saveTrial
    } = useTrials();

    const handleSubmit = async (colour: RGB) => {
        if(submitting) return
        setSubmitting(true)
        try {
            // Save data
            await saveTrial(colour)
            nextTrial()
        } catch (e) {
            console.log(e)
        } finally {
            setSubmitting(false)
        }
        // Save data, reset buttons and colour and restart
    }

    return(
        targetColour==='white' ?
            <WhiteTrial key={currentTrialIndex} targetColour={targetColour} startColour={startingColour} onSubmit={handleSubmit}/>
        :
            <HueTrial key={currentTrialIndex} targetColour={targetColour} startColour={startingColour} onSubmit={handleSubmit}/>
    );
}

