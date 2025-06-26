<?php return [
  'internal_traffic_statistics' => [
    'label' => 'Statistiques de trafic interne',
    'permission_description' => 'Purger les données des Statistiques de trafic interne',
    'permission_label' => 'Gérer les paramètres des Statistiques de trafic interne',
    'hint' => 'La fonctionnalité Statistiques de trafic interne enregistre les pages vues, les adresses IP et autres données utilisateur anonymes de base dans la base de données.',
    'disabled' => 'Les Statistiques de trafic interne sont désactivées. Pour les activer, modifiez la configuration dans config/cms.php.',
    'enabled' => 'Les Statistiques de trafic interne sont actuellement activées. Vous pouvez ajuster la période de rétention et le fuseau horaire, ou désactiver cette fonctionnalité, en modifiant les paramètres dans config/cms.php.',
    'purging' => 'Purge des données en cours...',
    'purge_button' => 'Purger les Données',
    'purge_data_confirm' => 'Voulez-vous vraiment purger les données des Statistiques de trafic interne ?',
    'retention' => 'Période de rétention des données',
    'timezone' => 'Fuseau horaire',
    'retention_mon' => ':retention mois',
    'retention_indefinite' => 'Indéfinie',
    'purge_success' => 'Données des Statistiques de trafic interne purgées',
  ],
];
