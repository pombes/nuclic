<?php
// NUCLIC Contact Form Handler
// --------------------------
// Dit script verwerkt het contactformulier en stuurt de e-mail via TransIP

// Controleer of het formulier is verzonden
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.html");
    exit;
}

// Formuliergegevens ophalen en beveiligen
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

// Server-side validatie
if (empty($name) || empty($email) || empty($subject) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: index.html?status=error&message=validation");
    exit;
}

// Laad het configuratiebestand
$config = require 'email-config.php';

// Controleer of het wachtwoord is ingesteld
if ($config['password'] === 'VUL_HIER_UW_WACHTWOORD_IN') {
    error_log("NUCLIC Contact Form Error: E-mail wachtwoord is niet geconfigureerd in email-config.php");
    header("Location: index.html?status=error&message=configuration");
    exit;
}

// Als PHPMailer nog niet is geïnstalleerd, stuur gebruiker naar index met foutmelding
if (!file_exists('PHPMailer/src/PHPMailer.php')) {
    error_log("NUCLIC Contact Form Error: PHPMailer niet gevonden");
    header("Location: index.html?status=error&message=phpmailer");
    exit;
}

// Laad PHPMailer
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    // Maak een nieuwe PHPMailer instantie
    $mail = new PHPMailer(true);

    // Server instellingen
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = $config['smtp_auth'];
    $mail->Username = $config['email'];
    $mail->Password = $config['password'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];
    $mail->CharSet = 'UTF-8';

    // Ontvangers
    $mail->setFrom($config['email'], 'NUCLIC Website');
    
    // Voeg ontvangers toe (kunnen meerdere zijn)
    $recipients = explode(',', $config['recipients']);
    foreach ($recipients as $recipient) {
        $mail->addAddress(trim($recipient));
    }
    
    // Voeg reply-to toe (e-mail van de afzender)
    $mail->addReplyTo($email, $name);

    // E-mail inhoud
    $mail->isHTML(true);
    $mail->Subject = $config['subject_prefix'] . $subject;
    
    // HTML bericht
    $mail->Body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h2 { color: #0a1129; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; display: block; margin-bottom: 5px; color: #555; }
            .message { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0a1129; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>Nieuw bericht van NUCLIC contactformulier</h2>
            <div class='field'>
                <span class='label'>Naam:</span>
                " . htmlspecialchars($name) . "
            </div>
            <div class='field'>
                <span class='label'>E-mail:</span>
                <a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a>
            </div>
            <div class='field'>
                <span class='label'>Onderwerp:</span>
                " . htmlspecialchars($subject) . "
            </div>
            <div class='field'>
                <span class='label'>Bericht:</span>
                <div class='message'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Plain text versie voor e-mailclients die geen HTML ondersteunen
    $mail->AltBody = "Nieuw bericht van NUCLIC contactformulier\n\n" .
                    "Naam: " . $name . "\n" .
                    "E-mail: " . $email . "\n" .
                    "Onderwerp: " . $subject . "\n\n" .
                    "Bericht:\n" . $message;

    // Verstuur de e-mail
    $mail->send();
    
    // Stuur gebruiker terug naar homepage met succesmelding
    header("Location: index.html?status=success");
    exit;
    
} catch (Exception $e) {
    // Log de fout
    error_log("NUCLIC Contact Form Error: " . $mail->ErrorInfo);
    
    // Stuur gebruiker terug naar homepage met foutmelding
    header("Location: index.html?status=error&message=sending");
    exit;
} 