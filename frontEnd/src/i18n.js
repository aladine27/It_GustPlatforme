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
      'Rechercher ici': 'Search here',
      'Nom Complet': 'Full Name',
      'Domaine':     'Domain',
      'Rôle':        'Role',
      'Email':       'Email',
      'Téléphone': 'Phone',
      'Adresse': 'Address',
      'Modifier Profil': 'Edit Profile',
      'Modifier mot de passe': 'Change Password',
      'Informations Personnelles': 'Personal Information',
      'Non renseigné': 'Not filled',
      'Informations Personnelles':'Personal Information',





      
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
      'Tout les Projets':'Tout les Projets',
      'Nom Complet': 'Nom Complet',
      'Domaine':'Domaine',
      'Rôle':'Rôle',
      'Email':'Email',
      'Modifier Profil': 'Modifier Profil',
      'Modifier mot de passe': 'Modifier mot de passe',
      'Non renseigné': 'Non renseigné',
      'Email': 'Email',
      'Téléphone': 'Téléphone',
      'Adresse': 'Adresse',
      'Informations Personnelles':'Informations Personnelles',
      
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
