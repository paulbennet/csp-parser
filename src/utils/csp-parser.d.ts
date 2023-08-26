interface PolicyResult {
    [key: string]: string[];
}
declare const policyParser: (policy: string) => PolicyResult;
export { policyParser };
