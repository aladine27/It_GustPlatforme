import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { IApplicationAnalysis } from './interfaces/applicationAnalysis.interface';

const FLASK_URL = 'http://localhost:5000/match_skills';

type FlaskItem = {
  filename: string;
  email?: string;
  score?: number;
  skills_matched?: string[];
};

@Injectable()
export class ApplicationAnalysisService {
  constructor(
    @InjectModel('applicationAnalyses')
    private readonly analysisModel: Model<IApplicationAnalysis>,
  ) {}

  /** Map DB -> format front (compatible Flask) */
  private toFront(doc: any): FlaskItem {
    return {
      filename: doc.filename,
      email: doc.email || '-',
      score: Number.isFinite(doc.scoreIA) ? doc.scoreIA : 0,
      skills_matched: Array.isArray(doc.skills) ? doc.skills : [],
    };
  }

  /** Normalise un nom pour tolérer différentes variantes (préfixe timestamp, accents, espaces). */
  private normalizeName(s: string = ''): string {
    return String(s)
      .toLowerCase()
      // retire 1+ préfixes timestamp "1755157070621-" ou "1755157070621_"
      .replace(/^(\d{10,}[-_])+/g, '')
      // normalise accents
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      // retire les espaces
      .replace(/\s+/g, '');
  }

  /** Renvoie tout le cache d'une offre au format front */
  async listForFront(offerId: string): Promise<FlaskItem[]> {
    const all = await this.analysisModel
      .find({ jobOffre: new Types.ObjectId(offerId) })
      .sort({ scoreIA: -1, createdAt: -1 })
      .lean();

    return all.map((d) => this.toFront(d));
  }

  /** Lance l'analyse pour le delta, stocke uniquement les fichiers autorisés, puis renvoie le cache */
  async runAndCacheDelta(
    offerId: string,
    body: { requirements: string; allowed_filenames: string[] }
  ): Promise<FlaskItem[]> {
    const jobOffre = new Types.ObjectId(offerId);

    // Liste autorisée provenant du front (fichiers de l’offre courante)
    const allowed = Array.isArray(body?.allowed_filenames) ? body.allowed_filenames : [];
    if (allowed.length === 0) {
      // rien à traiter → retourner juste le cache
      return this.listForFront(offerId);
    }

    // Ensembles pour filtrage strict + tolérant
    const allowedSet = new Set(allowed);
    const allowedNormSet = new Set(allowed.map((f) => this.normalizeName(f)));

    // A) Retirer ceux déjà en base pour CETTE offre (uniquement parmi les autorisés)
    const existing = await this.analysisModel
      .find({ jobOffre, filename: { $in: allowed } }, { filename: 1 })
      .lean();

    const done = new Set(existing.map((e) => e.filename));
    const toAnalyze = allowed.filter((f) => !done.has(f));

    // B) Si rien de neuf → renvoyer le cache
    if (toAnalyze.length === 0) {
      return this.listForFront(offerId);
    }

    // C) Appel Flask UNIQUEMENT pour le delta
    const { data } = await axios.post(FLASK_URL, {
      requirements: body?.requirements || '',
      allowed_filenames: toAnalyze,
    });

    const resultsRaw: FlaskItem[] = Array.isArray(data) ? data : [];

    // D) FILTRAGE CÔTÉ BACKEND : garder seulement ce qui appartient à "allowed_filenames"
    //    – correspondance stricte OU normalisée (si Flask renvoie sans préfixe par ex.)
    const resultsFiltered = resultsRaw.filter((r) => {
      if (!r || typeof r.filename !== 'string') return false;
      if (allowedSet.has(r.filename)) return true;
      const rn = this.normalizeName(r.filename);
      return allowedNormSet.has(rn);
    });

    if (resultsFiltered.length === 0) {
      // Rien d'autorisé → renvoie simplement le cache existant
      return this.listForFront(offerId);
    }

    // E) Upsert en masse (UNIQUEMENT les fichiers autorisés)
    const ops = resultsFiltered.map((r) => {
      const score = Number.isFinite(r.score as number) ? Math.round(r.score as number) : 0;
      const skills = Array.isArray(r.skills_matched) ? r.skills_matched : [];

      // Si Flask renvoie un nom "simplifié", on le remappe vers le vrai filename autorisé
      let storedName = r.filename;
      if (!allowedSet.has(storedName)) {
        const rn = this.normalizeName(storedName);
        const match = allowed.find((a) => this.normalizeName(a) === rn);
        if (match) storedName = match;
      }

      return {
        updateOne: {
          filter: { jobOffre, filename: storedName },
          update: {
            $setOnInsert: { jobOffre, filename: storedName },
            $set: { email: r.email || '-', scoreIA: score, skills },
          },
          upsert: true,
        },
      };
    });

    if (ops.length) {
      await this.analysisModel.bulkWrite(ops);
    }

    // F) Retourner le cache complet (anciens + nouveaux) au format front
    return this.listForFront(offerId);
  }
}
