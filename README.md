# BRASSERIEassur — maquette

Maquette du futur site de BRASSERIEassur (courtier en assurance des professionnels de la bière, marque d’ADVISSUR).
Direction « Plan & cachet » : papier crème, encre bleu nuit, rouge cachet ; Fraunces, IBM Plex Sans et IBM Plex Mono.

Adresse prévue : https://brasserieassur-maquette.vercel.app

## Construire

```
node outils/generer.mjs          # pages HTML depuis donnees/ et source/
node outils/images-partage.mjs   # images de partage 1200×630
node _audit/audit.mjs            # audit complet avant chaque livraison
```

Ne jamais modifier les pages `.html` à la main : elles sont réécrites par `generer.mjs`.

## Images

- Les images Grok vont dans `recu/grok/`, sous leur nom exact (liste et consignes : document Grok, et `donnees/images.json` pour les textes alternatifs et les cadrages).
- Les ajouter à `recu/lot.json`, puis `python3 outils/images.py recu/lot.json` et `node outils/generer.mjs`.
- Tant qu’une image manque, son emplacement affiche un dessin au trait et « Illustration à venir ». Dès qu’elle est convertie, elle prend sa place toute seule, avec sa mention « Illustration générée ».
- Une version téléphone dédiée s’appelle `<nom>-mobile` : elle est utilisée automatiquement sur téléphone en portrait.

## À fournir par le client

- Logo définitif (le logotype capsule « Ba » est provisoire, à valider).
- Raison sociale d’ADVISSUR, forme, capital, SIREN, RCS, adresse du siège, directeur de la publication, téléphone.
- Confirmation du numéro ORIAS (24008249 sur le site actuel, non vérifié).
- Assureur et contrat de RC professionnelle et de garantie financière ; procédure de réclamation et médiateur ; mention TVA ; syndicats.
- Description des trois services (audit, visite de risques, digitalisation), horaires du cabinet et jours de rendez-vous (le calendrier propose aujourd’hui tous les jours à venir, week-ends compris).
- Périmètre exact de l’offre Orus (le site actuel cite « brasseries, cafés et bars éligibles », TPE de moins de 500 m² et de moins de 3 M€).
- Contenu des fiches Distributeurs et Événements (Bierologie), absent du site actuel (pages en 404).
- Texte de l’article du blog sur l’intoxication (page illisible au moment du relevé).
- Portraits et parcours de l’équipe, vraies photos des locaux si possible.
- Politique de confidentialité complète.

## Corrigé par rapport au site actuel (à valider par le client)

- « En tant qu’assureur », « nous indemnisons » : BRASSERIEassur est courtier, c’est l’assureur qui indemnise.
- « Les meilleures garanties du marché » retiré : il contredit la page Devoir de conseil (analyse sur un nombre limité de contrats).
- Garantie de conformité : article L217-3 du Code de la consommation (et non L217-4) ; elle protège les acheteurs consommateurs, sa portée entre professionnels est à valider. Vices cachés : articles 1641 et 1648 du Code civil.
- « Assurance de crédit fournisseur » renommée « assurance-crédit » (non-paiement des clients).
- Mentions légales actuelles : directeur de publication et e-mail d’un autre site (food truck) ; aucune raison sociale ni SIREN.
- Phrases non reprises faute de preuve : « unanimement reconnues », « aucune n’a fait l’objet d’alerte ou de sanction ».
- À propos : « Nos garanties prennent en charge », « indemnisation en valeur à neuf… pour reprendre votre activité rapidement », « nous fournissons les attestations » reformulés en termes de courtier (c’est l’assureur qui garantit, indemnise et délivre les attestations), sans promesse de résultat.
- Négociants : « assurer votre exploitation contre les clauses d’achat » contredisait la fiche assurance-crédit ; l’ouverture parle désormais d’engagements dont les assurances limitent les conséquences.
- Fabricants : « votre réputation et votre rentabilité sont préservées » remplacé par « contribuent à limiter les conséquences financières ».
- Registre ORIAS : « garantie financière » retirée de la liste (exigée seulement des courtiers qui encaissent des fonds, à confirmer).

## À la mise en ligne définitive

À retirer :
- la consigne `noindex` : balise robots dans `source/gabarits/commun.mjs` et en-tête `X-Robots-Tag` dans `vercel.json` ;
- les formulaires simulés (devis, rendez-vous, contact) : à brancher sur un vrai envoi ;
- toutes les mentions « à compléter » et les emplacements « Illustration à venir ».

À garder :
- la mention « Illustration générée » sur chaque image créée par IA.
