import {Text, View, StyleSheet, Pressable} from "react-native";
import {useEffect, useState} from "react";
import AdjustColourButton from '@/components/AdjustColourButton'
import { ColourUtils } from '@/utils/colourConversion';
import { colourConstraints } from '@/constants/colourConstraints';

type abAxis = 'blue' | 'red' | 'yellow' | 'green';
type lab = {l:number, a:number, b:number}
// In future this will call 'Hue trial' or 'Normal trial' components
export default function AdjustColourScreen() {

    const [backgroundColour, setBackgroundColour] = useState({r: 50, g: 50, b: 50});
    const [aUpperBoundReached, setAUpperBoundReached] = useState(false);
    const [aLowerBoundReached, setALowerBoundReached] = useState(false);
    const [bUpperBoundReached, setBUpperBoundReached] = useState(false);
    const [bLowerBoundReached, setBLowerBoundReached] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {

    }, [backgroundColour])


    function getNewLAB(button: abAxis){
        // convert to lab
        const lab = ColourUtils.rgb2lab(backgroundColour)
        //change A or B according to button pressed
        if(button ==='red') lab.a++
        else if(button ==='blue') lab.b--
        else if(button ==='yellow') lab.b++
        else if(button ==='green') lab.a--
        return lab
    }

    function testABChange(lab: lab, axisKey: 'a'|'b', change: 1|-1){
        const predictedLAB = {...lab} // TODO: these shouldn't be changing in place really?
        // Get predicted value after change in LAB and LCH
        predictedLAB[axisKey] += change // Change relevant value
        const predictedLCH = ColourUtils.lab2lch(predictedLAB) // Convert to lch
        // Compare to constraints
        // to check abBounds = predictedLAB[axisKey] < -128 || predictedLAB[axisKey] > 127
        return predictedLCH.c < 0 || predictedLCH.c > colourConstraints.White.c
    }

    function checkToggleButtons(lab: lab){
        // Disable if a +/- 1 change in relevant a or b would push chroma out of bounds
        const up = testABChange(lab,'a',1)
        setAUpperBoundReached(up)
        const down = testABChange(lab,'a',-1)
        setALowerBoundReached(down)
        const left = testABChange(lab,'b',-1)
        setBLowerBoundReached(left)
        const right = testABChange(lab,'b',1)
        setBUpperBoundReached(right)
    }

    const handlePress = (button: abAxis) => {
        const lab = getNewLAB(button)
        const rgb = ColourUtils.lab2rgb(lab)
        setBackgroundColour(rgb)
        checkToggleButtons(lab)
    }

    const handleSubmit = () => {
        setSubmitting(true)
        // Save data, reset buttons and colour and restart
    }

    return (
        <View style={[styles.container, {backgroundColor: `rgb(${backgroundColour.r}, ${backgroundColour.g}, ${backgroundColour.b})` }]}>
            <AdjustColourButton disabled={aUpperBoundReached} onPress={()=>handlePress('red')} style={styles.top}/>
            <View style={styles.middle}>
                <AdjustColourButton disabled={bLowerBoundReached} onPress={()=>handlePress('blue')} style={styles.left}/>
                <View style={styles.infoAndSubmit}>
                    <Text style={[styles.text, styles.targetColour]}>White</Text>
                    <Pressable disabled={submitting} onPress={handleSubmit} style={[styles.submitButton, {borderColor: submitting ? 'grey' : 'black'}]}>
                        <Text style={[styles.text, styles.submitText, {color: submitting ? 'grey' : 'black'}]}>Submit</Text>
                    </Pressable>
                </View>
                <AdjustColourButton disabled={bUpperBoundReached} onPress={()=>handlePress('yellow')} style={styles.right}/>
            </View>
            <AdjustColourButton disabled={aLowerBoundReached} onPress={()=>handlePress('green')} style={styles.bottom}/>
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
        justifyContent: "space-between"
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
    },
    submitText: {
        fontSize: 15,
    }
});

