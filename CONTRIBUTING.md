# Guide de Contribution

Merci de votre intérêt pour contribuer à `nuxt-calendar-module` ! 🗓️

## Configuration de l'environnement de développement

1. **Cloner le repository**
```bash
git clone https://github.com/yourusername/nuxt-module-calendar.git
cd nuxt-module-calendar
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Préparer l'environnement de développement**
```bash
npm run dev:prepare
```

4. **Lancer le playground**
```bash
npm run dev
```

## Structure du projet

```
src/
├── module.ts                 # Configuration principale du module
├── runtime/
│   ├── components/          # Composants Vue auto-importés
│   │   └── Calendar.vue     # Composant principal
│   ├── composables/         # Composables auto-importés
│   │   ├── useCalendar.ts
│   │   └── useReservationCalendar.ts
│   ├── types/               # Types TypeScript
│   │   └── index.ts
│   └── assets/              # Styles CSS
│       └── calendar.css
playground/                  # Application de test
├── app.vue
├── nuxt.config.ts
└── package.json
```

## Développement

### Commandes disponibles

- `npm run dev` - Lance le playground en mode développement
- `npm run build` - Construit le module
- `npm run test` - Exécute les tests
- `npm run lint` - Vérifie le code avec ESLint
- `npm run dev:prepare` - Prépare les types et génère les fichiers

### Tests

Nous utilisons Vitest pour les tests. Les tests sont dans le dossier `test/`.

```bash
# Exécuter tous les tests
npm run test

# Exécuter les tests en mode watch
npm run test:watch

# Tester les types TypeScript
npm run test:types
```

## Guidelines de contribution

### 1. Types de contributions

- 🐛 **Bug fixes** - Corrections de bugs
- ✨ **Nouvelles fonctionnalités** - Ajout de nouvelles fonctionnalités
- 📝 **Documentation** - Amélioration de la documentation
- 🎨 **Styles** - Améliorations visuelles
- ⚡ **Performance** - Optimisations de performance
- 🔧 **Configuration** - Amélioration de la configuration

### 2. Workflow

1. **Fork** le repository
2. **Créer une branche** pour votre fonctionnalité ou correction
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
3. **Faire vos changements** en suivant nos standards
4. **Tester** vos changements
   ```bash
   npm run test
   npm run lint
   ```
5. **Commit** vos changements avec des messages clairs
   ```bash
   git commit -m "feat: ajouter support pour vue mois"
   ```
6. **Push** vers votre fork
7. **Créer une Pull Request**

### 3. Standards de code

#### TypeScript
- Utiliser TypeScript strict
- Définir des interfaces pour toutes les props et émissions
- Documenter les types publics

#### Vue/Nuxt
- Utiliser la Composition API
- Préférer `<script setup>` 
- Utiliser les composables Nuxt appropriés
- Optimiser avec `readonly()` pour les états partagés

#### CSS
- Utiliser CSS Variables pour les thèmes
- Supporter les modes dark/light
- Responsive design mobile-first
- Préfixes de classe cohérents

#### Messages de commit
Utiliser le format [Conventional Commits](https://conventionalcommits.org/) :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, point-virgules manquants, etc.
- `refactor:` refactoring du code
- `test:` ajout ou modification de tests
- `chore:` maintenance

### 4. Pull Requests

#### Template de PR
```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests dans le playground
- [ ] Tests TypeScript passent

## Checklist
- [ ] Le code suit les standards du projet
- [ ] Auto-review effectué
- [ ] Documentation mise à jour si nécessaire
- [ ] Changements testés dans différents navigateurs
```

#### Critères d'acceptation
- ✅ Tests passent
- ✅ Code lint sans erreurs
- ✅ TypeScript compile sans erreurs
- ✅ Documentation à jour
- ✅ Playground fonctionne
- ✅ Pas de breaking changes non documentés

## Développement de nouvelles fonctionnalités

### Ajouter un nouveau composant

1. Créer le composant dans `src/runtime/components/`
2. Définir les types dans `src/runtime/types/`
3. Ajouter les styles si nécessaire
4. Tester dans le playground
5. Documenter dans le README

### Ajouter un nouveau composable

1. Créer le composable dans `src/runtime/composables/`
2. Exporter les types nécessaires
3. Ajouter des tests unitaires
4. Documenter l'utilisation

## Questions et Support

- 💬 **Discussions** - Pour les questions générales et idées
- 🐛 **Issues** - Pour reporter des bugs
- 📧 **Email** - Pour les questions privées

## Code de conduite

Ce projet adhère au [Code de Conduite Contributor Covenant](https://www.contributor-covenant.org/). En participant, vous acceptez de respecter ce code.

## Licence

En contribuant à ce projet, vous acceptez que vos contributions soient sous licence MIT.