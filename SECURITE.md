# 🔐 Rapport de Sécurité - Projet Versus

## Résumé des mesures de sécurité implémentées

| Sécurité | Status | Fichier(s) concerné(s) |
|----------|--------|------------------------|
| **Argon2** | ✅ Implémenté | `src/auth/auth.service.ts` |
| **Salt** | ✅ Automatique avec Argon2 | `src/auth/auth.service.ts` |
| **Protection XSS** | ✅ Implémenté | Frontend: `SafeText.tsx` |
| **ORM (TypeORM)** | ✅ Implémenté | Tous les fichiers `.entity.ts` |
| **JWT** | ✅ Implémenté | `src/auth/` |
| **Validation DTO** | ✅ Implémenté | `src/auth/dto/` |
| **CORS** | ✅ Configuré | `src/main.ts` |

---

## 1. Argon2 (Hashage de mot de passe)

### Qu'est-ce que c'est ?
Argon2 est l'algorithme de hashage de mot de passe **gagnant de la Password Hashing Competition (2015)**. Il est considéré comme plus sécurisé que bcrypt.

### Configuration utilisée
```typescript
const hashedPassword = await argon2.hash(password, {
  type: argon2.argon2id,  // Variante recommandée
  memoryCost: 65536,      // 64 MB de mémoire
  timeCost: 3,            // 3 itérations
  parallelism: 4,         // 4 threads parallèles
});
```

### Avantages par rapport à bcrypt
- **Résistant aux attaques GPU** : Utilise beaucoup de mémoire
- **Résistant aux attaques side-channel** : Variante `argon2id`
- **Configurable** : Mémoire, temps, parallélisme ajustables

---

## 2. Salt (Sel cryptographique)

### Comment c'est géré ?
Avec Argon2, le salt est **généré automatiquement** et stocké dans le hash.

### Format du hash
```
$argon2id$v=19$m=65536,t=3,p=4$<salt_base64>$<hash_base64>
```

---

## 3. Protection XSS (Cross-Site Scripting)

### Côté Frontend - DOMPurify
```typescript
// src/component/SafeText.tsx
import DOMPurify from "dompurify";

const SafeText = ({ text }) => {
  const safeHtml = DOMPurify.sanitize(text);
  return <span dangerouslySetInnerHTML={{ __html: safeHtml }} />;
};
```

---

## 4. ORM - TypeORM (Protection injection SQL)

### Pourquoi c'est sécurisé ?
- Les paramètres sont **automatiquement échappés**
- Utilisation de requêtes paramétrées

```typescript
// ✅ SÉCURISÉ
const user = await this.userRepo
  .createQueryBuilder('user')
  .where('user.email = :email', { email })
  .getOne();
```

---

## 5. Validation des entrées (class-validator)

```typescript
// src/auth/dto/signup.dto.ts
export class SignupDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;
}
```

---

## 6. Configuration Neon PostgreSQL

### Variables d'environnement (.env)
```env
DB_HOST=ep-soft-star-a4jzon71-pooler.us-east-1.aws.neon.tech
DB_PORT=5432
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_PXaFVqNZ6s5L
DB_NAME=neondb
DB_SSL=true

JWT_SECRET=un_secret_tres_long_et_securise
JWT_EXPIRES_IN=24h
```

---

## Instructions de démarrage

### Backend
```bash
cd backend-main
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend-Anthony
npm install
npm run dev
```

### URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

### Endpoints d'authentification
- `POST /api/auth/signup` - Inscription
- `POST /api/auth/login` - Connexion
