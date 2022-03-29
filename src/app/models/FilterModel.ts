import { dropdown } from "./dropdown";

export interface FilterModel extends dropdown {
    id: string;
    query: string;
    dirty: boolean;
    name: string;
    tags: string;
}
