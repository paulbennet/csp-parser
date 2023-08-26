import directives from "./directives";
interface PolicyResult {
  [key: string]: string[];
}

const policyParser = (policy: string): PolicyResult => {

  const result: PolicyResult = {};
  
  if (policy) {
    policy.split(";").forEach((directive) => {
      if (directive.trim()) {
        const [directiveKey, ...directiveValue] = directive.trim().split(/\s+/g);
        if (directiveKey && !Object.hasOwn(result, directiveKey)) {
          result[directiveKey] = directiveValue;
        } else {
          throw new Error("Invalid CSP")
        }
      }
    });
  }
  return result;
};

export { policyParser }