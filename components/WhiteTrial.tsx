import { Text, View, StyleSheet, Pressable } from "react-native";
import {useMemo, useState} from "react";
import AdjustColourButton from '@/components/AdjustColourButton'
import { ColourConverter } from '@/utils/colourConversion';
import { colourConstraints } from '@/constants/colourConstraints';
import { LAB, RGB, LCH } from "@/types/colours";

// Return selected colour,
export default function WhiteTrial({ startColour, targetColour, onSubmit }: {startColour: LCH, targetColour: string, onSubmit: (colour: LCH)=>void}) {
    const [responseColour, setResponseColour] = useState<LCH>(startColour);
    const [aUpperBoundReached, setAUpperBoundReached] = useState(false);
    const [aLowerBoundReached, setALowerBoundReached] = useState(false);
    const [bUpperBoundReached, setBUpperBoundReached] = useState(false);
    const [bLowerBoundReached, setBLowerBoundReached] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Derive RGB when needed for display
    const backgroundColour = useMemo(() =>
            ColourConverter.lch2rgb(responseColour),
        [responseColour]
    );

    function increaseLAB(axisKey: 'a'|'b', change: 1|-1, currentResponse: LCH){
        // convert to lab
        const lab = ColourConverter.lch2lab(currentResponse)
        lab[axisKey] += change;
        return lab
    }

    function testABChange(lab: LAB, axisKey: 'a'|'b', change: 1|-1){
        const predictedLAB = {...lab} // TODO: these shouldn't be changing in place really?
        // Get predicted value after change in LAB and LCH
        predictedLAB[axisKey] += change // Change relevant value
        const predictedLCH = ColourConverter.lab2lch(predictedLAB) // Convert to lch //TODO: consider rerenders this might cause?
        // Check chroma is within bounds
        // to check abBounds = predictedLAB[axisKey] < -128 || predictedLAB[axisKey] > 127
        return predictedLCH.c < 0 || predictedLCH.c > colourConstraints.white.c //c max is 20
    }

    function checkToggleButtons(lab: LAB) {
        // Disable if a +/- 1 change in relevant a or b would push chroma out of bounds
        const up = testABChange(lab,'a',1) // maybe include in the button's disabled statement?
        setAUpperBoundReached(up)
        const down = testABChange(lab,'a',-1)
        setALowerBoundReached(down)
        const left = testABChange(lab,'b',-1)
        setBLowerBoundReached(left)
        const right = testABChange(lab,'b',1)
        setBUpperBoundReached(right)
        // return { up, down, left, right }
    }

    const handlePress = (axisKey:'a'|'b', change:1|-1) => {
        setResponseColour(prev => {
            // console.log('background change', currentRGB, performance.now())
            const lab: LAB = increaseLAB(axisKey, change, prev)
            checkToggleButtons(lab)
            return ColourConverter.lab2lch(lab)
        })
    }

    const handleSubmit = () => {
        // Save data, reset buttons and colour and restart
        if(submitting) return
        setSubmitting(true)
        try{
            onSubmit(responseColour)
        } catch (e) {
            console.log(e)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <View style={[styles.container, {backgroundColor: `rgb(${backgroundColour.r}, ${backgroundColour.g}, ${backgroundColour.b})` }]}>
            <AdjustColourButton disabled={aUpperBoundReached} onPress={()=>handlePress('a',1)} style={styles.top}/>
            <View style={styles.middle}>
                <AdjustColourButton disabled={bLowerBoundReached} onPress={()=>handlePress('b',-1)} style={styles.left}/>
                <View style={styles.infoAndSubmit}>
                    <Text style={[styles.text, styles.targetColour]}>{targetColour}</Text>
                    <Pressable disabled={submitting} onPress={handleSubmit} style={[styles.submitButton, {borderColor: submitting ? 'grey' : 'black'}]}>
                        <Text style={[styles.text, styles.submitText, {color: submitting ? 'grey' : 'black'}]}>Submit</Text>
                    </Pressable>
                </View>
                <AdjustColourButton disabled={bUpperBoundReached} onPress={()=>handlePress('b',1)} style={styles.right}/>
            </View>
            <AdjustColourButton disabled={aLowerBoundReached} onPress={()=>handlePress('a',-1)} style={styles.bottom}/>
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
        justifyContent: "space-between",
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

