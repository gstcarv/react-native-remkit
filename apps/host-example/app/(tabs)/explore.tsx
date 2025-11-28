import { remkit } from "@remkit/react-native";
import { Text } from "react-native";

const RemoteComponent = remkit({
    url: "http://192.168.15.33:3000/remoteEntry.js",
    loading: () => <Text>loading...</Text>,
});

export default function TabTwoScreen() {
    return <RemoteComponent />;
}
