import PromptFiled from "./components/PromptFiled";
import Greeter from "./components/Greeter";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-between w-full h-screen bg-gray-900 text-gray-100 font-sans">
      <Greeter />
      <PromptFiled />
    </div>
  );
};

export default Index;
