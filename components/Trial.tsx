import { Text, View, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import AdjustColourButton from '@/components/AdjustColourButton'
import { ColourConverter } from '@/utils/colourConversion';
import { colourConstraints } from '@/constants/colourConstraints';
import { ABAxis, LAB, RGB } from "@/types/colours";

// Return selected colour,
// overthinking, maybe just pass in the update and toggle functions? horizontal?

export default function Trial({ startColour, targetColour, onSubmit }: {startColour: RGB, targetColour: string, onSubmit: (colour: RGB)=>void}) {
    const [backgroundColour, setBackgroundColour] = useState<RGB>(startColour);
    const [topBoundReached, setTopBoundReached] = useState(false);
    const [bottomBoundReached, setBottomBoundReached] = useState(false);
    const [rightBoundReached, setRightBoundReached] = useState(false);
    const [leftBoundReached, setLeftBoundReached] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // white trials convert to lab, up/down is a, left/right is b.
        // hue trials convert to lch, left/right is c

    function getNewLAB(button: ABAxis){
        // convert to lab
        const lab = ColourConverter.rgb2lab(backgroundColour)
        //change A or B according to button pressed
        if(button === 'red') lab.a++
        else if(button === 'blue') lab.b--
        else if(button === 'yellow') lab.b++
        else if(button === 'green') lab.a--
        return lab
    }

    function testABChange(lab: LAB, axisKey: 'a'|'b', change: 1|-1){
        const predictedLAB = {...lab} // TODO: these shouldn't be changing in place really?
        // Get predicted value after change in LAB and LCH
        predictedLAB[axisKey] += change // Change relevant value
        const predictedLCH = ColourConverter.lab2lch(predictedLAB) // Convert to lch //TODO: consider rerenders this might cause?
        // Compare to constraints
        // to check abBounds = predictedLAB[axisKey] < -128 || predictedLAB[axisKey] > 127
        return predictedLCH.c < 0 || predictedLCH.c > colourConstraints.white.c
    }

    function checkToggleButtons(lab: LAB){
        // Disable if a +/- 1 change in relevant a or b would push chroma out of bounds
        const up = testABChange(lab,'a',1) // maybe include in the button's disabled statement?
        setTopBoundReached(up)
        const down = testABChange(lab,'a',-1)
        setBottomBoundReached(down)
        const left = testABChange(lab,'b',-1)
        setLeftBoundReached(left)
        const right = testABChange(lab,'b',1)
        setRightBoundReached(right)
    }

    const handlePress = (change: number, axis: 'a'|'b'|'c') => {
        let newBackgroundColour: RGB;
        if(axis === 'a'|| axis === 'b') {
            const lab = ColourConverter.rgb2lab(backgroundColour)
            lab[axis] += change
            checkToggleButtons(lab)
            newBackgroundColour = ColourConverter.lab2rgb(lab)
        } else {

        }
        setBackgroundColour(newBackgroundColour)

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
            { targetColour==='white' && <AdjustColourButton disabled={topBoundReached} onPress={()=>handlePress(1,'a')} style={styles.top}/> }
            <View style={styles.middle}>
                <AdjustColourButton disabled={leftBoundReached} onPress={()=>handlePress(-1, targetColour==='white'?'b':'c')} style={styles.left}/>
                <View style={styles.infoAndSubmit}>
                    <Text style={[styles.text, styles.targetColour]}>{targetColour}</Text>
                    <Pressable disabled={submitting} onPress={handleSubmit} style={[styles.submitButton, {borderColor: submitting ? 'grey' : 'black'}]}>
                        <Text style={[styles.text, styles.submitText, {color: submitting ? 'grey' : 'black'}]}>Submit</Text>
                    </Pressable>
                </View>
                { targetColour==='white' && <AdjustColourButton disabled={rightBoundReached} onPress={()=>handlePress(1, targetColour==='white'?'b':'c')} style={styles.right}/> }
            </View>
            <AdjustColourButton disabled={bottomBoundReached} onPress={()=>handlePress(-1,'a')} style={styles.bottom}/>
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

