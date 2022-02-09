import { dropdown } from "./dropdown";

export interface CodeModel extends dropdown {
    id: string;
    codeDisplay: string;
    codeValue: string;
    code: string;
    children: CodeModel[] | undefined;
    attributeTags: string;
    codeValueFormat: string;
    args: string;
    isRoot: boolean;

    parent: CodeModel | undefined;
}