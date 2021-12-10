import { Ticket } from "./Ticket";

export interface ComplaintModel {
    id: string;
    tickets: Ticket[];
}