import {useEffect, useState} from "react";
import WhiteTrial from '@/components/WhiteTrial'
import { RGB, LCH, LAB } from "@/types/colours";
import { useTrials } from "@/hooks/useTrials";
import HueTrial from "@/components/HueTrial";
import { router } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import {Platform} from "react-native";

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

    useEffect(() => {
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };
        lockOrientation();

        const hideNavBar = async () => {
            try {
                if (Platform.OS === 'android') {
                    // Set the navigation bar style
                    const invisibleBlack = '#00000000'
                    await NavigationBar.setBackgroundColorAsync(invisibleBlack);
                    await NavigationBar.setBorderColorAsync(invisibleBlack);
                    // await NavigationBar.setBehaviorAsync('overlay-swipe')
                    // await NavigationBar.setPositionAsync('absolute')
                    NavigationBar.setStyle('dark');
                    // Hide, everything above are just fallbacks
                    await NavigationBar.setVisibilityAsync("hidden");
                }
            } catch (error) {
                console.error(error);
            }
        };
        hideNavBar()

        return () => {
            ScreenOrientation.unlockAsync().catch(console.error);
            NavigationBar.setVisibilityAsync("visible").catch(console.error);
        };
    }, []);

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
            <WhiteTrial key={currentTrialIndex} targetColour={targetColour} startColour={startingColour} onSubmit={handleSubmit} submitting={submitting}/>
        :
            <HueTrial key={currentTrialIndex} targetColour={targetColour} startColour={startingColour} onSubmit={handleSubmit} submitting={submitting}/>
    );
}

