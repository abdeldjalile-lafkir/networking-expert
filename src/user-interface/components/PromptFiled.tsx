/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import runInference from "../../inference-engine/InferenceEngine";
import { useRules } from "../../inference-engine/RulesContext";
import Response from "./Response";

const PromptFiled = () => {
  const [mainInputText, setMainInputText] = useState("");
  const [extraTexts, setExtraTexts] = useState<string[]>([]);
  const [newExtraText, setNewExtraText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState({
    connection: false,
    dns: false,
    dhcp: false,
    performance: false,
    firwall: false,
    hardware: false,
    vpn: false,
  });

  const [showTools, setShowTools] = useState(false);

  const { rules } = useRules();

  const [response, setResponse] = useState<{
    id: string;
    category: string;
    diagnosis: string;
    solution: string[];
  }>({
    id: "",
    category: "",
    diagnosis: "",
    solution: [],
  });

  const handleMainInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMainInputText(event.target.value);
  };

  const handleNewExtraTextChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNewExtraText(event.target.value);
  };

  const handleAddExtraText = () => {
    if (newExtraText.trim() !== "") {
      setExtraTexts([...extraTexts, newExtraText.trim()]);
      setNewExtraText("");
    }
  };

  const handleRemoveExtraText = (indexToRemove: number) => {
    setExtraTexts(extraTexts.filter((_, index) => index !== indexToRemove));
  };

  const handleCategoryChange = (event: {
    target: { name: any; checked: any };
  }) => {
    const { name, checked } = event.target;
    setSelectedCategories({
      ...selectedCategories,
      [name]: checked,
    });
  };

  const toggleTools = () => {
    setShowTools(!showTools);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Escape") {
      setShowTools(false);
    }
  };

  const AnalysisIssue = () => {
    const request = {
      symptom: mainInputText,
      conditions: extraTexts,
      keywords: Object.keys(selectedCategories).reduce<string[]>(
        (acc, key) =>
          selectedCategories[key as keyof typeof selectedCategories]
            ? [...acc, key]
            : acc,
        []
      ),
    };

    const response = runInference(request, rules);
    setResponse(response);
    setMainInputText("");
    setExtraTexts([]);
    setNewExtraText("");
    setSelectedCategories({
      connection: false,
      dns: false,
      dhcp: false,
      performance: false,
      firwall: false,
      hardware: false,
      vpn: false,
    });
    setShowTools(false);
    setTimeout(() => {
      const responseElement = document.querySelector(".response");
      if (responseElement) {
        responseElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);

    return;
  };

  React.useEffect(() => {
    if (response.id !== "") {
      setResponse(response);
    }
  }, [response]);

  const handleRandomRule = () => {
    const randomIndex = Math.floor(Math.random() * rules.length);
    const randomRule = rules[randomIndex];
    setMainInputText(randomRule.symptom);
    setExtraTexts(randomRule.conditions);
    setNewExtraText("");
    setSelectedCategories({
      connection: randomRule.category === "connection",
      dns: randomRule.category === "dns",
      dhcp: randomRule.category === "dhcp",
      performance: randomRule.category === "performance",
      firwall: randomRule.category === "firewall",
      hardware: randomRule.category === "hardware",
      vpn: randomRule.category === "vpn",
    });
    setShowTools(false);
    setTimeout(() => {
      const responseElement = document.querySelector(".response");
      if (responseElement) {
        responseElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
      {response && response.id && <Response response={response} />}
      <div className="flex items-center w-[99%] m-2 justify-between p-6 rounded-2xl ">
        {/* Main Content */}
        <div className="w-[50%] h-[9rem] relative mx-auto flex bg-gray-800 items-center justify-center rounded-2xl border border-blue-700  shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-70">
          {/* Tools Section - Adjusted for relative positioning for dropdown */}

          <div className="text-center absolute z-10 left-0">
            <button
              onClick={toggleTools}
              className="px-8 py-1 border border-gray-500 absolute top-8 left-4 text-white flex items-center justify-center gap-x-2 rounded-xl shadow-lg hover:bg-[#4d80e4] transition duration-300 ease-in-out transform hover:scale-105 text-lg font-medium"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-[2] text-fg-secondary group-hover/attach-button:text-fg-primary transition-colors duration-100"
              >
                <path
                  d="M10 9V15C10 16.1046 10.8954 17 12 17V17C13.1046 17 14 16.1046 14 15V7C14 4.79086 12.2091 3 10 3V3C7.79086 3 6 4.79086 6 7V15C6 18.3137 8.68629 21 12 21V21C15.3137 21 18 18.3137 18 15V8"
                  stroke="currentColor"
                ></path>
              </svg>
            </button>
            <button
              onClick={handleRandomRule}
              className="px-8 py-1 border border-gray-500 absolute top-8 left-30 text-white flex items-center justify-center gap-x-2 rounded-xl shadow-lg hover:bg-[#4d80e4] transition duration-300 ease-in-out transform hover:scale-105 text-lg font-medium"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-[2] text-fg-secondary group-hover/ds-toggle:text-fg-primary"
              >
                <path
                  d="M19.2987 8.84667C15.3929 1.86808 5.44409 5.76837 7.08971 11.9099C8.01826 15.3753 12.8142 14.8641 13.2764 12.8592C13.6241 11.3504 10.2964 12.3528 10.644 10.844C11.1063 8.839 15.9022 8.32774 16.8307 11.793C18.5527 18.2196 7.86594 22.4049 4.71987 15.2225"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="stroke-black/10 dark:stroke-white/20 transition-all duration-200 origin-center opacity-0 scale-0"
                ></path>
                <path
                  d="M2 13.8236C4.5 22.6927 18 21.3284 18 14.0536C18 9.94886 11.9426 9.0936 10.7153 11.1725C9.79198 12.737 14.208 12.6146 13.2847 14.1791C12.0574 16.2581 6 15.4029 6 11.2982C6 3.68585 20.5 2.2251 22 11.0945"
                  stroke="currentColor"
                  className="transition-transform duration-200 eas-out origin-center rotate-0"
                ></path>
              </svg>
            </button>
            {showTools && (
              <div
                onKeyDown={handleKeyDown}
                className="absolute bottom-full left-1/2 transform -translate-x-1/4 mb-4 w-[30rem] max-h-[70vh] overflow-y-auto bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 space-y-6 z-10"
              >
                {/* Extra Texts */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-blue-300 mb-4">
                    Specifications about issues
                  </h3>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={newExtraText}
                      onChange={handleNewExtraTextChange}
                      placeholder="Add a specification ..."
                      className="flex-grow p-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400"
                    />
                    <button
                      onClick={handleAddExtraText}
                      className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 text-md"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 1v16M1 9h16"
                        />
                      </svg>
                    </button>
                  </div>
                  {extraTexts.length > 0 && (
                    <ul className="space-y-3">
                      {extraTexts.map((text, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center py-2 px-4 bg-gray-700 border border-gray-600 rounded-xl shadow-md text-gray-200 text-md"
                        >
                          <span>{text}</span>
                          <button
                            onClick={() => handleRemoveExtraText(index)}
                            className="text-red-400 hover:text-red-300 text-2xl font-bold ml-4 transition-colors duration-200"
                            title="Remove item"
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <hr className="w-[80%] mx-auto my-7" />

                {/* Categories */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-300 my-4">
                    Suggesst Topics
                  </h3>
                  <div className="space-y-3">
                    {Object.keys(selectedCategories).map((category) => (
                      <label
                        key={category}
                        className="flex items-center text-gray-200 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name={category}
                          checked={
                            selectedCategories[
                              category as keyof typeof selectedCategories
                            ]
                          }
                          onChange={handleCategoryChange}
                          className="mr-3 h-5 w-5 text-blue-500 bg-gray-700 border-gray-500 rounded focus:ring-blue-500 focus:ring-offset-gray-800 cursor-pointer"
                        />
                        <span className="text-lg">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <textarea
            value={mainInputText}
            onChange={handleMainInputChange}
            placeholder="Describe you issue here..."
            rows={2}
            className="w-[90%] h-[6rem] absolute left-0 top-0 border-none rounded-2xl p-6 pb-6 bg-gray-800 text-white placeholder-gray-400  outline-none ring-0 focus:outline-0 focus:ring-0  resize-none"
          ></textarea>
          {/* Submit Button */}
          <button
            onClick={AnalysisIssue}
            className=" absolute right-4 px-4 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 text-lg font-semibold"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-[2] relative"
            >
              <path
                d="M5 11L12 4M12 4L19 11M12 4V21"
                stroke="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default PromptFiled;
