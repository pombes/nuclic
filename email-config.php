<?php
// NUCLIC Email Configuratie voor Contactformulier
// ----------------------------------------------
// Dit bestand bevat de instellingen voor het contactformulier.
// Bij een wachtwoordwijziging hoeft u alleen de waarde bij 'password' aan te passen.

return [
    // Het e-mailadres dat u bij TransIP heeft aangemaakt (niet wijzigen)
    'email' => 'contact@nuclic.nl',
    
    // Het wachtwoord van dit e-mailadres (wijzig dit wanneer u uw wachtwoord verandert)
    'password' => 'VUL_HIER_UW_WACHTWOORD_IN',
    
    // Ontvangers van de contactformulier e-mails (u kunt meerdere e-mailadressen scheiden met komma's)
    'recipients' => 'contact@nuclic.nl',

    // Onderwerp prefix voor de e-mail (niet wijzigen)
    'subject_prefix' => 'NUCLIC Contact Form: ',
    
    // SMTP-instellingen voor TransIP (niet wijzigen)
    'smtp_host' => 'smtp.transip.email',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl',
    'smtp_auth' => true
]; 