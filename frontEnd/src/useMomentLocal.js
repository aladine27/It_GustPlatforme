import { useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
 // ou 'en' selon le build

export default function useMomentLocale(i18n) {
  useEffect(() => {
    // Change la langue de moment dès que i18next change
    const lang = i18n.language.startsWith('fr') ? 'fr' : 'en'
    moment.locale(lang);
  }, [i18n.language]);
}
