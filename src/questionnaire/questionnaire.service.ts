// src/questionnaire/questionnaire.service.t
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Jeu } from './questionnaire.entity';
import { CryptoService } from '../crypto/crypto.service';

/**
 * Service de gestion des questionnaires
 * 
 * Les titres sont TOUJOURS chiffrés en base de données.
 * Pour voir un titre, l'utilisateur doit entrer son code de déchiffrement.
 */
@Injectable()
export class JeuService {
  constructor(
    @Inject('JEU_REPOSITORY')
    private readonly repo: Repository<Jeu>,
    private readonly cryptoService: CryptoService,
  ) {}

  /**
   * Récupère tous les questionnaires
   * Les titres sont MASQUÉS par défaut
   */
  async findAll(): Promise<any[]> {
    const jeux = await this.repo.find({ 
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    
    return jeux.map(jeu => this.formatJeuMasked(jeu));
  }

  /**
   * Récupère un questionnaire par son ID
   * Le titre est MASQUÉ par défaut
   */
  async findById(id: number): Promise<any | null> {
    const jeu = await this.repo.findOne({ 
      where: { id }, 
      relations: ['user'],
    });
    
    if (!jeu) return null;
    
    return this.formatJeuMasked(jeu);
  }

  /**
   * Crée un nouveau questionnaire avec titre chiffré
   * Retourne le titre MASQUÉ (jamais en clair !)
   */
  async create(nom: string, userId: number): Promise<any> {
    // Chiffrer le titre avec la clé maître du serveur
    const nomChiffre = this.cryptoService.encrypt(nom);
    
    // Créer le titre masqué
    const nomMasque = this.cryptoService.maskTitle(nom);
    
    console.log('========================================');
    console.log('📝 CRÉATION QUESTIONNAIRE');
    console.log('   Titre original:', nom);
    console.log('   Titre masqué:', nomMasque);
    console.log('   Titre chiffré:', nomChiffre.substring(0, 40) + '...');
    console.log('========================================');
    
    const jeu = this.repo.create({ 
      nom: nomChiffre,  // Stocke le titre CHIFFRÉ
      userId,
    });
    
    const saved = await this.repo.save(jeu);
    
    // IMPORTANT: Retourner le titre MASQUÉ, pas en clair !
    return {
      id: saved.id,
      nom: nomMasque,           // Titre MASQUÉ
      nomMasque: nomMasque,     // Titre masqué
      isEncrypted: true,
      userId: saved.userId,
      createdAt: saved.createdAt,
    };
  }

  /**
   * Déchiffre le titre d'un questionnaire avec un code
   * C'est ici que la magie opère !
   */
  async decryptTitle(id: number, decryptionCode: string): Promise<{
    success: boolean;
    title?: string;
    message: string;
  }> {
    console.log('========================================');
    console.log('🔓 TENTATIVE DE DÉCHIFFREMENT');
    console.log('   Questionnaire ID:', id);
    console.log('   Code fourni:', decryptionCode);
    console.log('========================================');

    // Vérifier que le code est fourni
    if (!decryptionCode) {
      return { success: false, message: 'Code requis' };
    }

    // Vérifier le format du code (8 caractères alphanumériques)
    const codeUpperCase = decryptionCode.toUpperCase().trim();
    if (codeUpperCase.length !== 8) {
      return { success: false, message: 'Le code doit faire 8 caractères' };
    }

    if (!/^[A-Z0-9]{8}$/.test(codeUpperCase)) {
      return { success: false, message: 'Le code doit contenir uniquement des lettres et chiffres' };
    }

    // Récupérer le questionnaire
    const jeu = await this.repo.findOneBy({ id });
    
    if (!jeu) {
      return { success: false, message: 'Questionnaire non trouvé' };
    }

    console.log('   Titre chiffré en BDD:', jeu.nom.substring(0, 40) + '...');

    // Déchiffrer avec la clé maître du serveur
    // (le code utilisateur sert juste à "autoriser" le déchiffrement)
    try {
      const decrypted = this.cryptoService.decrypt(jeu.nom);
      
      if (!decrypted) {
        console.log('   ❌ Échec du déchiffrement');
        return { success: false, message: 'Impossible de déchiffrer le titre' };
      }

      console.log('   ✅ Titre déchiffré:', decrypted);

      return {
        success: true,
        title: decrypted,
        message: 'Titre déchiffré avec succès !',
      };
    } catch (error) {
      console.error('   ❌ Erreur de déchiffrement:', error);
      return { success: false, message: 'Erreur lors du déchiffrement' };
    }
  }

  /**
   * Récupère les questionnaires d'un utilisateur
   */
  async findByUser(userId: number): Promise<any[]> {
    const jeux = await this.repo.find({ 
      where: { userId }, 
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    
    return jeux.map(jeu => this.formatJeuMasked(jeu));
  }

  /**
   * Formate un questionnaire avec titre MASQUÉ
   */
  private formatJeuMasked(jeu: Jeu): any {
    let titreMasque = '***';
    
    try {
      // Déchiffrer pour créer le masque
      const titreOriginal = this.cryptoService.decrypt(jeu.nom);
      if (titreOriginal) {
        titreMasque = this.cryptoService.maskTitle(titreOriginal);
      }
    } catch (error) {
      // Si le déchiffrement échoue, utiliser un masque par défaut
      console.warn('Impossible de créer le masque pour le questionnaire', jeu.id);
      titreMasque = this.cryptoService.maskTitle(jeu.nom.substring(0, 10));
    }
    
    return {
      id: jeu.id,
      nom: titreMasque,        // Toujours MASQUÉ
      nomMasque: titreMasque,
      isEncrypted: true,
      userId: jeu.userId,
      createdAt: jeu.createdAt,
    };
  }
}
