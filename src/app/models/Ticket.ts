import { CodeModel } from "./CodeModel";
import { Images } from "./Images";

export interface Ticket {
    code: CodeModel;
    codeValue: string;
    description: string;
    id: string;
    images: Images[];
    hasImages: boolean;
}