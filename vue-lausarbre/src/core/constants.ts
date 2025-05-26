export const RAW_TO_PRETTY = new Map([["nom_rue", "Nom de rue"],
["chef_prenom", "Prénom du chef de famille"],
["chef_nom", "Nom du chef de famille"],
["chef_origine", "Origine du chef de famille"],
["epouse_nom", "Nom de l'épouse"],
["chef_vocation", "Vocation du chef de famille"],
["enfants_chez_parents_prenom", "Prénoms des enfants chez leurs parents"]
])

export const YEARS = Array.from({ length: 1895 - 1805 + 1 }, (_, i) => 1805 + i);