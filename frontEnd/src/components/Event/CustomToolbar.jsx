import React, { useEffect } from 'react';
import { Box, Typography, Button, ButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/fr';

export default function CustomToolbar(props) {
  const { t, i18n } = useTranslation();

  // Synchronise la locale de moment
  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  // Format la date en fonction de la langue
  const today = moment().locale(i18n.language).format('dddd DD MMMM YYYY');

  // Labels traduits pour les vues
  const viewLabels = {
    month: t('month'),
    week: t('week'),
    day: t('day'),
    agenda: t('agenda'),
  };

  return (
    <Box
      className="rbc-toolbar"
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        background: '#f6fbff',
        borderRadius: '16px 16px 0 0',
        padding: '0.7rem 1.5rem',
        mb: 1,
      }}
    >
      {/* Navigation gauche */}
      <ButtonGroup>
        <Button onClick={() => props.onNavigate('TODAY')} variant="outlined" size="small">
          {t('today')}
        </Button>
        <Button onClick={() => props.onNavigate('PREV')} variant="outlined" size="small">
          {t('previous')}
        </Button>
        <Button onClick={() => props.onNavigate('NEXT')} variant="outlined" size="small">
          {t('next')}
        </Button>
      </ButtonGroup>

      {/* Centre : label + date */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography className="rbc-toolbar-label" sx={{ fontWeight: 700, fontSize: 21, color: "#1976d2" }}>
          {moment(props.date).locale(i18n.language).format('MMMM YYYY')}
        </Typography>
        <Typography sx={{
          fontSize: '0.98rem',
          color: '#1976d2',
          fontWeight: 500,
          mt: 0.3,
          letterSpacing: 0.2,
        }}>
          <span role="img" aria-label="calendar" style={{ fontSize: 18 }}>📅</span>
          {` ${t('today')} : ${today}`}
        </Typography>
      </Box>

      {/* Droite : vue */}
      <ButtonGroup>
        {props.views.map((view) => (
          <Button
            key={view}
            variant={props.view === view ? "contained" : "outlined"}
            size="small"
            onClick={() => props.onView(view)}
            sx={{ fontWeight: props.view === view ? 700 : 400 }}
          >
            {viewLabels[view] || view}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}
