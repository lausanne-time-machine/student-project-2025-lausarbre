<template>
    <!-- Card 1 -->
    <v-card elevation="2" rounded="xl" class="mb-6 pa-6 bg-grey-lighten-4">
        <v-card-title class="text-h4 font-weight-bold text-primary d-flex align-center">
            <v-icon class="me-3">mdi-history</v-icon>
            Lausarbre
        </v-card-title>
        <v-divider class="my-4"></v-divider>
        <v-card-text class="text-body-1">
            <p>
                Dans cette étude, nous explorons les changements sociaux engendrés par la révolution
                industrielle à Lausanne au cours du 19ᵉ siècle. À travers l’analyse d’arbres généalogiques,
                nous cherchons à mieux comprendre l’impact de cette période sur la vie quotidienne des
                familles lausannoises.
            </p>
            <p>
                Nous nous intéressons en particulier à trois statistiques : la transmission du quartier de
                résidence au sein des générations, le nombre d’enfants par famille, et la perpétuation des
                vocations professionnelles de chef de famille aux enfants.
            </p>
        </v-card-text>
    </v-card>

    <!-- Card 2 -->
    <v-card elevation="2" rounded="xl" class="mb-6 pa-6 bg-grey-lighten-4">
        <v-card-title class="text-h5 font-weight-medium text-primary d-flex align-center">
            <v-icon class="me-3">mdi-help-circle-outline</v-icon>
            Problématique
        </v-card-title>
        <v-divider class="my-4"></v-divider>
        <v-card-text class="text-body-1">
            <p>
                Pour pouvoir analyser ces aspects, nous avons besoin de reconstituer les arbres
                généalogiques des familles lausannoises. Ainsi, notre problématique est la suivante :
                établir la généalogie de personnes à l’aide de méthodes computationnelles semi-automatiques.
            </p>
        </v-card-text>
    </v-card>

    <!-- Card 3 -->
    <v-card elevation="2" rounded="xl" class="mb-6 pa-6 bg-grey-lighten-4">
        <v-card-title class="text-h5 font-weight-medium text-primary d-flex align-center">
            <v-icon class="me-3">mdi-database</v-icon>
            Sources
        </v-card-title>
        <v-divider class="my-4"></v-divider>
        <v-card-text class="text-body-1">
            <p>
                Notre étude se base sur une source de données historiques : les recensements de la ville de
                Lausanne de 1805 à 1898. Nous nous sommes concentrés sur les recensements de 1835 à 1898,
                car nous avons un recensement complet pour cette période. Nous n'utilisons pas les recensements brutes
                directement,
                mais les données extraites par OCR (reconnaissance optique de caractères)
            </p>
            Nous utilisons les informations suivantes du recensement:
            <ul class="styled-ul">
                <li>Prénom du chef de famille</li>
                <li>Nom de famille</li>
                <li>Origine du chef de famille</li>
                <li>Vocation du chef de famille</li>
                <li>Rue de résidence</li>
                <li>Épouse du chef de famille</li>
                <li>Prénoms des enfants vivant chez leurs parents</li>
            </ul>
            <p>
                Les données extraites par OCR ne sont pas parfaites et contiennent un certain nombre d'erreurs ainsi que
                des valeurs manquantes.
                Par exemple, certains mots comme "jean" ont tendance à être racourcis en "jn" ou "veuve" en "vve".
                De plus, certaines lettres sont mal reconnues, ce qui conduit à beaucoup d'orthographes différentes pour
                un même mot.
            </p>
        </v-card-text>
        <v-img :src="donneesBrutes" alt="Données brutes" max-width="300" class="mx-auto d-block mb-4 image" />
    </v-card>

    <!-- Card 4 -->
    <v-card elevation="2" rounded="xl" class="mb-6 pa-6 bg-grey-lighten-4">
        <v-card-title class="text-h5 font-weight-medium text-primary d-flex align-center">
            <v-icon class="me-3">mdi-cog-outline</v-icon>
            Méthodologie
        </v-card-title>
        <v-divider class="my-4"></v-divider>
        <v-card-text class="text-body-1">
            <p>
                La reconstitution des arbres généalogiques se fait en deux étapes principales:
            </p>
            <ol class="styled-ul">
                <li>
                    Suivre des personnes sur plusieurs recensements pour reconstituer une seule "entité" (une
                    personne) à
                    partir de plusieurs entrées dans les recensements.
                </li>
                <li>
                    Regrouper les entités pour former des arbres généalogiques, en associant les parents et les
                    enfants.

                </li>
            </ol>

            <h4 class="section-heading">Personnes</h4>
            <p>
                Conceptuellement, reconstituer une "entité" personne est simple: il suffit de reconnaître les entrées
                dans les recensements qui se ressemblent suffisamment pour être considérées comme la même personne.
                En effet, au 19ᵉ siècle, les gens démenageaient peu, ne divorçaient pas, gardaient la même vocation
                pendant de longues périodes.
                Les données d'une même personne sont donc souvent très similaires d'une année à l'autre.
            </p>

            <v-img :src="jeanBernard" alt="Schema Jean Bernard" max-width="700" class="mx-auto d-block mb-4 image" />

            <p>
                Concrètement, ce processus est beaucoup plus complexe.
                En effet, il faut prendre en compte les erreurs d'OCR, les variations d'orthographe,
                et les changements qui peuvent survenir dans la vie d'une personne (comme un changement de vocation, un
                nouvel enfant, ou un déménagement).
                Il faut aussi éviter un maximum les faux positifs, c'est-à-dire les cas où deux personnes différentes
                sont considérées comme la même entité.
                Un exemple d'autre facteur à prendre en compte est le fait que les différentes informations n'ont pas la
                même "importance" pour identifier une personne.
                Les prénoms et noms de famille sont typiquement plus importants que la vocation ou la rue de résidence.
                D'un autre côté, beaucoup de personnes ont le même prénom ou nom de famille (par exemple, Rochat est
                très courant à Lausanne).

            </p>
            <p>
                Pour trouver la meilleure configuration de paramètres à utiliser pour identifier les personnes,
                nous avons testé 3135 configurations différentes.
                Pour chaque configuration, nous avons executé l'algorithme sur 10 années de recensements.
                Nous avons calculé le nombre d'années moyen pendant lesquelles une personne est suivie,
                ainsi que le nombre moyen de personnes ayant "matché" avec chaque entrée dans les recensements.
                Nous avons ensuite utilisé ces deux métriques pour évaluer la qualité de chaque configuration.
            </p>
            <v-img :src="resultatParametres" alt="Résultats de la recherche de paramètres" max-width="700"
                class="mx-auto d-block mb-4 image" />

            <p>
                Le nombre de matchs par entrée est un indicateur du nombre de faux positifs,
                tandis que le nombre d'années suivies est un indicateur de la capacité à suivre une personne sur
                plusieurs années.
                Nous avons choisi la configuration qui maximise le nombre d'années suivies tout en minimisant le nombre
                de faux positifs.
            </p>

            <h4 class="section-heading">Arbres généalogiques</h4>

            <p>
                Une fois les entités personnes reconstituées, il faut établir des liens de parenté entre elles.
                Pour cela, nous avons utilisé les informations suivantes:

            </p>
            <ul class="styled-ul">
                <li> Le prénom de l'enfant</li>
                <li> Le nom de famille</li>
                <li> L'origine du chef de famille</li>
            </ul>

            <p>
                En effet, le nom de famille et l'origine du chef de famille sont les seules informations que l'enfant a
                en commun avec ses parents.
            </p>

            <v-img :src="henriBlanc" alt="Schéma Henri Blanc" max-width="700" class="mx-auto d-block mb-4 image" />


            <p>
                Un autre élément important est le timing: l'année à laquelle l'enfant est retrouvé parmi les personnes
                reconstituées doit être très proche de l'année où il disparaît des entrées du parent.
                Cet élément permet de fortement limiter les faux positifs, car il limite les recensements parmi lesquels
                l'enfant peut être trouvé. En contrepartie, il limite aussi le nombre d'enfants trouvés, car il est
                possible que l'algorithme n'ai pas réussi à retrouver la première entrée où l'enfant est mentionné.
            </p>

            <h4 class="section-heading">Limites et difficultés</h4>
            <p>
                Il est très difficile de retrouver des filles qui se marient, car elles changent de nom de famille et
                d'origine, il ne reste alors que le prénom pour les identifier, ce qui est insuffisant pour les
                distinguer des autres personnes portant le même prénom. Ainsi les femmes sont sous-représentées dans les
                arbres généalogiques reconstitués.
            </p>

            <p>
                Il est toutefois possible d'avoir des femmes chef de famille dans certains cas:

            </p>
            <ol class="styled-ul">
                <li> Si elles quittent le foyer familial avant de se marier: dans ce cas, le nom de l'épouse dans
                    le recensement est "célibataire".</li>
                <li> Si elles sont veuves: dans ce cas, le prénom du chef de famille est "veuve de ...".</li>
            </ol>

            <p>
                Une autre difficulté rencontrée est que l'OCR semble avoir décalé les entrées des épouses dans les
                derniers recensements, ce qui rend le nom des épouses inutilisable dans ces recensements.
            </p>


        </v-card-text>
    </v-card>

    <!-- Card 5 -->
    <v-card elevation="2" rounded="xl" class="mb-6 pa-6 bg-grey-lighten-4">
        <v-card-title class="text-h5 font-weight-medium text-primary d-flex align-center">
            <v-icon class="me-3">mdi-chart-bar</v-icon>
            Résultats
        </v-card-title>
        <v-divider class="my-4"></v-divider>
        <v-card-text class="text-body-1">

            <h4 class="section-heading">Personnes suivies</h4>
            <v-simple-table dense>
                <thead class="table-header">
                    <tr>
                        <th>Nombre d'années suivies</th>
                        <th>Nombre de personnes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in itemsFollowed" :key="item.years" class="table-row">
                        <td>{{ item.years }}</td>
                        <td>{{ item.count }}</td>
                    </tr>
                </tbody>
            </v-simple-table>

            <p>
                Au total, nous avons reconstitué 41061 personnes qui ont été suivies pendant au moins 2 ans. Néanmoins,
                les personnes deviennent fiables lorsqu'elles sont suivies pendant au moins 5 à 10 ans, ainsi nous
                n'avons retenu que les personnes suivies pendant au moins 8 ans pour l'analyse des arbres généalogiques,
                soit 13274 personnes.
            </p>

            <h4 class="section-heading">Arbres généalogiques</h4>
            <v-simple-table dense>
                <thead class="table-header">
                    <tr>
                        <th>Générations</th>
                        <th>Nombre d'arbres</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in itemsTrees" :key="item.generations" class="table-row">
                        <td>{{ item.generations }}</td>
                        <td>{{ item.count }}</td>
                    </tr>
                </tbody>
            </v-simple-table>
            <br>

            <p>
                Nous avons reconstitué 1084 arbres généalogiques, comprenant au total 2466 personnes reconstitutées,
                plus 4518 enfants qui n'ont pas été associés à une personne reconstituée. Ces nombres relativement
                faibles sont le résultat de notre volonté de minimiser au maximum les faux positifs, qui se sont avérés
                très nombreux dans les arbres généalogiques reconstitués.
            </p>

            <h4 class="section-heading">Enfants par famille</h4>
            <v-simple-table dense>
                <thead class="table-header">
                    <tr>
                        <th>Durée de suivi</th>
                        <th>Nombre de personnes</th>
                        <th>Enfants moyen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in itemsChildren" :key="item.followDuration" class="table-row">
                        <td>{{ item.followDuration }}</td>
                        <td>{{ item.count }}</td>
                        <td>{{ item.avgChildren }}</td>
                    </tr>
                </tbody>
            </v-simple-table>
            <br>
            <p>
                Nous avons analysé deux échantillons de personnes: ceux suivis pendant au moins 8 ans et ceux suivis
                pendant au moins 20 ans. Nous avons calculé le nombre d'enfants moyen par famille pour ces deux
                échantillons.
            </p>
            <v-row class="image">

                <v-img :src="enfantsFamille8" alt="Graphe enfants par famille 8+" max-width="650"
                    class="mx-auto d-block mb-4 image" />

                <v-img :src="enfantsFamille20" alt="Graph3 enfants par famille 20" max-width="650"
                    class="mx-auto d-block mb-4 image" />
            </v-row>
            <p>
                Nous avons constaté que le nombre d'enfants moyen par famille croît avec la durée de suivi. Ceci peut
                s'expliquer par le fait qu'une personne suivie pendant 8 ans peut l'être depuis l'âge de 20 ans, et donc
                avant d'avoir eu tous ses enfants ou depuis l'âge de 50 ans et donc après que ses enfants aient quitté
                le foyer familial. Il y a en revanche plus de chances qu'une personne suivie pendant 20 ans ait eu tous
                ses enfants avant la fin du suivi, ce qui explique le nombre d'enfants moyen plus élevé.
                Un autre facteur à prendre en compte est la mortalité infantile, un enfant mort avant l'âge de 5 ans
                n'apparaît probablement pas dans les recensements.
                Ainsi, le nombre d'enfants moyen par famille est biasé vers le bas.
            </p>

            <h4 class="section-heading">Vocations professionnelles</h4>
            <p>
                Pour analyser la transmission des vocations professionnelles, nous nous sommes basés sur les arbres
                généalogiques reconstitués. Pour chaque personne parent d'une ou plusieurs personnes, nous avons
                considéré toutes les vocations de cette personne et de ses enfants. Nous avons ensuite calculé le
                pourcentage de personnes ayant la même vocation que leur parent.
            </p>
            <p>
                Le pourcentage global est de 12%, mais il est artificiellement bas, dans le sens où si un parent à
                plusieurs vocations au cours de sa vie, il est compté plusieurs fois. Par exemple, si le père est
                journalier puis cordonnier et enfin rentier, et que l'enfant devient cordonnier, alors le pourcentage
                n'est que de 33% pour cet enfant.
            </p>

            <v-row class="image">
                <v-img :src="vocations" alt="Graphe vocations" max-width="650" class="mx-auto d-block mb-4 image" />

                <v-img :src="vocationsPourcentage" alt="Graphe vocations pourcentage" max-width="650"
                    class="mx-auto d-block mb-4 image" />
            </v-row>
            <p></p>

            <p>
                Un autre facteur à prendre en compte est la taille de l'échantillon: des métiers communs, comme
                boulanger sont vocations de moins de 25 personnes, ce qui limite la fiabilité des résultats.
                Certains métiers ont aussi plusieurs dénominations, par exemple "agriculteur" et "fermier" sont des
                vocations très proches, mais ne sont pas considérées comme une seule vocation.

            </p>

            <p>
                Un autre point intéressant est que les vocations féminines apparaissent comme beaucoup moins transmises
                que les vocations masculines. Ceci est dû au fait que l'on arrive pas à retrouver les enfants filles, à
                part certains cas particuliers (célibataires). Ainsi, les vocations féminines sont sous-représentées
                dans les arbres généalogiques reconstitués, ce qui biaise les résultats.
            </p>

            <h4 class="section-heading">Quartiers de résidence</h4>
            <p>
                L'analyse des quartiers de résidence a été réalisée en utilisant la même méthode que pour les vocations
                professionnelles. Les résultats obtenus sont néanmoins moins concluants.

            </p>
            <v-row class="image">
                <v-img :src="addresses" alt="Graphe addresses" max-width="650" class="mx-auto d-block mb-4 image" />

                <v-img :src="addressesPourcentage" alt="Graphe addresses pourcentage" max-width="650"
                    class="mx-auto d-block mb-4 image" />
            </v-row>
            <p>
                Les noms des rues sont en général assez peu fiables, probablement en partie à cause des erreurs d'OCR.
                De plus, les rues ont tendance à changer de nom au cours du temps, ce qui complique l'analyse.
            </p>

            <p>
                Un résultat intéressant se dégage toutefois assez clairement: les personnes habitant Ouchy ont tendance
                à rester à Ouchy, cela s'explique qu'à cette époque, Ouchy ne faisait pas partie de la ville de
                Lausanne, mais était un village à part entière. C'est (sauf erreur) le seul village à être inclu dans
                les recensements de Lausanne.
            </p>


        </v-card-text>
    </v-card>






</template>
<script setup lang="ts">
import donneesBrutes from "../assets/donnees_brutes.png"
import jeanBernard from "../assets/jean_bernard.jpg"
import resultatParametres from "../assets/resultat_parametres.png"
import henriBlanc from "../assets/henri_blanc.jpg"
import enfantsFamille20 from "../assets/enfants_famille_20.png"
import enfantsFamille8 from "../assets/enfants_famille_8.png"
import vocations from "../assets/vocations.png"
import vocationsPourcentage from "../assets/vocations_pourcentage.png"
import addresses from "../assets/addresses.png"
import addressesPourcentage from "../assets/addresses_pourcentage.png"


import { ref } from 'vue'
import "../styles/main.css"
const itemsFollowed = ref([
    { years: "2+", count: 41061 },
    { years: "5+", count: 20319 },
    { years: "10+", count: 10312 },
    { years: "20+", count: 3409 },
    { years: "30+", count: 977 },
])

const itemsTrees = ref([
    { generations: "2 (+1)", count: 1011 },
    { generations: "3 (+1)", count: 66 },
    { generations: "4 (+1)", count: 7 },
])

const itemsChildren = ref([
    { followDuration: "8+", count: 13274, avgChildren: 2.31 },
    { followDuration: "20+", count: 3409, avgChildren: 3.07 },
])
</script>

<style scoped>
.image {
    margin: 10px;
}

.section-heading {
    font-size: 1.25rem;
    /* slightly larger than subtitle-1 */
    font-weight: 600;
    margin-bottom: 1rem;
    margin-top: 2rem;
    color: var(--text-secondary);
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.3rem;
}

/* Header background */
.table-header {
    background-color: var(--background-alt);
}

.table-row {
    background-color: var(--table-alt);

}

.table-row:nth-child(odd) {
    background-color: var(--surface);
}

th,
td {
    padding: 12px 16px;
}

/* Rounded corners */
.table-wrapper table {
    border-collapse: separate !important;
    border-spacing: 0;
    border-radius: 8px;
    overflow: hidden;
}

/* Round only top corners of thead */
.table-header tr th:first-child {
    border-top-left-radius: 8px;
}

.table-header tr th:last-child {
    border-top-right-radius: 8px;
}

/* Round bottom corners on tbody last row */
tbody tr:last-child td:first-child {
    border-bottom-left-radius: 8px;
}

tbody tr:last-child td:last-child {
    border-bottom-right-radius: 8px;
}

.styled-ul {
    padding-left: 2rem;
    margin: 1rem;
}
</style>