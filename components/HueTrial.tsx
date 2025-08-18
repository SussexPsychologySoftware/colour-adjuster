import { Text, View, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import AdjustColourButton from '@/components/AdjustColourButton'
import { ColourConverter } from '@/utils/colourConversion';
import { colourConstraints } from '@/constants/colourConstraints';
import { RGB, LCH, TargetColour, Constraint } from "@/types/colours";

// Return selected colour,
export default function HueTrial({ startColour, targetColour, onSubmit }: {startColour: RGB, targetColour: TargetColour, onSubmit: (colour: RGB)=>void}) {
    const [backgroundColour, setBackgroundColour] = useState<RGB>(startColour);
    const [clockwiseBoundReached, setClockwiseBoundReached] = useState(false);
    const [anticlockwiseBoundReached, setAnticlockwiseBoundReached] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    function changeHue(direction: string, currentColour: RGB): LCH{
        const backgroundLCH = ColourConverter.rgb2lch(currentColour)
        // Extract hue and change
        if(direction === 'increase') backgroundLCH.h++
        else if(direction === 'decrease') backgroundLCH.h--
        // constrain 0-360
        backgroundLCH.h = mod(backgroundLCH.h, 360) // custom mod handles negatives and >360
        return backgroundLCH
    }

    // mod fuction to handle negative numbers
    function mod(n: number, m: number) { //https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
        return ((n % m) + m) % m;
    }

    function toggleHueButtons(hue: number){
        const constraint: Constraint = colourConstraints[targetColour]
        if(constraint.excludedHueRange){
            setAnticlockwiseBoundReached(hue === constraint.excludedHueRange.min)
            setClockwiseBoundReached(hue === constraint.excludedHueRange.max)
        }
    }

    const handlePress = (direction: string) => {
        setBackgroundColour(currentRGB => {
            const newBackgroundLCH: LCH = changeHue(direction, currentRGB)
            toggleHueButtons(newBackgroundLCH.h)
            return ColourConverter.lch2rgb(newBackgroundLCH)
        })
    }

    const handleSubmit = () => {
        // Save data, reset buttons and colour and restart
        if(submitting) return
        setSubmitting(true)
        try{
            onSubmit(backgroundColour)
        } catch (e) {
            console.log(e)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <View style={[styles.container, {backgroundColor: `rgb(${backgroundColour.r}, ${backgroundColour.g}, ${backgroundColour.b})` }]}>
            <View style={styles.middle}>
                <AdjustColourButton disabled={anticlockwiseBoundReached} onPress={()=>handlePress('increase')} style={styles.left}/>
                <View style={styles.infoAndSubmit}>
                    <Text style={[styles.text, styles.targetColour]}>{targetColour}</Text>
                    <Pressable disabled={submitting} onPress={handleSubmit} style={[styles.submitButton, {borderColor: submitting ? 'grey' : 'black'}]}>
                        <Text style={[styles.text, styles.submitText, {color: submitting ? 'grey' : 'black'}]}>Submit</Text>
                    </Pressable>
                </View>
                <AdjustColourButton disabled={clockwiseBoundReached} onPress={()=>handlePress('decrease')} style={styles.right}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        maxHeight: "100%",
        maxWidth: "100%",
        backgroundColor: "black",
        justifyContent: "center", // TODO: Must be "space-between" on White trial
        alignItems: "stretch"
    },
    top: {
        alignSelf: "center",
    },
    bottom: {
        alignSelf: "center",
        justifyContent: "flex-end",
    },
    middle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    left: {
    },
    right: {
        // alignSelf: "flex-end",
    },

    infoAndSubmit: {
        alignItems: "center"
    },
    submitButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
    text: {
        fontWeight: "bold",
        color: "black",
    },
    targetColour: {
        fontWeight: "bold",
        fontSize: 30,
        textTransform: 'capitalize'
    },
    submitText: {
        fontSize: 15,
    }
});

