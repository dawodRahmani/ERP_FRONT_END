import { RecruitmentProvider } from "./contexts/RecruitmentContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import AppRouterProvider from "./providers/AppRouterProvider";
import { QueryProvider } from "./providers/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <RecruitmentProvider>
          <AppRouterProvider />
        </RecruitmentProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
