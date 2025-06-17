import { useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/en-gb'; // ou 'en' selon le build

export default function useMomentLocale(i18n) {
  useEffect(() => {
    // Change la langue de moment dès que i18next change
    moment.locale(i18n.language === 'fr' ? 'fr' : 'en-gb');
  }, [i18n.language]);
}
