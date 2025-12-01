const express = require('express');
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Cartella scrivibile su Render
const DATA_FILE = path.join('/tmp', 'complaints.json');

// Resend (usa solo la tua API key)
const resend = new Resend(process.env.RESEND_API_KEY);

// LOGIN Riki
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Rikicarbone' && password === 'bigdsince2007') {
    res.redirect('/portal.html');
  } else {
    res.send(`
      <html><head><link rel="stylesheet" href="/style.css"></head><body>
        <div style="text-align:center;padding:100px;background:#ffebee;color:#c62828;font-family:Georgia;">
          <h2>Wrong password, babe 🙅‍♀️</h2>
          <a href="/">← Torna indietro</a>
        </div>
      </body></html>
    `);
  }
});

app.get('/portal', (req, res) => res.redirect('/portal.html'));

// SUBMIT COMPLAINT
app.post('/submit-complaint', async (req, res) => {
  const { title, issue, mood, severity } = req.body;

  // Salva reclamo
  let complaints = [];
  if (fs.existsSync(DATA_FILE)) {
    try { complaints = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
    catch (e) { console.log('Errore lettura JSON'); }
  }

  complaints.push({
    title: title || 'Senza titolo',
    issue: issue || 'Senza testo',
    mood: mood || 'non specificato',
    severity: severity || '5',
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(complaints, null, 2));
  console.log('Reclamo salvato:', title);

  // Mail a te (Chiara)
  await resend.emails.send({
    from: 'Riki Complaint <no-reply@riki-complaint.onrender.com>',
    to: 'chiaraggalliani@gmail.com',           // ← METTI QUI LA TUA EMAIL
    subject: `NUOVO RECLAMO: ${title}`,
    text: `Titolo: ${title}\nTesto: ${issue}\nMood: ${mood}\nSeverità: ${severity}/10\nOra: ${new Date().toLocaleString('it-IT')}`
  });

  // Risposta automatica a Riki
  await resend.emails.send({
    from: 'Chiara 💕 <no-reply@riki-complaint.onrender.com>',
    to: 'riccarbone07@icloud.com',             // ← METTI QUI L’EMAIL DI RIKI
    subject: `Re: ${title}`,
    text: `Hi babe 💌,

      Your complaint has been filed, logged, categorized under "emotional emergency", and ignored. Just kidding.

      Chiara has received your dramatic submission and is now pondering it with the weight of 1,000 philosophical thoughts. Just wait for the miracle to happen.

      Timestamp: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}

      - Yo' girl!!!`
  });

  res.redirect('/portal.html?submitted=true');
});

// API per complaints.html
app.get('/get-complaints', (req, res) => {
  if (req.query.password !== 'thebestgirlfriend') {
    return res.status(403).send('Password sbagliata, tesoro');
  }
  let complaints = [];
  if (fs.existsSync(DATA_FILE)) {
    complaints = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  res.json(complaints);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server attivo su porta ${PORT} con Resend!`));
