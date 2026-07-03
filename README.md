# 🚀 React Native RemKit

<div align="center">

**Build modular React Native apps with remote components!** 🎨

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

</div>

---

## ✨ What is RemKit?

RemKit is a powerful toolkit that enables **micro-frontend architecture** for React Native applications! 🎯

- 🔄 **Load components remotely** - Dynamically fetch and render components from remote URLs
- 🧩 **Modular architecture** - Build and deploy components independently
- 🔗 **Shared dependencies** - Efficiently share React and React Native between host and remote apps
- 🛠️ **Easy CLI** - Simple commands to build and serve remote components
- 📦 **TypeScript support** - Full TypeScript support out of the box

---

## 📦 Packages

This monorepo contains two main packages:

| Package | Description |
|---------|-------------|
| **`@remkit/react-native`** 📱 | Core library for loading and rendering remote components |
| **`@remkit/cli`** 🛠️ | CLI tool for building remote component bundles |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0 (or npm/yarn)
- React Native development environment set up

### Installation

#### 1. Install the packages

```bash
# Install the core library in your host app
pnpm add @remkit/react-native

# Install the CLI in your remote app (as dev dependency)
pnpm add -D @remkit/cli
```

#### 2. Setup the host app

In your host app, configure shared dependencies:

```tsx
// app/_layout.tsx or your root component
import { setup } from "@remkit/react-native";

setup({
  shared: {
    react: require("react"),
    "react-native": require("react-native"),
    // Add any other shared dependencies
  },
});
```

#### 3. Create a remote component

Create a new React Native component in your remote app:

```tsx
// remote-app/index.tsx
import { View, Text, StyleSheet } from "react-native";

export default function MyRemoteComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello from Remote! 🎉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
```

#### 4. Configure the remote app

Initialize RemKit configuration:

```bash
# In your remote app directory
npx @remkit/cli init
```

This creates a `remkit.config.json` file:

```json
{
  "name": "my-remote-app",
  "externals": [
    "react",
    "react-native",
    "react/jsx-runtime"
  ],
  "entry": "index.tsx",
  "output": "dist"
}
```

#### 5. Build the remote component

```bash
# Build the remote component bundle
npx remkit build
```

This generates a `remoteEntry.js` file in the `dist` directory.

#### 6. Serve the remote component

Serve the `dist` directory using any static file server:

```bash
# Using serve (install with: pnpm add -D serve)
npx serve -s dist -l 3000

# Or using http-server
npx http-server dist -p 3000

# Or using Python
python -m http.server 3000 --directory dist
```

#### 7. Use the remote component in your host app

```tsx
// host-app/components/RemoteComponent.tsx
import { remkit } from "@remkit/react-native";

// Create a remote component instance
const RemoteComponent = remkit({
  url: "http://localhost:3000/remoteEntry.js", // URL to your remote bundle
});

export default function MyScreen() {
  return (
    <View>
      <RemoteComponent />
    </View>
  );
}
```

#### 8. Pass props to remote components

```tsx
const RemoteComponent = remkit<{ title: string; count: number }>({
  url: "http://localhost:3000/remoteEntry.js",
});

export default function MyScreen() {
  return (
    <RemoteComponent 
      title="Hello World" 
      count={42} 
    />
  );
}
```

#### 9. Reload a remote component

RemKit lets you re-fetch a remote component at runtime (e.g. after publishing a new bundle, or on pull-to-refresh). A reload always bypasses the HTTP cache so you get fresh content.

**Option A — imperative `ref`**

```tsx
import { useRef } from "react";
import { Button } from "react-native";
import { remkit, RemkitHandle } from "@remkit/react-native";

const RemoteComponent = remkit({
  url: "http://localhost:3000/remoteEntry.js",
});

export default function MyScreen() {
  const ref = useRef<RemkitHandle>(null);

  return (
    <>
      <RemoteComponent ref={ref} />
      <Button title="Reload" onPress={() => ref.current?.reload()} />
    </>
  );
}
```

**Option B — `useRemkit` hook**

Gives you direct access to the loading/error state and the `reload` function.

```tsx
import { Button } from "react-native";
import { useRemkit } from "@remkit/react-native";

export default function MyScreen() {
  const { Component, loading, error, reload } = useRemkit({
    url: "http://localhost:3000/remoteEntry.js",
  });

  if (error) return <Text>Failed to load: {error.message}</Text>;
  if (!Component) return <Text>Loading…</Text>;

  return (
    <>
      <Component title="Hello" />
      <Button title="Reload" onPress={reload} disabled={loading} />
    </>
  );
}
```

---

## 📚 Complete Example

### Host App Structure

```
host-app/
├── app/
│   ├── _layout.tsx          # Setup shared dependencies
│   └── (tabs)/
│       └── explore.tsx       # Use remote component
└── package.json
```

**`app/_layout.tsx`**:
```tsx
import { setup } from "@remkit/react-native";

setup({
  shared: {
    react: require("react"),
    "react-native": require("react-native"),
  },
});
```

**`app/(tabs)/explore.tsx`**:
```tsx
import { remkit } from "@remkit/react-native";

const RemoteMovies = remkit({
  url: "http://localhost:3000/remoteEntry.js",
});

export default function ExploreScreen() {
  return <RemoteMovies />;
}
```

### Remote App Structure

```
remote-app/
├── index.tsx                 # Remote component
├── remkit.config.json        # RemKit configuration
├── dist/
│   └── remoteEntry.js        # Built bundle (generated)
└── package.json
```

**`index.tsx`**:
```tsx
import { View, Text, FlatList } from "react-native";

export default function MoviesList() {
  const movies = [
    { id: 1, title: "The Matrix" },
    { id: 2, title: "Inception" },
    { id: 3, title: "Interstellar" },
  ];

  return (
    <View>
      <Text>My Favorite Movies 🎬</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
    </View>
  );
}
```

**`remkit.config.json`**:
```json
{
  "name": "movies-remote",
  "externals": [
    "react",
    "react-native",
    "react/jsx-runtime"
  ],
  "entry": "index.tsx",
  "output": "dist"
}
```

---

## 🎯 Key Concepts

### Shared Dependencies

Shared dependencies are libraries that both the host and remote apps use. By marking them as shared:

- ✅ Reduces bundle size
- ✅ Prevents duplicate loading
- ✅ Ensures version consistency

Common shared dependencies:
- `react`
- `react-native`
- `react/jsx-runtime`
- `react-native-gesture-handler`
- `react-native-safe-area-context`

### External Dependencies

In `remkit.config.json`, the `externals` array lists dependencies that should NOT be bundled with the remote component. These are expected to be provided by the host app via the `setup()` function.

---

## 🛠️ CLI Commands

### `remkit init`

Initialize a new RemKit configuration file.

```bash
npx remkit init
```

### `remkit build`

Build the remote component bundle.

```bash
npx remkit build
```

Options:
- Reads configuration from `remkit.config.json`
- Outputs `remoteEntry.js` to the configured output directory

---

## 🔧 Configuration

### `remkit.config.json`

```json
{
  "name": "my-remote-app",           // Name of your remote app
  "externals": [                     // Dependencies to exclude from bundle
    "react",
    "react-native"
  ],
  "entry": "index.tsx",              // Entry point file
  "output": "dist"                   // Output directory
}
```

---

## 💡 Tips & Best Practices

1. **🔒 Security**: Only load remote components from trusted sources
2. **🌐 Network**: Use HTTPS in production for secure component loading
3. **⚡ Performance**: Cache remote components when possible
4. **🐛 Debugging**: Check browser/device console for loading errors
5. **📦 Bundle Size**: Keep externals list comprehensive to reduce bundle size
6. **🔄 Updates**: Remote components can be updated without rebuilding the host app

---

## 🐛 Troubleshooting

### Component not loading?

- ✅ Check the URL is accessible
- ✅ Verify CORS is configured correctly
- ✅ Ensure shared dependencies are set up
- ✅ Check browser/device console for errors

### Type errors?

- ✅ Ensure TypeScript types match between host and remote
- ✅ Use generic types when creating remote components: `remkit<YourProps>({...})`

### Build errors?

- ✅ Verify `remkit.config.json` is correct
- ✅ Check that entry file exists
- ✅ Ensure all externals are properly configured

---

## 📖 API Reference

### `setup(options)`

Configure shared dependencies for the host app.

```tsx
setup({
  shared: {
    [key: string]: unknown;
  };
});
```

### `remkit<TProps>(options)`

Create a remote component loader.

```tsx
remkit<TProps>({
  url: string;                    // URL to remoteEntry.js
  loading?: () => React.ReactNode; // Optional custom loading component
}): RemkitComponentType<TProps>
```

The returned component forwards a `ref` of type `RemkitHandle`:

```tsx
type RemkitHandle = {
  reload: () => void; // Re-fetch the remote component, bypassing the cache
};
```

### `useRemkit(options)`

Hook version of `remkit()`. Returns the resolved component along with its state and a `reload` function.

```tsx
useRemkit({
  url: string;
  loading?: () => React.ReactNode;
}): {
  Component: React.ComponentType | null; // null until loaded
  loading: boolean;                       // true while (re)fetching
  error: Error | null;                    // last load error, if any
  reload: () => void;                     // re-fetch, bypassing the cache
}
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

MIT

---

<div align="center">

**Made with ❤️ for the React Native community**

⭐ Star this repo if you find it useful!

</div>

