# MVP transport scolaire Madariss TINGIS

## Objectif
Créer une application de démonstration en français, entièrement locale et sans connexion réelle, reprenant l’identité rouge et turquoise de Madariss TINGIS. Le parcours sera pensé pour une présentation commerciale sur ordinateur et tablette.

## Expérience proposée
- Écran de connexion premium avec identifiants de démonstration visibles et accès simulé.
- Espace principal avec navigation latérale rétractable, barre supérieure, recherche, notifications et profil.
- Pages navigables pour le tableau de bord, l’agent IA, les circuits, les élèves, les véhicules, les chauffeurs et le planning.
- Entrées visibles mais volontairement succinctes pour Maintenance, Incidents, Analytics et Paramètres.
- Interface institutionnelle et scolaire, sans esthétique de tableau SaaS générique.

## Fonctionnalités
- Tableau de bord : indicateurs demandés, transport du jour, disponibilité de la flotte, alertes et planning visuel.
- Élèves : 100+ profils marocains cohérents, recherche, filtres, tri, pagination, sélection et opérations simulées; formulaire et import CSV/Excel en plusieurs étapes.
- Véhicules : 14 véhicules, vues cartes/tableau, filtres, statuts et fiche détaillée à onglets.
- Chauffeurs : 15 chauffeurs, tableau interactif et fiche détaillée, sans données GPS ni notation de conduite.
- Circuits : 10 circuits, recherche/tri/filtres/pagination, actions simulées et fiche à onglets.
- Agent IA : assistant en quatre étapes, choix des élèves/véhicules/chauffeurs, contraintes, simulation animée, résultats, carte illustrée de Tanger, comparaison avant/après et actions simulées.
- Planning : vues jour/semaine/mois, filtres, événements manipulables et conflits signalés visuellement.

## Interactions
- Toutes les données et modifications restent dans l’état local du navigateur pendant la démonstration.
- Toasts, modales, panneaux latéraux, confirmations, chargements et transitions discrètes.
- Navigation et vues adaptées aux écrans desktop et tablette.

## Direction visuelle
- Logo fourni utilisé dans l’application et décliné en favicon.
- Palette rouge corail, turquoise et tons neutres lumineux issue de l’école.
- Typographie éditoriale pour les titres, sans-serif très lisible pour l’interface.
- Formes inspirées du ruban du logo, détails colorés, cartes sobres et rayons maîtrisés.
- L’IA reçoit un traitement légèrement plus technologique, tout en restant cohérente avec l’univers scolaire.

## Technique
- Une seule application front-end TanStack Start/React avec routes dédiées pour chaque module.
- Données de démonstration centralisées et cohérentes; aucune API, base de données ou authentification réelle.
- Composants partagés pour la navigation, tableaux, statuts, formulaires, modales et notifications.
- Métadonnées propres à chaque page et vérification visuelle desktop/tablette avant livraison.
