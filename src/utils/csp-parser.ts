interface PolicyResult {
  [key: string]: string[];
}

const policyParser = (policy: string): PolicyResult => {

  const result: PolicyResult = {};

  if (policy) {
    policy.split(";").forEach((directive) => {
      const [directiveKey, ...directiveValue] = directive.trim().split(/\s+/g);
      if (directiveKey && !Object.hasOwn(result, directiveKey)) {
        result[directiveKey] = directiveValue;
      }
    });
  }
  return result;
};

export { policyParser }