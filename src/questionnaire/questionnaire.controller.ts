// src/questionnaire/questionnaire.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  ParseIntPipe, 
  UseGuards, 
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JeuService } from './questionnaire.service';
import { JwtGuard } from '../auth/jwt.guard';

/**
 * Contrôleur des questionnaires
 * 
 * ENDPOINTS :
 * - GET  /api/jeu           : Liste (titres masqués)
 * - GET  /api/jeu/:id       : Détail (titre masqué)
 * - POST /api/jeu           : Créer (authentifié)
 * - POST /api/jeu/:id/decrypt : Déchiffrer le titre avec un code
 */
@Controller('jeu')
export class JeuController {
  constructor(private readonly jeuService: JeuService) {}

  /**
   * GET /api/jeu
   * Liste tous les questionnaires (titres masqués)
   */
  @Get()
  async findAll(): Promise<any[]> {
    return this.jeuService.findAll();
  }

  /**
   * GET /api/jeu/:id
   * Récupère un questionnaire (titre masqué)
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const jeu = await this.jeuService.findById(id);
    if (!jeu) {
      throw new HttpException('Questionnaire non trouvé', HttpStatus.NOT_FOUND);
    }
    return jeu;
  }

  /**
   * POST /api/jeu
   * Créer un questionnaire (titre chiffré automatiquement)
   */
  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body('nom') nom: string, 
    @Request() req: any,
  ): Promise<any> {
    if (!nom || nom.trim().length === 0) {
      throw new HttpException('Le titre est requis', HttpStatus.BAD_REQUEST);
    }
    
    const userId = req.user.userId;
    return this.jeuService.create(nom.trim(), userId);
  }

  /**
   * POST /api/jeu/:id/decrypt
   * Déchiffre le titre avec un code
   * 
   * Body: { "code": "ABC12345" }
   */
  @Post(':id/decrypt')
  async decryptTitle(
    @Param('id', ParseIntPipe) id: number,
    @Body('code') code: string,
  ): Promise<{ success: boolean; title?: string; message: string }> {
    
    if (!code) {
      return {
        success: false,
        message: 'Le code est requis',
      };
    }

    try {
      const result = await this.jeuService.decryptTitle(id, code);
      return result;
    } catch (error) {
      console.error('Erreur dans decryptTitle:', error);
      return {
        success: false,
        message: 'Erreur serveur lors du déchiffrement',
      };
    }
  }

  /**
   * GET /api/jeu/utilisateur/:userId
   * Questionnaires d'un utilisateur
   */
  @Get('utilisateur/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<any[]> {
    return this.jeuService.findByUser(userId);
  }
}
