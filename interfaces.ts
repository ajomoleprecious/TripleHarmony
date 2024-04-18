import { ObjectId } from "mongodb";
export interface RootObject {
    pokemons: Pokemon[];
}

export interface Pokemon {
    name: string;
    image: string;
}

export interface User{
    _id: ObjectId;
    email: string;
    username: string;
    password: string;
    verified: boolean;
}