import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useState, useRef, useEffect } from "react";

export default function AdjustColourButton({ style, disabled, onPress }: {style: object, disabled: boolean, onPress: ()=>void}) {

    const [pressed, setPressed] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const endPress = () => {
        setPressed(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startLongPress = () => {
        if(disabled || intervalRef.current) return; // If disabled or already interval running
        setPressed(true)
        intervalRef.current = setInterval(onPress, 50);
    };

    useEffect(endPress, [disabled]);

    // Cleanup on unmount just incase
    useEffect(() => {
        return () => {
            endPress();
        };
    }, []);

    const disabledColour = 'grey';

    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            onPressIn={()=>setPressed(true)}
            onLongPress={startLongPress}
            onPressOut={endPress}
            delayLongPress={200}
        >
            <View style={[
                    styles.adjustColourButton,
                    style,
                    {
                        borderColor: disabled ? disabledColour : 'black',
                        opacity: pressed ? 0.7 : 1
                    }
                ]}>
                <Text style={[styles.text, {color: disabled ? disabledColour : 'black'}]}>+</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    adjustColourButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        margin: 10,
        borderWidth: 1,
        borderRadius: 20,
    },
    text: {
        fontSize: 30,
    }
});