import { RulesProvider } from "./inference-engine/RulesContext";
import Index from "./user-interface/Index";

const App = () => {
  return (
    <RulesProvider>
      <div className="w-full h-full flex items-center justify-cente ">
        <Index />
      </div>
    </RulesProvider>
  );
};

export default App;
