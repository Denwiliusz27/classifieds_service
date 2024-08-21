import {City} from "./City";

export interface ClientAddress {
    city_id: number;
    street: string;
    building_nr: number;
    flat_nr: number;
}

export interface ClientAddressExtended {
    id: number
    street: string;
    building_nr: number;
    flat_nr: number;
    city: City;
}