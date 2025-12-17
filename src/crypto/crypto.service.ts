// src/crypto/crypto.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * Service de chiffrement/déchiffrement AES-256-GCM
 * 
 * CONCEPTS DE SÉCURITÉ :
 * 
 * 1. AES-256-GCM : Algorithme de chiffrement symétrique
 *    - 256 bits = très sécurisé
 *    - GCM = authentifié (détecte les modifications)
 * 
 * 2. SALT : Valeur aléatoire pour que le même texte donne des résultats différents
 * 
 * 3. IV (Initialization Vector) : Garantit l'unicité de chaque chiffrement
 * 
 * 4. PBKDF2 : Dérive une clé de chiffrement à partir d'un mot de passe
 */
@Injectable()
export class CryptoService {
  private readonly masterKey: string;

  constructor(private configService: ConfigService) {
    this.masterKey = this.configService.get<string>('ENCRYPTION_KEY') 
      || 'VersusApp2024SecretEncryptionKey!';
    
    console.log('🔐 CryptoService initialisé');
  }

  /**
   * Génère un code de déchiffrement unique pour un utilisateur
   * Ce code est donné à l'utilisateur lors de la connexion
   */
  generateUserDecryptionCode(userId: number, email: string): string {
    const data = `${userId}-${email}-${this.masterKey}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash.substring(0, 8).toUpperCase();
  }

  /**
   * Dérive une clé de chiffrement à partir de la clé maître
   */
  private deriveKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      this.masterKey,
      salt,
      100000,  // 100,000 itérations
      32,      // 32 bytes = 256 bits
      'sha256'
    );
  }

  /**
   * Chiffre un texte avec AES-256-GCM
   * @returns Format: salt:iv:authTag:encrypted (en base64)
   */
  encrypt(plainText: string): string {
    try {
      // 1. Générer un salt aléatoire
      const salt = crypto.randomBytes(16);
      
      // 2. Dériver la clé
      const key = this.deriveKey(salt);
      
      // 3. Générer un IV aléatoire
      const iv = crypto.randomBytes(12);
      
      // 4. Créer le cipher
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      
      // 5. Chiffrer
      let encrypted = cipher.update(plainText, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // 6. Récupérer le tag d'authentification
      const authTag = cipher.getAuthTag();
      
      // 7. Combiner: salt:iv:authTag:encrypted
      const result = `${salt.toString('base64')}:${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
      
      return result;
    } catch (error) {
      console.error('Erreur lors du chiffrement:', error);
      throw new Error('Échec du chiffrement');
    }
  }

  /**
   * Déchiffre un texte chiffré avec AES-256-GCM
   * @returns Le texte en clair ou null si échec
   */
  decrypt(encryptedText: string): string | null {
    try {
      // Vérifier le format
      if (!encryptedText || typeof encryptedText !== 'string') {
        console.warn('decrypt: texte invalide');
        return null;
      }

      const parts = encryptedText.split(':');
      if (parts.length !== 4) {
        console.warn('decrypt: format invalide, attendu 4 parties, reçu', parts.length);
        return null;
      }

      // Extraire les composants
      const salt = Buffer.from(parts[0], 'base64');
      const iv = Buffer.from(parts[1], 'base64');
      const authTag = Buffer.from(parts[2], 'base64');
      const encrypted = parts[3];

      // Vérifier les tailles
      if (salt.length !== 16 || iv.length !== 12 || authTag.length !== 16) {
        console.warn('decrypt: tailles invalides');
        return null;
      }

      // Dériver la clé
      const key = this.deriveKey(salt);

      // Créer le decipher
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);

      // Déchiffrer
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Erreur lors du déchiffrement:', error);
      return null;
    }
  }

  /**
   * Masque un titre pour affichage
   * "Naruto vs Sasuke" → "Na**************"
   */
  maskTitle(title: string): string {
    if (!title || title.length === 0) {
      return '***';
    }
    
    if (title.length <= 2) {
      return '*'.repeat(title.length + 3);
    }
    
    // Afficher les 2 premiers caractères + étoiles
    const visiblePart = title.substring(0, 2);
    const maskedLength = Math.min(title.length - 2, 20);
    const maskedPart = '*'.repeat(maskedLength);
    
    return visiblePart + maskedPart;
  }
}
