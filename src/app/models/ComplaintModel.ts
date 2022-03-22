import { Ticket } from "./Ticket";

export interface ComplaintModel {
    id: string;
    tickets: Ticket[];
    created: Date;
    dataKey: string;
    status: string;
    nrComanda: string;
}