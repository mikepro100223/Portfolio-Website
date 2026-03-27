# Portfolio Website mit CMS

Ein modernes Portfolio mit integriertem Content Management System (CMS), JWT-Authentifizierung und File-Upload.

## 🚀 Features

- **Modernes Design**: Glassmorphism, Particle-Animationen, Dark Mode
- **CMS-System**: Projekte, Skills und Content direkt bearbeiten
- **JWT-Authentifizierung**: Sicherer Admin-Bereich
- **File-Upload**: Bilder für Projekte hochladen
- **Mehrsprachig**: Deutsch/English Support
- **Responsive**: Funktioniert auf allen Geräten

## 📋 Installation

### 1. Dependencies installieren

```bash
npm install
```

### 2. Environment-Variablen anpassen

Bearbeiten Sie `.env` und ändern Sie die Werte:

```env
JWT_SECRET=ihr_geheimer_schlüssel_hier  # WICHTIG: Ändern Sie dies!
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=IhrSicheresPasswort123  # WICHTIG: Ändern Sie dies!
```

### 3. Server starten

```bash
npm start
```

oder für Development mit Auto-Reload:

```bash
npm run dev
```

## 🎯 Verwendung

### Website besuchen
- Öffnen Sie: `http://localhost:3000/index.html`
- Ihre Portfolio-Website

### Admin-Login
- Öffnen Sie: `http://localhost:3000/admin-login.html`
- Standard-Login: `admin` / `admin123` (ändern Sie dies in `.env`!)

### Admin-Dashboard

Nach dem Login können Sie:

#### 📁 Projekte verwalten
- Neue Projekte hinzufügen
- Titel, Beschreibung (DE/EN)
- Technologien, Features
- YouTube Videos einbinden
- Bilder hochladen
- GitHub & Live-Demo Links
- Projekte bearbeiten/löschen

#### 💻 Skills bearbeiten
- Frontend, Backend, Tools Skills
- Name und Level für jeden Skill
- Skills hinzufügen/entfernen

#### 👤 Über mich bearbeiten
- Haupttext und Highlight-Text
- Zweisprachig (DE/EN)

#### 📊 Statistiken anpassen
- Anzahl Projekte
- Anzahl Technologien
- Anzahl Commits

## 📂 Dateistruktur

```
Portfolio/
├── index.html              # Hauptwebsite
├── style.css               # Website-Styling
├── script.js               # Website-Logik
├── admin-login.html        # Login-Seite
├── admin-login.js          # Login-Logik
├── admin-dashboard.html    # CMS Dashboard
├── admin-dashboard.js      # Dashboard-Logik
├── admin.css               # Admin-Styling
├── server.js               # Backend-Server
├── package.json            # Dependencies
├── .env                    # Environment-Variablen
├── content-data.json       # Content-Datenbank (wird automatisch erstellt)
└── uploads/                # Hochgeladene Dateien (wird automatisch erstellt)
```

## 🔒 Sicherheit

### WICHTIG für Production:

1. **JWT Secret ändern**: 
   - Generieren Sie einen starken, zufälligen String für `JWT_SECRET`
   
2. **Admin-Passwort ändern**:
   - Setzen Sie ein sicheres Passwort in `.env`
   
3. **HTTPS verwenden**:
   - Verwenden Sie HTTPS in Production
   
4. **CORS konfigurieren**:
   - Passen Sie CORS-Einstellungen in `server.js` an
   
5. **Rate Limiting**:
   - Fügen Sie Rate Limiting für Login-Versuche hinzu

## 🌐 API Endpoints

### Öffentlich
- `GET /api/content` - Alle Content-Daten
- `GET /api/projects` - Alle Projekte
- `GET /api/skills` - Alle Skills
- `GET /api/about` - Über mich
- `GET /api/stats` - Statistiken

### Authentifiziert (Bearer Token erforderlich)
- `POST /api/login` - Login (liefert Token)
- `GET /api/verify` - Token verifizieren
- `POST /api/projects` - Projekt erstellen/aktualisieren
- `DELETE /api/projects/:id` - Projekt löschen
- `POST /api/skills` - Skills aktualisieren
- `POST /api/about` - Über mich aktualisieren
- `POST /api/stats` - Statistiken aktualisieren
- `POST /api/upload` - Datei hochladen

## 🛠️ Development

### Dependencies
- **express** - Web-Server
- **jsonwebtoken** - JWT-Authentifizierung
- **bcryptjs** - Passwort-Hashing (für zukünftige Erweiterungen)
- **cors** - Cross-Origin Resource Sharing
- **multer** - File-Upload
- **dotenv** - Environment-Variablen

### Entwicklung
```bash
npm run dev  # Mit Nodemon für Auto-Reload
```

## 📝 Content bearbeiten

### Projekte
Jedes Projekt kann enthalten:
- Titel (DE/EN)
- Kurzbeschreibung (DE/EN)
- Lange Beschreibung (DE/EN)
- Technologien (Array)
- Features (Array, DE/EN)
- Dauer (DE/EN)
- YouTube Video URL (Embed-URL!)
- Bild-Upload
- GitHub URL
- Live-Demo URL

### Skills
Jeder Skill hat:
- Name
- Level (z.B. "Fortgeschritten", "Mittel", "Grundlagen")

### YouTube Videos einbinden
Verwenden Sie die **Embed-URL**:
```
❌ Falsch: https://www.youtube.com/watch?v=VIDEO_ID
✅ Richtig: https://www.youtube.com/embed/VIDEO_ID
```

## 🚨 Troubleshooting

### Port bereits in Verwendung
```bash
# Windows: Prozess auf Port 3000 beenden
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Oder Port in .env ändern
PORT=3001
```

### "Cannot find module"
```bash
npm install
```

### Token ungültig / Login funktioniert nicht
- Prüfen Sie `.env` Datei
- Stellen Sie sicher, dass Server läuft
- Löschen Sie Browser-LocalStorage und versuchen Sie erneut

### Uploads funktionieren nicht
- Prüfen Sie, ob `uploads/` Ordner existiert (wird automatisch erstellt)
- Prüfen Sie Datei-Berechtigungen

## 📱 Responsive Design

Funktioniert auf:
- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1366px)
- Mobile (< 768px)

## 💡 Tipps

1. **Bilder optimieren**: Verwenden Sie komprimierte Bilder (< 1MB)
2. **YouTube Embed**: Verwenden Sie die Embed-URL, nicht die normale URL
3. **Backup**: Sichern Sie regelmäßig `content-data.json`
4. **Git**: Fügen Sie `.env` zu `.gitignore` hinzu (bereits gemacht)

## 📞 Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Browser-Console (F12)
2. Prüfen Sie die Server-Logs im Terminal
3. Prüfen Sie die API-Antworten im Network-Tab

## 🎨 Anpassungen

### Farben ändern
- Website: `style.css` (Cyan-Farben: #06b6d4, #0891b2, #22d3ee)
- Admin: `admin.css` (Purple-Farben: #667eea, #764ba2)

### Logo ändern
- `index.html` - Emoji in Header: 💼

### Texte ändern
- `script.js` - `translations` Objekt

## 📄 Lizenz

Für Portfolio-Verwendung frei nutzbar.

---

**Erstellt mit ❤️ für moderne Web-Entwicklung**
