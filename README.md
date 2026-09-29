# Tingis Route Planner

voila le logo de l'école , le lien de site de l'école https://madarisstingis.ma/

Créer un MVP web premium, moderne, très visuel et entièrement interactif pour **Madariss TINGIS**, établissement scolaire couvrant les niveaux Maternelle, Primaire, Collège et Lycée.

Le MVP doit représenter une future plateforme interne dédiée à la gestion du transport scolaire et de la flotte.

IMPORTANT :
- Front-end only.
- Aucun backend.
- Aucune base de données réelle.
- Aucune API réelle.
- Aucune intégration GPS.
- Aucune intégration Pronote.
- Aucune authentification réelle.
- Toutes les données doivent être simulées avec une mock data riche.
- Toutes les actions doivent être simulées côté front-end avec local state.
- L'application doit être démontrable commercialement devant le client.

## 1. Identité visuelle

Analyser et reprendre l'identité visuelle du site officiel :

https://madarisstingis.ma/

Reprendre autant que possible :
- logo ;
- couleurs principales ;
- couleurs secondaires ;
- typographies ou équivalents proches ;
- esprit graphique ;
- univers scolaire premium ;
- formes ;
- arrondis ;
- style des boutons.

Créer une version plus moderne et digitale de cette identité.

L'application ne doit surtout pas ressembler à un dashboard SaaS générique.

Style :
- moderne ;
- premium ;
- scolaire ;
- institutionnel ;
- professionnel ;
- clair ;
- légèrement technologique sur les fonctionnalités IA ;
- cartes élégantes ;
- micro-animations ;
- icônes modernes ;
- belles hiérarchies visuelles.

Utilisateurs principaux :
- direction ;
- responsable transport ;
- responsable flotte ;
- administration.

## 2. Page de connexion

Créer une page de connexion premium.

Titre :
**Gestion intelligente du transport scolaire**

Sous-titre :
**Centralisez votre flotte, vos circuits et vos opérations de transport.**

Champs :
- email ;
- mot de passe.

Bouton :
**Se connecter**

Connexion simulée uniquement.

Prévoir des identifiants de démonstration visibles.

## 3. Structure générale

Créer une sidebar fixe avec :

1. Tableau de bord
2. Agent IA – Optimisation
3. Circuits scolaires
4. Élèves
5. Véhicules
6. Chauffeurs
7. Planning
8. Maintenance
9. Incidents
10. Analytics
11. Paramètres

Top bar :
- logo ;
- établissement ;
- année scolaire 2026/2027 ;
- recherche globale ;
- notifications ;
- profil utilisateur.

Ajouter breadcrumb sur les pages internes.

## 4. Tableau de bord

Créer un dashboard visuel avec les KPI suivants :

- 426 élèves transportés
- 14 véhicules
- 11 véhicules disponibles
- 3 véhicules indisponibles
- 12 chauffeurs disponibles
- 10 circuits actifs
- 2 véhicules en maintenance
- 3 incidents ouverts

Créer des cartes avec petites variations :
- +12 élèves transportés
- -1 véhicule disponible
- +2 incidents cette semaine

Ajouter :

### Transport aujourd'hui
Afficher plusieurs circuits :
- nom du circuit ;
- élèves ;
- bus ;
- chauffeur ;
- horaire ;
- statut.

### Disponibilité flotte
Donut :
- disponible ;
- maintenance ;
- incident.

### Alertes
Exemples :
- Bus B-07 indisponible
- Maintenance B-03 dans 4 jours
- Chauffeur indisponible mercredi
- 5 élèves non affectés à un circuit

### Planning du jour
Timeline visuelle.

## 5. Module Élèves

Créer une base mock riche de minimum 100 élèves.

Colonnes :
- matricule ;
- nom complet ;
- niveau ;
- classe ;
- adresse ;
- quartier ;
- transport scolaire ;
- circuit ;
- point de ramassage ;
- statut ;
- actions.

Niveaux :
- Maternelle ;
- Primaire ;
- Collège ;
- Lycée.

Utiliser des noms marocains réalistes et des adresses de Tanger.

Fonctions :
- recherche ;
- filtres ;
- tri ;
- pagination ;
- sélection multiple ;
- actions individuelles.

CRUD simulé :
- créer ;
- consulter ;
- modifier ;
- supprimer ;
- dupliquer.

Formulaire élève :
- prénom ;
- nom ;
- niveau ;
- classe ;
- adresse ;
- quartier ;
- téléphone parent ;
- besoin transport ;
- point de ramassage.

Après création ou modification :
afficher un toast.

## 6. Import simulé d'élèves

Ajouter un bouton :
**Importer un fichier**

Créer une modal avec :
- drag & drop Excel / CSV ;
- aperçu simulé ;
- mapping de colonnes ;
- validation ;
- résultat fictif.

Exemple :
128 élèves détectés
123 valides
5 nécessitent une vérification

## 7. Module Véhicules

Créer 14 véhicules mock.

Deux vues :
- cards ;
- tableau.

Informations :
- numéro interne ;
- immatriculation ;
- marque ;
- modèle ;
- capacité ;
- année ;
- statut ;
- disponibilité ;
- circuit actuel ;
- prochain entretien.

Statuts :
- Disponible
- Affecté
- Maintenance
- Indisponible
- Incident

## 8. Fiche véhicule

Créer une fiche détaillée avec header.

Exemple :
Bus B-04
Toyota Coaster
30 places

Tabs :
- Informations
- Planning
- Maintenance
- Incidents
- Historique

Actions :
- modifier ;
- marquer indisponible ;
- ajouter maintenance ;
- ajouter incident.

## 9. Module Chauffeurs

Créer 15 chauffeurs mock.

Colonnes :
- chauffeur ;
- téléphone ;
- disponibilité ;
- véhicule affecté ;
- circuit ;
- planning ;
- statut ;
- actions.

Statuts :
- Disponible
- Affecté
- Absent
- Congé
- Indisponible

Fiche chauffeur :
- informations personnelles utiles ;
- contact ;
- disponibilité ;
- planning ;
- véhicule affecté ;
- circuits affectés ;
- historique d'affectation.

IMPORTANT :
Ne pas créer de scoring de conduite, vitesse, kilométrage ou tracking GPS.

## 10. Module Circuits scolaires

Créer une table des circuits.

Colonnes :
- référence ;
- nom ;
- zone ;
- nombre d'élèves ;
- véhicule ;
- chauffeur ;
- capacité ;
- horaire ;
- statut ;
- actions.

Statuts :
- Brouillon
- Généré par IA
- Validé
- Planifié
- Archivé

Actions :
- voir ;
- modifier ;
- dupliquer ;
- régénérer avec IA ;
- archiver ;
- supprimer.

Ajouter filtres, recherche, tri et pagination.

## 11. Fiche circuit

Créer des tabs :
- Vue générale
- Élèves
- Carte
- Planning
- Historique

Afficher :
- bus ;
- chauffeur ;
- nombre d'élèves ;
- capacité ;
- zones ;
- horaires ;
- statut.

## 12. Agent IA – Optimisation des circuits

CE MODULE EST LE CŒUR DU MVP.

Créer une page premium intitulée :

**Agent IA Transport**

Sous-titre :
**Optimisez automatiquement la répartition des élèves, des véhicules et des chauffeurs.**

Créer une ambiance légèrement plus technologique :
- halo ;
- gradient ;
- animation subtile ;
- loader IA ;
- icône IA.

L'agent IA doit prendre uniquement :

### Élèves
- adresse ;
- quartier ;
- niveau ;
- point de ramassage ;
- besoin de transport.

### Véhicules
- disponibilité ;
- capacité ;
- statut ;
- planning.

### Chauffeurs
- disponibilité ;
- planning.

NE PAS utiliser :
- GPS temps réel ;
- vitesse ;
- comportement de conduite ;
- kilométrage GPS ;
- consommation réelle ;
- télématique.

## 13. Wizard IA

Créer un processus en plusieurs étapes.

### Étape 1
Sélection des élèves.

Options :
- tous ;
- par niveau ;
- par classe ;
- par zone ;
- sélection personnalisée.

### Étape 2
Sélection des véhicules disponibles.

Afficher des cards véhicules avec :
- modèle ;
- capacité ;
- statut ;
- disponibilité.

Les véhicules indisponibles doivent être désactivés.

Afficher :
**11 véhicules disponibles sur 14**

### Étape 3
Sélection des chauffeurs disponibles.

Afficher cards :
- avatar ;
- nom ;
- disponibilité ;
- véhicule habituel ;
- horaires.

### Étape 4
Paramètres d'optimisation.

Objectifs :
- minimiser la distance globale ;
- minimiser le temps de trajet ;
- équilibrer les capacités ;
- réduire le nombre de bus ;
- équilibre recommandé.

Contraintes :
- respecter la capacité ;
- durée maximale souhaitée ;
- conserver certains élèves ensemble ;
- conserver certaines affectations existantes.

Ajouter toggles, dropdowns et sliders.

## 14. Bouton IA

Créer un gros CTA :

**Générer les circuits avec l'IA**

Au clic :
lancer une simulation animée de quelques secondes.

Étapes animées :
1. Analyse de 426 adresses
2. Regroupement géographique
3. Analyse des véhicules disponibles
4. Vérification des capacités
5. Analyse des chauffeurs
6. Génération des itinéraires
7. Optimisation
8. Vérification des contraintes
9. Finalisation

Ajouter :
- barre de progression ;
- messages dynamiques ;
- animations ;
- loader.

## 15. Résultat IA

Afficher :

426 élèves analysés

11 bus disponibles

10 bus recommandés

10 circuits générés

12 chauffeurs disponibles

10 chauffeurs affectés

Capacité utilisée : 88 %

## 16. Carte simulée

Créer une grande carte visuelle de Tanger.

Même si aucune vraie API map n'est utilisée, simuler une carte crédible.

Afficher :
- établissement ;
- élèves ;
- arrêts ;
- circuits ;
- couleurs différentes ;
- tracés ;
- ordre des arrêts.

Zones mock :
- Ziaten
- Route de Rabat
- Mesnana
- Iberia
- Centre-ville
- Malabata
- Boubana
- Achakar
- Branes
- Moujahidine
- Val Fleuri

Interactions :
- hover ;
- sélectionner un circuit ;
- masquer / afficher ;
- zoom simulé.

## 17. Résultat par circuit

Créer des cards.

Exemple :

Circuit C-01 — Ziaten / Route de Rabat

Bus B-03
Capacité : 45
Élèves : 42 / 45
Chauffeur : Ahmed Benali
Occupation : 93 %
Arrêts : 8

Afficher l'ordre des arrêts.

Ajouter une jauge de remplissage.

## 18. Explication IA

Pour chaque circuit, ajouter :

**Pourquoi cette proposition ?**

Exemple :
« Les élèves ont été regroupés selon leur proximité géographique. Le bus B-03 a été retenu pour sa capacité et sa disponibilité sur ce créneau. »

Réponse simulée.

## 19. Comparaison avant / après

Organisation actuelle :
- 11 circuits ;
- 11 bus ;
- occupation moyenne 76 %.

Optimisation IA :
- 10 circuits ;
- 10 bus ;
- occupation moyenne 88 %.

Présenter cela visuellement.

## 20. Actions après génération

Boutons :
- Valider cette proposition
- Modifier manuellement
- Relancer l'optimisation
- Modifier les contraintes
- Voir sur la carte
- Exporter
- Annuler

Toutes les actions sont simulées.

## 21. Modification manuelle

Permettre un drag & drop simulé d'un élève d'un circuit à un autre.

Afficher la capacité mise à jour.

Si capacité dépassée :
afficher une alerte.

## 22. Module Planning

Créer un planning visuel.

Vues :
- Jour
- Semaine
- Mois

Ressources :
- véhicules ;
- chauffeurs ;
- circuits.

Chaque événement :
- horaire ;
- circuit ;
- bus ;
- chauffeur.

Ajouter :
- drag & drop simulé ;
- modification ;
- création ;
- suppression ;
- filtres ;
- détection visuelle des conflits.

## 23. Données mock

Créer des données cohérentes :

- minimum 100 élèves ;
- 14 véhicules ;
- 15 chauffeurs ;
- 10 circuits ;
- plusieurs semaines de planning.

Ne jamais utiliser lorem ipsum.

Toutes les données doivent sembler réelles et cohérentes.

## 24. Comportement des tableaux

Toutes les tables doivent avoir :

- recherche ;
- tri ascendant / descendant ;
- filtres ;
- pagination ;
- 10 / 25 / 50 lignes ;
- sélection multiple ;
- checkbox ;
- menus actions ;
- hover ;
- sticky header ;
- badges.

## 25. UX

Ajouter dès cette première version :
- hover cards ;
- toasts ;
- confirmations ;
- drawers ;
- tabs ;
- modales ;
- loaders ;
- skeletons ;
- transitions ;
- responsive desktop/tablette.

IMPORTANT :
Ne pas chercher encore à perfectionner Maintenance, Incidents, Analytics et Paramètres. Créer uniquement les entrées de menu nécessaires. Ces modules seront complétés dans un deuxième prompt.

L'objectif de ce premier prompt est d'obtenir une application déjà navigable et convaincante avec :
- dashboard ;
- élèves ;
- véhicules ;
- chauffeurs ;
- circuits ;
- planning ;
- agent IA fonctionnel en simulation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bbceabd3-e945-4fb8-b3da-70d8aa99bd95).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
