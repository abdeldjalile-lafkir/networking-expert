import { type Rule, type Request, type Response } from "./DataTypes.ts";

const runInference = (request: Request, rules: Rule[]): Response => {
  const { symptom, conditions, keywords } = request;

  for (const rule of rules) {
    if (symptom === rule.symptom) {
      if (conditions.length > 0) {
        const matchedConditions = conditions.filter((condition) =>
          rule.conditions.includes(condition)
        );
        if (matchedConditions.length === rule.conditions.length) {
          return {
            id: rule.id,
            category: rule.category,
            diagnosis: rule.diagnosis,
            solution: rule.solution,
          };
        }
      } else {
        return {
          id: rule.id,
          category: rule.category,
          diagnosis: rule.diagnosis,
          solution: rule.solution,
        };
      }
    } else {
      if (keywords.length > 0) {
        const matchedKeywords = keywords.filter((keyword) =>
          rule.symptom.includes(keyword)
        );
        if (matchedKeywords.length > 0) {
          return {
            id: rule.id,
            category: rule.category,
            diagnosis: rule.diagnosis,
            solution: rule.solution,
          };
        }
      }
    }
  }

  return {
    id: "unknown",
    category: "unknown",
    diagnosis: "unknown",
    solution: ["No solution found."],
  };
};

export default runInference;
