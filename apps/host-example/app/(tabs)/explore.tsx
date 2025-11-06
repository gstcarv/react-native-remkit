import { StyleSheet } from "react-native";
import { remotely, setup } from "react-native-remotely";

// setup({
//     shared: {
//         React: require("react"),
//     },
// });

const RemoteComponent = remotely({ url: "http://192.168.15.33:3001/index.js" });

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
