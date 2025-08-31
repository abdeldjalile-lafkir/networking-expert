import React, { useState, useEffect, useMemo } from "react";

interface ResponseData {
  id: string;
  category: string;
  diagnosis: string;
  solution: string[];
}

interface ResponseProps {
  response?: ResponseData | null;
}

const defaultResponseData: ResponseData = {
  id: "R041",
  category: "DNS",
  diagnosis:
    "Incorrect DNS server configuration on the client, DNS server unreachable, or DNS server issues",
  solution: [
    "Verify the DNS server IP addresses configured on the workstation (`/etc/resolv.conf` on Linux, `ipconfig /all` on Windows)",
    "Ensure the configured DNS servers are reachable (`ping <dns_server_ip>`)",
    "Flush the DNS resolver cache on the workstation (`ipconfig /flushdns` on Windows, `systemd-resolve --flush-caches` or `sudo killall -HUP mDNSResponder` on macOS)",
    "Try using public DNS servers (e.g., 8.8.8.8 or 1.1.1.1) temporarily to test resolution",
    "Restart the DNS Client service on Windows or NetworkManager/systemd-resolved on Linux",
    "Check firewall rules on the client or network for blocks on UDP port 53 (DNS)",
  ],
};

const TYPING_SPEED = 25;

type TypingStage = "id" | "diagnosis" | `solution-${number}` | "done" | string;

const Response: React.FC<ResponseProps> = ({ response: responseProp }) => {
  const activeResponse = useMemo(
    () => responseProp || defaultResponseData,
    [responseProp]
  );

  const [typedId, setTypedId] = useState("");
  const [typedDiagnosis, setTypedDiagnosis] = useState("");
  const [typedSolutions, setTypedSolutions] = useState<string[]>(() =>
    new Array(activeResponse.solution?.length).fill("")
  );

  const [currentTypingStage, setCurrentTypingStage] =
    useState<TypingStage>("id");
  const [charIndex, setCharIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!responseProp) {
      setIsVisible(false);

      return;
    }

    setIsVisible(true);
    setTypedId("");
    setTypedDiagnosis("");
    setTypedSolutions(new Array(activeResponse.solution.length).fill(""));
    setCurrentTypingStage("id");
    setCharIndex(0);
  }, [responseProp, activeResponse]);

  useEffect(() => {
    if (!isVisible || currentTypingStage === "done") {
      return;
    }

    let timerId: NodeJS.Timeout;

    const processTyping = () => {
      let currentTargetText: string | undefined;
      let nextStageAfterCompletion: TypingStage = "done";
      let isSolutionTyping = false;
      let currentSolutionIndex = -1;

      switch (currentTypingStage) {
        case "id":
          currentTargetText = activeResponse.id;
          if (charIndex >= currentTargetText.length) {
            nextStageAfterCompletion = "diagnosis";
          }
          break;
        case "diagnosis":
          currentTargetText = activeResponse.diagnosis;
          if (charIndex >= currentTargetText.length) {
            nextStageAfterCompletion =
              activeResponse.solution?.length > 0 ? "solution-0" : "done";
          }
          break;
        default:
          if (currentTypingStage.startsWith("solution-")) {
            isSolutionTyping = true;
            currentSolutionIndex = parseInt(
              currentTypingStage.split("-")[1],
              10
            );
            currentTargetText = activeResponse?.solution[currentSolutionIndex];
            if (charIndex >= (currentTargetText?.length || 0)) {
              if (currentSolutionIndex < activeResponse?.solution.length - 1) {
                nextStageAfterCompletion = `solution-${
                  currentSolutionIndex + 1
                }`;
              } else {
                nextStageAfterCompletion = "done";
              }
            }
          }
          break;
      }

      if (currentTargetText && charIndex < currentTargetText.length) {
        if (currentTypingStage === "id") {
          setTypedId(currentTargetText.substring(0, charIndex + 1));
        } else if (currentTypingStage === "diagnosis") {
          setTypedDiagnosis(currentTargetText.substring(0, charIndex + 1));
        } else if (isSolutionTyping && currentSolutionIndex !== -1) {
          setTypedSolutions((prevSolutions) => {
            const newSolutions = [...prevSolutions];
            newSolutions[currentSolutionIndex] = currentTargetText!.substring(
              0,
              charIndex + 1
            );
            return newSolutions;
          });
        }
        setCharIndex((prev) => prev + 1);
      } else {
        setCurrentTypingStage(nextStageAfterCompletion);
        setCharIndex(0);
      }
    };

    if (currentTypingStage && currentTypingStage !== "done") {
      timerId = setTimeout(processTyping, TYPING_SPEED);
    }

    return () => clearTimeout(timerId);
  }, [charIndex, currentTypingStage, activeResponse, isVisible]);

  return (
    <div
      className={`w-[60%] h-[30rem] border-2 border-gray-500 rounded-2xl text-xl p-6 bg-gray-800 text-gray-200 shadow-lg overflow-y-auto transition-opacity duration-1000 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionProperty: "opacity, transform",
      }}
      onClick={() => {
        setIsVisible(false);
      }}
    >
      <h3 className="my-4">
        @ The specifications in The Input match the issue with id{" "}
        <span className="text-[#4d80e4]">{typedId}</span>
      </h3>
      <h3 className="my-4">
        @ its likely an <span className="text-[#4d80e4]">{typedDiagnosis}</span>
      </h3>

      <h3>@ you can try solve that by </h3>
      <ul className=" list-inside list-none">
        {activeResponse.solution?.map((_, index) => (
          <li key={index} className="text-gray-400 my-2">
            <span className=" px-4 text-[#4d80e4] font-bold">{"->"}</span>
            {typedSolutions[index] || ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Response;
