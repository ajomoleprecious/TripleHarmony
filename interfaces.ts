import { ObjectId } from "mongodb";
export interface RootObject {
    pokemons: Pokemon[];
}

export interface Pokemon {
    pokemonName: any;
    name: string;
    image: string;
    nickname?: string;
}

export interface User{
    _id: ObjectId;
    email: string;
    username: string;
    password: string;
    verified: boolean;
}