<img src="/design/banner.png">

Une suite pour gerer votre historique Gallica.

### Fonctionnement

Il y a 3 modules principaux:

- Extension Chrome:
  - Chaque fois que vous ouvrez un livre, tourner une page, l'extension envoie l'etat de votre lecture.
- Serveur:
  - Le serveur se charge de recolter les informations envoyees par l'extension.
  - Il les traite et les accumule localement dans un fichier unique representant votre historique.
- Interface:
  - Une interface vous permet de consulter, trier, rechercher votre historique complet.

## Installation

Avant tout chose vous devez installer les dependances, et deployer le serveur.

- Cloner ce projet sur votre bureau.
- Mettez vous a la racine
- Executez `npm i`

Vous devez absolument lancer le serveur pour commencer a collecter les informations de navigation, avec la commande suivante:

```
npm run start --watch
```

Cette commande a aussi pour effet de construire et demarrer l'interface de consultation en arriere plan.  
L'interface est consultable a l'addresse suivante: <a href="http://localhost:44539/" target="_blank">http://localhost:44539/</a>

(tip: Chaque fois que votre PC redemarre, vous devez relancer la meme commande, mais vous pouvez utiliser un service comme pm2, par exemple `pm2 start "npm run start --watch" --name "gallica-historique"` puis `pm2 save` pour sauvegarder les processus. Au boot lancez `pm2 resurrect` pour recuperer vos processus, bien sur `pm2 resurrect` doit etre placer dans un fichier de config de demarrage.)

## Extension Chrome

Vous devez charger l'extension dans Chrome. La racine de l'extension est `./chrome-extension/` (et non la racine du repo lui-meme.)

## Screenshot

<img width="640" alt="image" src="https://github.com/user-attachments/assets/2049efdf-e07c-47d8-b033-5e2c9ee611e7" />

