import { Text, StyleSheet, Pressable } from 'react-native';

export default function AdjustColourButton({ style, disabled, onPress }: {style: object, disabled: boolean, onPress: ()=>void}) {

    const disabledColour = 'grey'
    return (
        <Pressable disabled={disabled} onPress={onPress} onLongPress={onPress}
                   style={[styles.adjustColourButton, style, {borderColor: disabled ? disabledColour : 'black'}]}>
            <Text style={[styles.text,{color: disabled ? disabledColour : 'black'}]}>+</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    adjustColourButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        margin: 10,
        borderWidth: 1,
        // borderColor: 'black',
        borderRadius: 20,
    },
    text: {
        // color: 'black',
        fontSize: 30,
        // fontWeight: 300,
    }
});