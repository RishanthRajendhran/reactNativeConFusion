import React from "react";
import {ActivityIndicator,StyleSheet,Text,View} from "react-native";

const styles = StyleSheet.create({
    loadingView: {
        alignItems: "center",
        justifyContent: "center",
        flex:1
    },
    loadingText: {
        color: "#512BA8",
        fontSize: 14,
        fontWeight: "bold"
    }
});

export const Loading = () => {
    return(
        <View style={styles.loadingView}>
            <ActivityIndicator ssize="large" color="#512BA8" />
            <Text style={styles.loadingText}>
                Loading...
            </Text>
        </View>
    );
}