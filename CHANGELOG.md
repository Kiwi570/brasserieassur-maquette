# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v4 — une ouverture par page

**Ouvertures** (nouveau fichier `source/gabarits/ouvertures.mjs`, une « forme » par page) :
- Accueil : photo des cuves en plein écran, titre géant posé dessus, la caméra recule doucement, bulles et vapeur ;
- Brasseries : la photo dans la silhouette d'un fermenteur qui se dessine puis se remplit, compteur de niveau ;
- Producteurs : étiquette de bouteille qui se colle, houblonnière en médaillon avec son anneau de texte ;
- Négociants : grand quai de chargement, le rideau métallique se lève avec un à-coup ;
- Fabricants : planche technique sur fond de plan bleu, la photo passe au scanner, repères A, B, C et cartouche ;
- Services : les trois photos des services arrivent de trois côtés et s'assemblent en mosaïque (la chemise de la v3 est retirée) ;
- Devis : sans grande photo, la cuve de la demande et ses quatre étapes, le formulaire arrive tout de suite ;
- À propos : mise en page de magazine, très grand titre, lettrine, photo en colonne, citation ;
- Réglementaire : document officiel, titre tapé à la machine, tampon, photo agrafée ;
- Contact : plan de quartier dessiné, l'épingle tombe sur le cabinet, trajet de l'enveloppe, carte postale ;
- Blog : une de journal « La Gazette BRASSERIEassur », article à la une ;
- Article : titre sur grande photo ; barre de lecture couleur bière (aussi sur les pages longues) ;
- Mentions légales et Confidentialité : sobres, sans grande photo ;
- 404 : la cuve vide en plein écran, une lampe tourne à l'intérieur.

**Photos dans les pages** (nouveau fichier `assets/js/photos.js`) : le développement « du plan à la réalité » ne reste que sur l'accueil ; Brasseries : la photo se remplit comme une cuve ; Producteurs : elle se colle comme une étiquette ; Négociants : un rideau à lamelles se lève ; Fabricants : une ligne de scanner la balaie ; Services, À propos, Blog, Article : fondu discret ; Devis, Contact, Réglementaire et pages légales : aucune animation.

**Une seule fois par visite** : une page déjà vue pendant la visite garde son ouverture dans son état final, et une photo déjà apparue s'affiche directement, sur toutes les pages (mémoire de l'onglet, effacée à la fermeture).

**Corrections** : onglets de la carte des risques sans fondu de couleur (lisibles à tout moment) ; place gardée pour la barre du bas sur téléphone même sans JavaScript.

Fichiers en ?v=4.

## v3 — un site plus vivant

**Effets signature** (nouveau fichier `assets/js/effets.js`) :
- changement de page « la cuve se remplit » : une bière ambrée monte avec sa mousse et ses bulles, puis le niveau redescend sur la nouvelle page (elle remplace le voile bleu nuit) ;
- « du plan à la réalité » : chaque photo se trace d'abord au trait à l'encre, puis se développe en taches, quand elle arrive à l'écran (WebGL ; sans WebGL, simple découverte) ;
- bulles de fermentation et vapeur sur la photo d'ouverture de l'accueil, écartées par la souris ;
- jauge de niveau à droite de l'écran (ordinateur) : un tube de cuve se remplit pendant la lecture, une graduation par section.

**Pages intérieures** :
- pages métiers : le plan suit la lecture (zone de la fiche lue allumée, cachetée, nommée sous le plan) et s'incline en 3D à la souris ; plan d'entrepôt pour Négociants et plan d'atelier pour Fabricants (nouveau fichier `donnees/plans.json`) ;
- Services : trois fiches sortent d'une chemise ; Contact : l'enveloppe s'ouvre ; 404 : une lumière tourne dans la cuve vide ; pages légales : tampon « CLASSÉ » près du titre ;
- les grands titres s'encrent : ils passent de fins à gras en apparaissant.

**Détails vivants** :
- boutons qui se remplissent de bière au survol, liens fléchés soulignés d'une cote rouge, coordonnées près du réticule sur les plans et les photos ;
- accueil : bandeau des métiers qui défile et s'incline avec la vitesse du défilement, chiffres du devis en ligne en rouleaux (3 min, 500 m², 3 M€), flèches et images glissantes dans la galerie des protections ;
- devis : une cuve se remplit à chaque étape ; formulaires : tampon « SIMULÉE » à l'envoi ;
- pied de page : le nom BRASSERIEassur en très grand, qui se remplit de bière en fin de page.

**Corrections** :
- les grands titres ne changent plus de hauteur à la fin de leur apparition (la page ne bouge plus de quelques pixels sous le lecteur) ;
- calendrier de rendez-vous : choisir un jour ne reconstruit plus la grille (le focus reste sur le jour choisi) ;
- effets allégés pour les ordinateurs lents : bulles calculées à mi-résolution, jauge et bandeau sans calcul de mise en page au défilement.

Tout s'arrête en mode « animations réduites » et au retour arrière (la page revient dans son état final). Fichiers en ?v=3.

## v2 — les 35 images

**Images** : les 35 images Grok restantes prennent leur place, et plus aucun emplacement n'affiche « Illustration à venir ».
- Ouvertures de Producteurs, Négociants, Fabricants, Services, Devis, À propos, Réglementaire, Blog, Contact, Mentions légales et Confidentialité (une image commune), et 404 : chacune avec sa version téléphone. Brasseries reçoit aussi sa version téléphone.
- Producteurs : les quatre responsabilités (contrôle qualité, embouteillage, drêches, équipe).
- Brasseries : le stock de palettes ; Négociants : le quai de chargement de nuit.
- Fabricants : la soudure (garanties légales) et la ligne en cours de montage.
- Services : l'audit, la visite de risques et la digitalisation ; À propos : le bureau.
- Chaque image a son point de cadrage, sur ordinateur et sur téléphone ; deux textes alternatifs ajustés à l'image reçue (Blog, Digitalisation).

**Images de partage** : refaites avec la nouvelle photo d'ouverture de chaque page (les pages légales gardent celle de l'accueil) ; le titre ne chevauche plus la ligne ORIAS quand il tient sur trois lignes.

**Retour arrière et avant** : la photo d'ouverture s'affiche dès la première image quand on revient sur une page (elle laissait un cadre vide un instant sur téléphone).

**Version** : fichiers en ?v=2, pour que les navigateurs prennent les nouveaux fichiers.

## v1 — la base

**Pages (15)** : accueil ; quatre pages métiers (Brasseries, Producteurs, Négociants en gros, Fabricants de matériel) ; Services et rendez-vous ; Devis ; À propos ; Réglementaire ; Blog et son article ; Contact ; Mentions légales ; Confidentialité ; page 404 « Cette cuve est vide ». Tous les textes viennent du site actuel, corrigés où il le fallait (liste dans le README).

**Direction artistique « Plan & cachet »** : papier crème quadrillé, encre bleu nuit, rouge cachet, vert houblon ; Fraunces pour les titres, IBM Plex Sans pour le texte, IBM Plex Mono pour les cotes et repères. Logotype provisoire : une capsule à 21 dents et le monogramme « Ba ». Cotes de dessin technique qui nomment ce que montre chaque image, cachet « Couvert » réservé à l'accueil et aux pages métiers, appel de fin de page sur papier quadrillé avec un fût coté, avant le pied de page bleu nuit.

**Mouvement** :
- intro à chaque arrivée : un compas trace la capsule, le nom s'imprime à l'encre, le cachet « Couvert » tombe, puis le calque se retire ;
- voile bleu nuit coté entre les pages, avec le nom de la page d'arrivée ;
- photos d'ouverture révélées à l'encre (WebGL, simple masque sans WebGL) dans un cadre de plan avec cotes et repères ;
- carte des risques épinglée : le plan isométrique d'une brasserie se trace, puis six zones s'allument une à une avec leurs risques et garanties, et reçoivent leur cachet ;
- cinq protections en galerie horizontale épinglée, avec une règle graduée ;
- méthode en six étapes le long d'une tuyauterie qui se remplit, vannes qui tournent ;
- test d'éligibilité au devis en ligne avec un manomètre dont l'aiguille oriente ;
- registre ORIAS dont les cases se cochent avant le tampon ;
- fiches métiers qui sortent du classeur en éventail, fiches cachetées à leur apparition, boutons magnétiques, curseur en réticule (souris seulement).

**Fonctionnalités** : demande de devis en quatre étapes (champs du site actuel, copie du contrat, récapitulatif en direct, orientation vers Orus pour les TPE éligibles) ; demande de rendez-vous avec calendrier (jours passés barrés, jour même repéré, à l'heure de Paris) ; formulaire de contact ; tout est simulé et le dit.

**Images** : 20 images Grok reçues et intégrées ; 35 emplacements gardés à leur nom définitif, avec un dessin au trait « Illustration à venir » en attendant.

**Mise en ligne** : noindex dans chaque page et dans vercel.json, en-têtes de sécurité, image de partage 1200×630 par page, données structurées InsuranceAgency.
