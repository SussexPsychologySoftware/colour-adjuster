import { StyleSheet } from 'react-native';

// Simple color and size constants
export const colours = {
    primary: 'lightgray',
    secondary: 'lightblue',
    background: 'black',
    text: 'lightgray',
    border: 'lightgrey',
    warning: 'red'
};

export const sizes = {
    small: 14,
    medium: 20,
    large: 26,
    title: 40,
    padding: 16,
};

// Global styles
export const globalStyles = StyleSheet.create({
    // --------------------
    scrollViewContainer:{
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: colours.background,
        minHeight: '100%', //or flexGrow: 1?
        maxWidth: '100%',
    },

    container: {
        backgroundColor: colours.background,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
    },

    paragraph: {
        marginVertical: 5,
    },


    // TEXT STYLES ---------------
    text: {
        color: colours.text,
        fontSize: sizes.medium,
        flex: 1, // to keep wrapped in the page
        flexWrap: 'nowrap',
    },
    pageTitle: {
        fontSize: sizes.title,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colours.text,
    },
    question: {
        color: colours.text,
        fontSize: sizes.medium+1,
        // fontStyle: 'italic',
        fontWeight: "bold",
    },

    sectionTitle: {
        fontSize: sizes.large,
        fontWeight: 'bold',
        marginVertical: 10,
        color: colours.text,
    },

    whiteText: {
        color: colours.text,
    },
    standardText: {
        color: colours.text,
        fontSize: sizes.medium,
    },
    completeSurveyPrompt: {
        color: colours.text,
        fontSize: sizes.small,
        fontWeight: '300',
        // fontStyle: 'italic',
    },
    surveyPrompt: {
        color: colours.text,
        fontSize: sizes.medium,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 15,
        // textAlign: 'center',
    },
    warning: {
        color: colours.warning,
        fontSize: sizes.medium,
        paddingVertical: 10,
    },


    center: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Inputs, UI
    input: {
        color: colours.text,
        borderWidth: 1,
        borderColor: colours.border,
        borderRadius: 8,
        padding: 10,
        fontSize: sizes.medium,
    },
    inputNoFont: {
        color: colours.text,
        borderWidth: 1,
        borderColor: colours.border,
        borderRadius: 8,
        padding: 10,
    }
});