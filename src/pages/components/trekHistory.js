import React from "react";


const TrekHistory = ({Treks}) => {

    return (
        <View>
            <SectionList
                sections={screenStack}
                stickySectionHeadersEnabled={false}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => item}
                renderSectionHeader={({ section: { title, action } }) => <></>}
                />
        </View>
    )
}

export default TrekHistory;