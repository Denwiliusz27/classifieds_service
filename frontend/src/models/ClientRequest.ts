import {ClientAddress} from "./ClientAddress";

export interface ClientRequest {
    name: string;
    second_name: string;
    email: string;
    password: string;
    addresses: ClientAddress[]
}