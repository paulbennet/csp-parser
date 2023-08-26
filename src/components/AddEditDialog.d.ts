import React from "react";
type DialogProps = {
    onClose: Function;
    isOpen: boolean;
    directiveList: string[];
    addSourcesToDirective: Function;
    dir: string;
    src: string[];
    suggestionList: string[];
    addSuggestion: Function;
};
export declare const AddEditDialog: React.FC<DialogProps>;
export {};
