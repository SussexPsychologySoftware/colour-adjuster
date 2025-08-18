import React from 'react';
import {ScrollView, View, Text, Image, StyleSheet, Pressable} from 'react-native';
import {router} from "expo-router";
import SubmitButton from "@/components/SubmitButton";
import {globalStyles} from "@/styles/appStyles";

export default function DebriefScreen() {
    return (
        <ScrollView style={globalStyles.scrollViewContainer}>
                <Text style={globalStyles.pageTitle}>Do we remember the colours of familiar devices?</Text>
                <Text style={[globalStyles.text, styles.authors]}>Yesesvi Konakanchi & Dr. John Maule</Text>
                <Text style={[globalStyles.text, styles.institution]}>Statistical Perception Lab, University of Sussex</Text>

                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    It has been shown that we build up specific memory for the colours of familiar objects.
                    Hansen et al. (2006) showed that people perceive a grey banana as slightly yellow, illustrating that perceptual experience
                    (e.g. seeing many bananas over your lifetime) influences our expectations about the world.
                </Text>

                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    Adults spend on average over 6 hours every day using screens (Kemp, 2023).
                    This means that for over 1/3rd of our waking hours we are seeing an interacting with a virtual world -
                    one in which the visual properties are quite different from those of the real world.
                    Screens constrain the range of colours which we see, and different screens will do this slightly differently.
                    Past research has shown that the perception of white is affected by whether the incoming stimulus is perceived to be a screen or a real material surface (Wei, Chen, & Luo, 2018).
                    However, it is an open and unexplored question if people can form priors to the colours rendered on familiar displays.
                    This project is investigating how familiar people become with a screen that they use frequently, and ultimately whether this affects their perception of colour on that screen.
                </Text>

                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    Digital screens are rows of pixels, each containing subpixels with red, green and blue, primaries (figure 1).
                    Different combinations of these primaries means your screen can display a continuous range of colours.
                    This is called the gamut. The range of colours which your screen can display is smaller than the range of colours in the real-world,
                    and yet we generally do not notice this reduction in colour for images representing the real world.
                    Due to technology differences, different displays have different gamuts.
                    This means that the representation of colour on one screen does not necessarily match that on another (see figure 2).
                    Red for one screen can be very different from the red of another.
                </Text>

                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    The experiment you have just taken part in uses a psychophysical paradigm called the method of adjustment.
                    Observers complete trials where they can adjust a stimulus to meet a certain criterion according to their own perception.
                    We are gathering settings of unique hues (red, green, yellow and blue) (Hurvich & Jameson, 1957) and of unique white (Bosten et al., 2015).
                    These are measures of subjective colour appearance.
                    At the same time we are gathering measurements of a sub-sample of participants' phones to help us better characterise the variation across devices.
                    We are also measuring the ambient lighting at your desks.
                    From the data we will analyse whether colour settings are determined more strongly by the immediate environment or by your prior knowledge of your device display.
                </Text>

                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    If participants have priors for their own devices, their colour adjustments would be closer to their device's RGB colours than to each other's settings
                    (which come from shared environments and culture).
                </Text>

                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    Since we expect to obtain a large sample of data (approx. N=300-400) we will have high statistical power to detect effects.
                    The size of the sample also means we will be able to explore further the individual differences.
                    We will use clustering techniques such as k-means clustering to identify groups of participants with similar colour settings,
                    and see whether they have things in common like phone manufacturer or operating system.
                </Text>

                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    The results may illustrate the power of implicit learning and suggest that we understand virtual worlds via our experiences of the real world.
                    It would suggest implicit understanding of how screens work, even in the absence of explicit knowledge or training.
                </Text>

                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    Colour and vision scientists would need to think hard about what it means to present stimuli on a screen –
                    are participants making judgements of the colour/stimulus alone, or through a lens of expectation about how displays warp the visual experience?
                    It would emphasise the importance of not doing colour-critical work "by eye" and the need for robust calibration in the design industry,
                    and display manufacturers will be interested in the time-scale over which people adapt to a new display technology.
                </Text>

                <Text style={[globalStyles.paragraph, globalStyles.text]}>
                    In line with open science practices, we have pre-registered the design and analyses for this study, prior to gathering the data.
                </Text>

                {/* Note: In a real app, you would use require() for local images or provide actual URLs */}
                <View style={styles.imageContainer}>
                    <View style={styles.imagePlaceholder}>
                        <Image
                            style={styles.image}
                            source={require('../assets/images/colour space.png')}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.imageCaption}>
                        Figure 1 - Depicts the pixel and sub-pixel distribution from a screen.
                        The combinations of the light produced by the sub pixels are responsible for image formation on screens.
                    </Text>
                </View>

                <View style={styles.imageContainer}>
                    <View style={styles.imagePlaceholder}>
                        <Image
                            style={styles.image}
                            source={require('../assets/images/screens.jpg')}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.imageCaption}>
                        Figure 2 - This diagram shows the rendering capabilities of different screens each represented by a different triangle.
                        The colours inside the triangle can be produced by the screen – the colours outside are physically possible but cannot be produced by the screen.
                    </Text>
                </View>

                <Text style={globalStyles.sectionTitle}>References</Text>

                <Text style={[globalStyles.text, styles.reference]}>
                    Hansen, T., Olkkonen, M., Walter, S., & Gegenfurtner, K. R. (2006). Memory modulates color appearance. Nature Neuroscience, 9(11), 1367-1368. https://doi.org/10.1038/nn1794
                </Text>

                <Text style={[globalStyles.text, styles.reference]}>
                    Wei, M., Chen, S., & Luo, M. R. (2018, November). Effect of stimulus luminance and adapting luminance on viewing mode and display white appearance.
                    In Color and Imaging Conference (Vol. 26, pp. 308-312). Society for Imaging Science and Technology.
                </Text>

                <Text style={[globalStyles.text, styles.reference]}>
                    Hurvich, L. M., & Jameson, D. (1957). An opponent-process theory of color vision. Psychological review, 64(6p1), 384.
                </Text>

                <Text style={[globalStyles.text, styles.reference]}>
                    Bosten, J. M., Beer, R. D., & MacLeod, D. I. A. (2015). What is white?. Journal of vision, 15(16), 5-5.
                </Text>

                <Text style={[globalStyles.text, styles.reference]}>
                    Kemp, S. (2023, January 26). Digital 2023: Global Overview Report. DataReportal. https://datareportal.com/reports/digital-2023-global-overview-report
                </Text>
                <SubmitButton text='Continue to testing' disabled={false} onPress={()=>router.replace('/testing')}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    authors: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 5,
    },
    institution: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        textAlign: 'justify',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
    },
    imageContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    imagePlaceholderText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
    imageCaption: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 20,
    },
    reference: {
        color: 'lightgray',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 5,
        textAlign: 'left',
    },
});