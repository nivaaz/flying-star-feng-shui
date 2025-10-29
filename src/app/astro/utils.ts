import { AstrologyAspect } from "./constants";

export const getAspectsByPlanet = (aspects: AstrologyAspect[], planet: string, currAspect: string) => {

    const specificAspects = aspects.filter(a =>
        a.aspect.en === currAspect && (a.planet_1.en === planet || a.planet_2.en === planet)
    );

    return specificAspects;

};