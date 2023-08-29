enum CommonKeyword {
    SELF = '\'self\'',
    NONE = '\'none\'',
    UNSAFE_INLINE = '\'unsafe-inline\'',
    UNSAFE_EVAL = '\'unsafe-eval\'',
    WASM_EVAL = '\'wasm-eval\'',
    WASM_UNSAFE_EVAL = '\'wasm-unsafe-eval\'',
    STRICT_DYNAMIC = '\'strict-dynamic\'',
    UNSAFE_HASHED_ATTRIBUTES = '\'unsafe-hashed-attributes\'',
    UNSAFE_HASHES = '\'unsafe-hashes\'',
    REPORT_SAMPLE = '\'report-sample\'',
    BLOCK = '\'block\'',
    ALLOW = '\'allow\'',
    BLOB = 'blob:',
    DATA = 'data:',
    MEDIA_STREAM = 'mediastream:',
    FILE_SYSTEM = 'filesystem:'
}

const SandBoxValues: string[] = [
    "allow-downloads",
    "allow-downloads-without-user-activation",
    "allow-forms",
    "allow-modals",
    "allow-orientation-lock",
    "allow-pointer-lock",
    "allow-popups",
    "allow-popups-to-escape-sandbox",
    "allow-presentation",
    "allow-same-origin",
    "allow-scripts",
    "allow-storage-access-by-user-activation",
    "allow-top-navigation",
    "allow-top-navigation-by-user-activation",
    "allow-top-navigation-to-custom-protocols"
];

enum Directive {
    // Fetch directives
    CHILD_SRC = 'child-src',
    CONNECT_SRC = 'connect-src',
    DEFAULT_SRC = 'default-src',
    FONT_SRC = 'font-src',
    FRAME_SRC = 'frame-src',
    IMG_SRC = 'img-src',
    MEDIA_SRC = 'media-src',
    OBJECT_SRC = 'object-src',
    SCRIPT_SRC = 'script-src',
    SCRIPT_SRC_ATTR = 'script-src-attr',
    SCRIPT_SRC_ELEM = 'script-src-elem',
    STYLE_SRC = 'style-src',
    STYLE_SRC_ATTR = 'style-src-attr',
    STYLE_SRC_ELEM = 'style-src-elem',
    PREFETCH_SRC = 'prefetch-src',

    MANIFEST_SRC = 'manifest-src',
    WORKER_SRC = 'worker-src',

    // Document directives
    BASE_URI = 'base-uri',
    SANDBOX = 'sandbox',

    // Navigation directives
    FORM_ACTION = 'form-action',
    NAVIGATE_TO = 'navigate-to',

    // Reporting directives
    REPORT_TO = 'report-to',
    REPORT_URI = 'report-uri',
}

const COMMON_DIRECTIVES: string[] = [
    Directive.CHILD_SRC, Directive.CONNECT_SRC, Directive.DEFAULT_SRC,
    Directive.FONT_SRC, Directive.FRAME_SRC, Directive.IMG_SRC,
    Directive.MANIFEST_SRC, Directive.MEDIA_SRC, Directive.OBJECT_SRC,
    Directive.SCRIPT_SRC, Directive.SCRIPT_SRC_ATTR, Directive.SCRIPT_SRC_ELEM,
    Directive.STYLE_SRC, Directive.STYLE_SRC_ATTR, Directive.STYLE_SRC_ELEM,
    Directive.WORKER_SRC, Directive.BASE_URI, Directive.NAVIGATE_TO, Directive.FORM_ACTION
];

function isKeyword(keyword: string): boolean {
    return Object.values(CommonKeyword).includes(keyword as CommonKeyword)
}

const STRICT_NONCE_PATTERN = new RegExp('^\'nonce-[a-zA-Z0-9+/_-]+[=]{0,2}\'$');
const NONCE_PATTERN = new RegExp('^\'nonce-(.+)\'$');
const STRICT_HASH_PATTERN = new RegExp('^\'(sha256|sha384|sha512)-[a-zA-Z0-9+/]+[=]{0,2}\'$');
const HASH_PATTERN = new RegExp('^\'(sha256|sha384|sha512)-(.+)\'$');
const REPORT_URI_PATTERN = new RegExp('https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*(.+)*');
const REPORT_TO_PATTERN = new RegExp('^[a-zA-Z0-9]+');


function isNonce(nonce: string, strictCheck?: boolean): boolean {
    const pattern = strictCheck ? STRICT_NONCE_PATTERN : NONCE_PATTERN;
    return pattern.test(nonce);
}

function isHash(hash: string, strictCheck?: boolean): boolean {
    const pattern = strictCheck ? STRICT_HASH_PATTERN : HASH_PATTERN;
    return pattern.test(hash);
}

const isValidURL = (url: string) => {
    return url.match(/^(https?|wss?):\/\/((\*\.)?([\w-]+\.)*[\w-]+)(:\d+)?(\/.*)?$/gm);
};

export const evaluatePolicy = (directive: string, source: string): Boolean | string => {

    source = source.trim();

    if (COMMON_DIRECTIVES.includes(directive)) {
        if (isKeyword(source)) {
            return true;
        } else if (isHash(source)) {
            return true;
        } else if (isValidURL(source)) {
            return true;
        } else if (isNonce(source)) {
            return true;
        } else if (source === "*") {
            return true;
        }
    } else if (directive === Directive.SANDBOX) {
        if (SandBoxValues.includes(source)) {
            return true;
        }
    } else if (directive === Directive.REPORT_URI) {
        return REPORT_URI_PATTERN.test(source);
    } else if (directive === Directive.REPORT_TO) {
        return REPORT_TO_PATTERN.test(source);
    }
    return false;
}

export const evaluateSourcesAgainstDirective = (dir: string, sources: string[]) => {
    const src = sources.filter((source) => {
        return evaluatePolicy(dir, source);
    });

    return src;
};

interface PolicyResult {
    [key: string]: string[];
}

export const policyParser = (policy: string): PolicyResult => {

    const result: PolicyResult = {};

    if (policy) {
        policy.split(";").forEach((directive) => {
            if (directive.trim()) {
                const [directiveKey, ...directiveValue] = directive.trim().split(/\s+/g);
                if (directiveKey && !Object.hasOwn(result, directiveKey)) {
                    const sources = directiveValue.filter((source) => {
                        return evaluatePolicy(directiveKey, source);
                    });

                    result[directiveKey] = sources;
                } else {
                    throw new Error("Invalid CSP")
                }
            }
        });
    }
    return result;
};

export const getPolicyString = (directives: Object) => {
    let policyString = "";

    Object.keys(directives)
        .forEach((directive) => {
            if (directives[directive].length > 0) {
                const policy = `${directive} ${directives[directive].join(" ")}; `;
                policyString = policyString.concat(policy);
            }
        })
    
    return policyString;
};

export const sortSources = (sources: string[]) => {

    const schemeSources = [];
    const hostSources = [];

    sources.forEach((source) => {
        if (isKeyword(source)) {
            schemeSources.push(source)
        } else {
            hostSources.push(source);
        }
    });

    schemeSources.sort();
    hostSources.sort();

    return { schemeSources: schemeSources, hostSources: hostSources };
};