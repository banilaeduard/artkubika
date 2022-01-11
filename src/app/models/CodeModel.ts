export interface CodeModel {
    id: string;
    codeDisplay: string;
    codeValue: string;
    code: string;
    children: CodeModel[] | undefined;
    attributeTags: string;
    codeValueFormat: string;
    args: string;
    isRoot: boolean;

    expanded: boolean;
}