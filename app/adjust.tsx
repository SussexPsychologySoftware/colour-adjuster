import { useState } from "react";
import WhiteTrial from '@/components/WhiteTrial'
import { RGB, LCH, LAB } from "@/types/colours";
import { useTrials } from "@/hooks/useTrials";
import HueTrial from "@/components/HueTrial";
import { router } from "expo-router";

export default function AdjustColourScreen() {

    // Maybe background should be set here, and then the trial components change it as a prop?
        // but probably don't want them to rerender when it changes?
    // NOTE user should control not RGB but units they are incrementing, to stop any drift in L and C etc by constant conversion.
    const [submitting, setSubmitting] = useState(false);

    const {
        nextTrial,
        currentTrialIndex,
        isComplete,
        targetColour,
        startingColour,
        saveTrial,
        submitData,
    } = useTrials();

    const handleSubmit = async (colour: LCH|LAB, renderedRGB: RGB) => {
        if(submitting) return
        setSubmitting(true)
        try {
            // Save data
            await saveTrial(colour, renderedRGB)
            if(isComplete) {
                await submitData()
                router.replace("/survey")
                return
            }
            nextTrial()
        } catch (e) {
            console.log(e)
        } finally {
            setSubmitting(false)
        }
    }

    return(
        targetColour==='white' ?
            <WhiteTrial key={currentTrialIndex} targetColour={targetColour} startColour={startingColour} onSubmit={handleSubmit}/>
        :
            <HueTrial key={currentTrialIndex} targetColour={targetColour} startColour={startingColour} onSubmit={handleSubmit}/>
    );
}

