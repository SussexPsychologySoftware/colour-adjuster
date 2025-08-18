import React from 'react'
import {Text, StyleSheet, Pressable} from 'react-native'
import {sizes, colours} from "@/styles/appStyles";

export default function SubmitButton({ text, disabledText, disabled, onPress, style, textStyle } : { text: string, disabledText?: string, disabled: boolean, onPress: () => void, style?: object, textStyle?: object }) {
    return(
        <Pressable disabled={disabled} onPress={onPress} style={[styles.button, disabled && styles.disabled, style]}>
            <Text style={[styles.text, textStyle, disabled && styles.disabled]}>{ disabled ? (disabledText??text) : text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        marginVertical: 15
    },
    disabled: {
        // backgroundColor: 'gray',
        opacity: 0.5
    },
    text: {
        fontSize: sizes.medium,
        color: colours.text,
        justifyContent: 'center',
        fontWeight: "bold",
    }
})

