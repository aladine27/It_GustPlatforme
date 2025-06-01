import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Rechercher:            'Search',
      Ajouter:               'Add',
      Export:                'Export',
      Import:                'Import',
      'Ajouter un Employé':  'Add Employee',
      Supprimer:             'Delete',
      Annuler:               'Cancel',
      'Gestion des Comptes Utilisateurs': 'User Management',
      Valider: 'Submit',
      'Créer utilisateur': 'Create User',
      'Evenement':'Event',
      'Projet':'Project',
      'Tache':'Task',
      'Document':'Document',
      'Congé':'Leave',
      'Recrutement':'Recruitment',
      'Frais':'Wallet',
      'Profile':'Profil',
      'Tout les Projets':'All Projects',
      'Rechercher ici': 'Search here'




      
    }
  },
  fr: {
    translation: {
      Rechercher:            'Rechercher',
      Ajouter:               'Ajouter',
      Export:                'Exporter',
      Import:                'Importer',
      'Ajouter un Employé':  'Ajouter un Employé',
      Supprimer:             'Supprimer',
      Annuler:               'Annuler',
      'Gestion des Comptes Utilisateurs': 'Gestion des Comptes Utilisateurs' ,
      'Créer  utilisateur': 'Créer utilisateur',
      Valider: 'Valider',
      'Rechercher ici': 'Rechercher ici',
      'Evenement':'Evenement',
      'Projet':'Projet',
      'Tache':'Tache',
      'Document':'Document',
      'Congé':'Congé',
      'Recrutement':'Recrutement',
      'Frais':'Frais',
      'Profile':'Profile',
      'Tout les Projets':'Tout les Projets'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: true,
    interpolation: { escapeValue: false }
  });

export default i18n;
