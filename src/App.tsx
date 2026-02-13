import { ThemeProvider } from "./contexts/ThemeContext";

import AppRouterProvider from "./providers/AppRouterProvider";
import { QueryProvider } from "./providers/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AppRouterProvider />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
