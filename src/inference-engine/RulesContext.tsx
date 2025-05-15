/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Rule } from "./DataTypes";
import connectionIssues from "../knowladge-base/connection.json";
import dhcpIssues from "../knowladge-base/dhcp.json";
import dnsIssues from "../knowladge-base/dns.json";
import firewallIssues from "../knowladge-base/firewall.json";
import hardwareIssues from "../knowladge-base/hardware.json";
import performanceIssues from "../knowladge-base/performance.json";
import vpnIssues from "../knowladge-base/vpn.json";

interface RulesContextType {
  rules: Rule[];
  loading: boolean;
  error: string | null;
}

const RulesContext = createContext<RulesContextType | undefined>(undefined);

export const RulesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRules = async () => {
      try {
        setLoading(true);
        setError(null);
        let loadedRules: Rule[] = [];

        const jsonFiles = [
          connectionIssues,
          dhcpIssues,
          dnsIssues,
          firewallIssues,
          hardwareIssues,
          performanceIssues,
          vpnIssues,
        ];

        for (const fileModule of jsonFiles) {
          const fileData = fileModule;
          if (Array.isArray(fileData)) {
            loadedRules = loadedRules.concat(fileData as Rule[]);
          } else {
            console.warn(
              "Encountered a JSON module that is not an array:",
              fileModule
            );
          }
        }
        setRules(loadedRules);
      } catch (err) {
        console.error("Error loading or parsing JSON files:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while loading rules."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, []);

  return (
    <RulesContext.Provider value={{ rules, loading, error }}>
      {children}
    </RulesContext.Provider>
  );
};

export const useRules = (): RulesContextType => {
  const context = useContext(RulesContext);
  if (context === undefined) {
    throw new Error("useRules must be used within a RulesProvider");
  }
  return context;
};
