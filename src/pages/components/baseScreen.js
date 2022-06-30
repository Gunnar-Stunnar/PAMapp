import React from 'react';
import { SectionList, SafeAreaView } from 'react-native';
import styles from '../../style/skeleton';

const sectionTitle = ({sectionTitle}) => {
    return <Text style={styles.title}>{title}</Text>
}

export const Skeleton = (props) => {

    // Get general page elements 
    const navbar =  props.navbar || (<></>);
    const screenStack =  props.screenStack || [];

    // structure general page layout
    return (
        <SafeAreaView style={styles.container}>
            {navbar}
            <SectionList
            sections={screenStack}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => item}
            renderSectionHeader={({ section: { title } }) => <sectionTitle sectionTitle = {title}/>}
            />
        </SafeAreaView>
    );
}

export default Skeleton;