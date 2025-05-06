import { SetMetadata } from '@nestjs/common';

// Clé utilisée par le guard pour lire les métadonnées
export const ROLES_KEY = 'roles';

// Décorateur qui pose les rôles autorisés
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
