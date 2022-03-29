import { CodeModel } from "./CodeModel";
import { Attachment } from "./Attachment";

export interface Ticket {
    codeLinks: CodeModel[];
    codeValue: string;
    description: string;
    id: string;
    attachments: Attachment[];
    toAddAttachment: Attachment[];
    toDeleteAttachment: Attachment[];
    hasAttachments: boolean;
    created: Date;
    tags: any;
}