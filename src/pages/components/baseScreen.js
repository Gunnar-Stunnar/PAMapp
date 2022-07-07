import React from 'react';
import { SectionList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../../style/skeleton';

const SectionTitle = ({sectionTitle}) => {
    return (
        <Text style={styles.title}>
            {sectionTitle}
        </Text>
    )
}

const Skeleton = (props) => {

    // Get general page elements 
    const navbar =  props.navbar;
    const screenStack =  props.screenStack || [];

    // structure general page layout
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navContainer}>
                {navbar}
            </View>
            <SectionList
            sections={screenStack}
            stickySectionHeadersEnabled={false}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => item}
            renderSectionHeader={({ section: { title } }) => <SectionTitle sectionTitle = {title}/>}
            />
        </SafeAreaView>
    );
}

export default Skeleton;