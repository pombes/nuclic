# NUCLIC - Nuclear innovation consultancy website

Een moderne, responsieve website voor NUCLIC - Nuclear innovation consultancy.

## Features

- One-page design met vloeiende scroll-effecten
- Volledig responsief (mobiel, tablet, desktop)
- Moderne UI met animaties en interacties
- Aangepast NUCLIC logo met animaties
- Contactformulier met validatie (verbonden met TransIP e-mail)
- Preloader animatie
- Publicatiepagina met gestructureerde weergave van wetenschappelijke publicaties

## Technologieën

- HTML5
- CSS3 (Variabelen, Flexbox, Grid, Animaties)
- Vanilla JavaScript (geen frameworks)
- SVG voor grafische elementen
- PHP voor contactformulier verwerking (met PHPMailer)

## Structuur

- **index.html** - De complete website structuur
- **publications.html** - Overzicht van publicaties
- **styles.css** - Alle styling voor desktop en mobiel
- **script.js** - JavaScript voor interacties en animaties
- **mail-handler.php** - Verwerkt het contactformulier
- **email-config.php** - Configuratie voor e-mail instellingen
- **PHPMailer/** - Bibliotheek voor e-mail verwerking
- **image/** - Afbeeldingen en logo's

## Eenvoudige aanpassingen maken

### Tekst aanpassen

1. **Content in index.html wijzigen**:
   - Open `index.html` in een tekstbewerker (VS Code, Notepad++, etc.)
   - Zoek de sectie die je wilt aanpassen (bijv. expertise, services, etc.)
   - Wijzig de tekst binnen de `<p>`, `<h2>`, of andere HTML-tags

   Voorbeeld:
   ```html
   <h2 class="section-title">Expertise & Interests</h2>
   <p class="subtitle">Hier kun je de nieuwe tekst plaatsen</p>
   ```

2. **Navigatie items aanpassen**:
   - Navigatie-items bevinden zich in de `<header>` sectie
   - Wijzig de link tekst binnen de `<a>` tags

3. **Contactgegevens bijwerken**:
   - Zoek naar de contact-sectie in `index.html`
   - Wijzig e-mail, adres of andere gegevens in de betreffende elementen

### Stijl aanpassen

1. **Kleuren wijzigen**:
   - Open `styles.css`
   - Zoek naar de `:root` sectie bovenaan het bestand
   - Pas de kleuren aan in de CSS variabelen

   ```css
   :root {
       --primary-color: #0a1129;
       --secondary-color: #1a2b5a;
       --accent-color: #ff0000;
   }
   ```

2. **Lettertypen aanpassen**:
   - Zoek naar `font-family` in CSS regels
   - Pas deze aan naar wens (zorg dat het lettertype beschikbaar is of via Google Fonts is gekoppeld)

## Contactformulier configureren

Het contactformulier is geconfigureerd om e-mails te versturen via TransIP mail.

1. **Wachtwoord instellen**:
   - Open `email-config.php` in een tekstbewerker
   - Zoek naar de regel met `'password' => 'VUL_HIER_UW_WACHTWOORD_IN'`
   - Vervang dit door het actuele TransIP e-mailwachtwoord
   - Sla het bestand op

2. **E-mailadres wijzigen** (indien nodig):
   - In hetzelfde bestand kun je het e-mailadres wijzigen bij `'email' => 'contact@nuclic.nl'`
   - Ontvangers kunnen worden aangepast bij `'recipients' => 'contact@nuclic.nl'`

Bekijk het bestand `CONTACTFORMULIER_HANDLEIDING.txt` voor meer gedetailleerde instructies.

## Nieuwe content toevoegen

### Nieuwe service toevoegen

1. Zoek de services-sectie in `index.html`:
   ```html
   <div class="services-grid">
      <!-- Hier staan bestaande services -->
   </div>
   ```

2. Voeg een nieuw service-item toe volgens dit patroon:
   ```html
   <div class="service-item">
       <div class="service-icon">
           <svg width="40" height="40" viewBox="0 0 24 24">
               <path fill="currentColor" d="M... SVG pad data ..." />
           </svg>
       </div>
       <h3>Nieuwe Service Titel</h3>
       <p>Beschrijving van de nieuwe service.</p>
   </div>
   ```

### Nieuwe projecten toevoegen

1. Zoek de timeline-sectie in `index.html`
2. Voeg een nieuw timeline-item toe volgens dit patroon:
   ```html
   <div class="timeline-item">
       <div class="timeline-marker"></div>
       <div class="timeline-content">
           <div class="timeline-date">Periode</div>
           <h3>Project Titel</h3>
           <p>Project beschrijving</p>
       </div>
   </div>
   ```

## Publicaties toevoegen

1. Open `publications.html` in een tekstbewerker
2. Zoek het relevante jaar (of voeg een nieuw jaar-sectie toe)
3. Voeg een nieuw item toe in dit formaat:
   ```html
   <div class="publication-entry">
       <h3>Publicatie titel</h3>
       <p class="meta">Auteurs</p>
       <p>Publicatie details, jaar, uitgever, etc.</p>
   </div>
   ```

## Nette URLs
De website maakt gebruik van URL rewriting om nette URLs te bieden:

- `/home` → Homepage
- `/expertise` → Expertise sectie
- `/services` → Services sectie
- `/projects` → Projects sectie
- `/about` → About sectie 
- `/contact` → Contact sectie
- `/publications` → Publications pagina

Deze functionaliteit vereist een Apache webserver met mod_rewrite ingeschakeld. De benodigde .htaccess configuratie is al opgenomen in het project.

> **Opmerking voor ontwikkelaars**: Tijdens lokale ontwikkeling zonder webserver blijven alle originele links (zoals index.html#expertise) gewoon werken.

## Credits

Ontworpen en ontwikkeld voor NUCLIC, 2025 