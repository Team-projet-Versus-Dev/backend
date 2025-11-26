# API Jikan intégrée (NestJS)

Cette API permet d'accéder aux données d'anime via l'API Jikan, exposée par le backend NestJS.

## Démarrer le serveur

Ouvre un terminal dans le dossier `backend` et lance :

```bat
npm run start:dev
```

Le serveur démarre sur `http://localhost:3000` (par défaut).

## Endpoints disponibles

### 1. Rechercher des animes

**URL :**
```
GET /jikan/search?q=<mot-clé>
```

**Exemple :**
```
GET http://localhost:3000/jikan/search?q=naruto
```

**Réponse :**
```json
{
  "pagination": { ... },
  "data": [
    {
      "mal_id": 20,
      "title": "Naruto",
      "synopsis": "...",
      ...
    },
    ...
  ]
}
```

### 2. Obtenir un anime par son ID

**URL :**
```
GET /jikan/:id
```

**Exemple :**
```
GET http://localhost:3000/jikan/20
```

**Réponse :**
```json
{
  "data": {
    "mal_id": 20,
    "title": "Naruto",
    "synopsis": "...",
    ...
  }
}
```

## Tester avec curl

```bat
curl "http://localhost:3000/jikan/search?q=naruto"
curl "http://localhost:3000/jikan/20"
```

## Notes
- Les données sont issues de l'API publique Jikan (https://jikan.moe/).
- Pour plus d'exemples, voir la documentation officielle Jikan.
