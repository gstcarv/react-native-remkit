import { remkit } from "@remkit/react-native";
import { StyleSheet } from "react-native";

// setup({
//     shared: {
//         React: require("react"),
//     },
// });

const RemoteComponent = remkit({ url: "http://192.168.15.33:3001/index.js" });

export default function TabTwoScreen() {
    return <RemoteComponent />;
}

const styles = StyleSheet.create({
    headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 8,
    },
});
