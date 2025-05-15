import { type Rule } from "./DataTypes.ts";
import connectionIssues from "../knowladge-base/connection.json" assert { type: "json" };
import dhcpIssues from "../knowladge-base/dhcp.json" assert { type: "json" };
import dnsIssues from "../knowladge-base/dns.json" assert { type: "json" };
import firewallIssues from "../knowladge-base/firewall.json" assert { type: "json" };
import hardwareIssues from "../knowladge-base/hardware.json" assert { type: "json" };
import performanceIssues from "../knowladge-base/performance.json" assert { type: "json" };
import vpnIssues from "../knowladge-base/vpn.json" assert { type: "json" };

(async function loadKnowledgeBase() {
  let rules: Rule[] = [];

  const jsonFiles = [
    connectionIssues,
    dhcpIssues,
    dnsIssues,
    firewallIssues,
    hardwareIssues,
    performanceIssues,
    vpnIssues,
  ];
  for (const file of jsonFiles) {
    try {
      const parsedData = JSON.parse(JSON.stringify(file));
      rules = rules.concat(parsedData);
    } catch (error) {
      console.error(`Error parsing JSON file: ${error}`);
    }
  }

  console.log("Rules loaded into global context");
})();
