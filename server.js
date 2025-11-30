const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();

console.log('MYEMAIL:', process.env.MYEMAIL);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('RIKIEMAIL:', process.env.RIKIEMAIL);

// Serve i file statici dalla cartella 'public'
app.use(express.static('public'));

// Middleware per parsare i dati del form
app.use(express.urlencoded({ extended: true }));

// Configura il transporter per Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MYEMAIL,
    pass: process.env.EMAIL_PASS,
  }
});

// Testa la connessione SMTP
transporter.verify((error, success) => {
  if (error) {
    console.log('Errore di connessione SMTP:', error);
  } else {
    console.log('Connessione SMTP funzionante:', success);
  }
});

// Gestisce la rotta POST /login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Rikicarbone' && password === 'bigdsince2007') {
    res.redirect('/portal.html'); // Reindirizza a portal.html
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Error</title>
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <div class="dark-toggle-container">
            <span class="dark-toggle-label">Dark Mode</span>
            <label class="switch">
              <input type="checkbox" id="darkModeToggle">
              <span class="slider"></span>
            </label>
          </div>
          <div class="login-box">
            <h2>Complaint Portal for my Prince</h2>
            <p class="error-msg">Babes, you can't even remember your password? Try again, bitch.</p>
            <a href="/">Back to login</a>
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              const toggle = document.getElementById('darkModeToggle');
              if (!toggle) {
                console.error('darkModeToggle not found!');
                return;
              }
              const dark = localStorage.getItem('darkMode') === 'true';
              document.body.classList.toggle('dark-mode', dark);
              toggle.checked = dark;
              console.log('Initial dark mode state:', dark);
              toggle.addEventListener('change', () => {
                document.body.classList.toggle('dark-mode');
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
                console.log('Dark mode toggled:', isDarkMode);
              });
            });
          </script>
        </body>
      </html>
    `);
  }
});

// Rotta GET per caricare portal.html
app.get('/portal', (req, res) => {
  res.redirect('/portal.html'); // Serve il file statico portal.html
});

// Gestisce la rotta POST /submit-complaint
app.post('/submit-complaint', (req, res) => {
  const { title, issue, mood, severity } = req.body;

  // Log per debug
  console.log('Received /submit-complaint request:', req.body);

  // Controllo: invia la mail solo se title e issue sono presenti e non vuoti
  if (!title || !issue || title.trim() === '' || issue.trim() === '') {
    console.log('Invalid submission: title or issue missing or empty');
    return res.redirect('/portal.html');
  }

  // Leggi i reclami esistenti (se il file esiste)
  let complaints = [];
  if (fs.existsSync('complaints.json')) {
    const data = fs.readFileSync('complaints.json', 'utf8');
    complaints = JSON.parse(data);
  }

  // Aggiungi il nuovo reclamo
  const newComplaint = {
    title,
    issue,
    mood,
    severity,
    timestamp: new Date().toISOString()
  };
  complaints.push(newComplaint);

  // Salva i reclami nel file
  fs.writeFileSync('complaints.json', JSON.stringify(complaints, null, 2));

  // Invia notifica email a te stessa
  const mailOptions = {
    from: process.env.MYEMAIL,
    to: process.env.MYEMAIL,
    subject: `New Complaint Submitted: ${title}`,
    text: `
      Il tuo bellissimo ragazzo si sta lamentando di nuovo!
      Nel dettaglio:
      - Titolo: ${title}
      - Problema: ${issue}
      - Mood: ${mood || 'N/A'}
      - Severità: ${severity || 'N/A'}
      - Timestamp: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Errore nell\'invio dell\'email:', error);
    } else {
      console.log('Email inviata:', info.response);
    }
  });

  // Risposta automatica (finta gentilezza™️) al tuo ragazzo
  const replyMail = {
    from: process.env.MYEMAIL,
    to: process.env.RIKIEMAIL,
    subject: `RE: ${title}`,
    text: `
      Hi babe 💌,

      Your complaint has been filed, logged, categorized under "emotional emergency", and ignored. Just kidding.

      Chiara has received your dramatic submission and is now pondering it with the weight of 1,000 philosophical thoughts. Just wait for the miracle to happen.

      Timestamp: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}

      - Yo' girl!!!
  `};

  transporter.sendMail(replyMail, (err, info) => {
    if (err) console.log("Errore invio risposta automatica:", err);
    else console.log("Risposta automatica inviata:", info.response);
  });

  // Reindirizza a portal.html con un messaggio di conferma
  res.redirect('/portal.html?submitted=true');
});

// Gestisce la rotta GET /get-complaints
app.get('/get-complaints', (req, res) => {
  const password = req.query.password;
  if (password !== 'thebestgirlfriend') {
    return res.status(403).send('No access for ya. Wrong password babes.');
  }
  let complaints = [];
  if (fs.existsSync('complaints.json')) {
    const data = fs.readFileSync('complaints.json', 'utf8');
    complaints = JSON.parse(data);
  }
  res.json(complaints);
});

// Avvia il server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port', process.env.PORT || 3000);
});