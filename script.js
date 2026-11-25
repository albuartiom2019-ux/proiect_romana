// =====================================================
// 1. BARA DE PROGRES, BUTONUL SUS, LINKUL ACTIV DIN MENIU
// =====================================================
const barProgres = document.getElementById('bara-progres');
const butonSus = document.getElementById('buton-sus');
const linkuriMeniu = document.querySelectorAll('nav a');

function actualizeazaMeniu() {
    let curent = null;

    linkuriMeniu.forEach(function (link) {
        const sectiune = document.querySelector(link.getAttribute('href'));
        if (sectiune && sectiune.offsetTop - 150 <= window.scrollY) {
            curent = link;
        }
    });

    linkuriMeniu.forEach(function (link) {
        link.classList.remove('activ');
    });

    if (curent) {
        curent.classList.add('activ');
    }
}

function laDerulare() {
    const derulat = window.scrollY;
    const inaltimeTotala = document.documentElement.scrollHeight - window.innerHeight;
    const procent = inaltimeTotala > 0 ? (derulat / inaltimeTotala) * 100 : 0;

    barProgres.style.width = procent + '%';

    if (derulat > 400) {
        butonSus.classList.add('vizibil');
    } else {
        butonSus.classList.remove('vizibil');
    }

    actualizeazaMeniu();
}

window.addEventListener('scroll', laDerulare);
laDerulare();

butonSus.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =====================================================
// 2. ELEMENTE CARE APAR LA DERULARE
// =====================================================
const elemente = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const observator = new IntersectionObserver(function (intrari) {
        intrari.forEach(function (intrare) {
            if (intrare.isIntersecting) {
                intrare.target.classList.add('apare');
                observator.unobserve(intrare.target);
            }
        });
    }, { threshold: 0.1 });

    elemente.forEach(function (el) {
        observator.observe(el);
    });
} else {
    // browsere foarte vechi: afișăm direct tot
    elemente.forEach(function (el) {
        el.classList.add('apare');
    });
}

// =====================================================
// 3. EFECT DE SCRIERE LA SUBTITLU
// =====================================================
const subtitlu = document.querySelector('.subtitlu');

if (subtitlu) {
    const textComplet = subtitlu.textContent.trim();
    subtitlu.textContent = '';
    subtitlu.classList.add('scrie');

    let pozitie = 0;

    function scrieLitera() {
        if (pozitie < textComplet.length) {
            subtitlu.textContent += textComplet.charAt(pozitie);
            pozitie++;
            setTimeout(scrieLitera, 40);
        } else {
            setTimeout(function () {
                subtitlu.classList.remove('scrie');
            }, 2500);
        }
    }

    setTimeout(scrieLitera, 1200);
}

// =====================================================
// 4. LUMINA CARE URMĂREȘTE MOUSE-UL ÎN FOAIA DE TITLU
// =====================================================
const foaieTitlu = document.getElementById('titlu');

if (foaieTitlu) {
    foaieTitlu.addEventListener('mousemove', function (e) {
        const dreptunghi = foaieTitlu.getBoundingClientRect();
        foaieTitlu.style.setProperty('--x', (e.clientX - dreptunghi.left) + 'px');
        foaieTitlu.style.setProperty('--y', (e.clientY - dreptunghi.top) + 'px');
    });
}

// =====================================================
// 5. CARDURI CARE SE ÎNCLINĂ (EFECT 3D)
// =====================================================
document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
        const dreptunghi = card.getBoundingClientRect();
        const x = (e.clientX - dreptunghi.left) / dreptunghi.width - 0.5;
        const y = (e.clientY - dreptunghi.top) / dreptunghi.height - 0.5;
        card.style.transform =
            'perspective(700px) rotateX(' + (-y * 12) + 'deg) rotateY(' + (x * 12) + 'deg) translateY(-5px)';
    });

    card.addEventListener('mouseleave', function () {
        card.style.transform = '';
    });
});

// =====================================================
// 6. TEMA ÎNTUNECATĂ (se ține minte alegerea)
// =====================================================
const butonTema = document.getElementById('buton-tema');

function seteazaTema(intunecat) {
    document.body.classList.toggle('intunecat', intunecat);
    butonTema.textContent = intunecat ? '☀️' : '🌙';
    try {
        localStorage.setItem('tema', intunecat ? 'intunecat' : 'luminos');
    } catch (e) {
        // ignorăm erorile
    }
}

try {
    if (localStorage.getItem('tema') === 'intunecat') {
        seteazaTema(true);
    }
} catch (e) {
    // ignorăm erorile
}

butonTema.addEventListener('click', function () {
    seteazaTema(!document.body.classList.contains('intunecat'));
});
// =====================================================
// ADAUGIRI NOI: lipește TOT ce e mai jos la FINALUL fișierului script.js
// =====================================================
const fara = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- 7. PARTICULE CONECTATE ÎN FOAIA DE TITLU ----------
(function () {
    const header = document.getElementById('titlu');
    if (!header || fara) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particule';
    header.insertBefore(canvas, header.firstChild);
    const ctx = canvas.getContext('2d');
    let puncte = [];
    const mouse = { x: -999, y: -999 };

    function redimensioneaza() {
        canvas.width = header.clientWidth;
        canvas.height = header.clientHeight;
        const nr = Math.min(70, Math.floor(canvas.width / 18));
        puncte = [];
        for (let i = 0; i < nr; i++) {
            puncte.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6
            });
        }
    }
    redimensioneaza();
    window.addEventListener('resize', redimensioneaza);

    header.addEventListener('mousemove', function (e) {
        const d = header.getBoundingClientRect();
        mouse.x = e.clientX - d.left;
        mouse.y = e.clientY - d.top;
    });
    header.addEventListener('mouseleave', function () { mouse.x = mouse.y = -999; });

    function deseneaza() {
        if (header.getBoundingClientRect().bottom > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            puncte.forEach(function (p, i) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // punctele fug ușor de mouse
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 110) { p.x += dx / dist * 1.5; p.y += dy / dist * 1.5; }

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.fill();

                for (let j = i + 1; j < puncte.length; j++) {
                    const q = puncte[j];
                    const d = Math.hypot(p.x - q.x, p.y - q.y);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(255,255,255,' + (0.25 * (1 - d / 120)) + ')';
                        ctx.stroke();
                    }
                }
            });
        }
        requestAnimationFrame(deseneaza);
    }
    deseneaza();
})();

// ---------- 8. PARALLAX PE FORMELE PLUTITOARE ----------
(function () {
    const header = document.getElementById('titlu');
    const forme = document.querySelector('.forme');
    if (!header || !forme || fara) return;
    header.addEventListener('mousemove', function (e) {
        const d = header.getBoundingClientRect();
        const x = (e.clientX - d.left) / d.width - 0.5;
        const y = (e.clientY - d.top) / d.height - 0.5;
        forme.style.transform = 'translate(' + (x * -40) + 'px,' + (y * -40) + 'px)';
    });
})();

// ---------- 9. CONTORIZARE CIFRE (statistici din cuprins) ----------
(function () {
    const cifre = document.querySelectorAll('.stat b');
    if (!cifre.length || !('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver(function (intrari) {
        intrari.forEach(function (intrare) {
            if (!intrare.isIntersecting) return;
            const el = intrare.target;
            const tinta = +el.dataset.tinta;
            const start = performance.now();
            const durata = fara ? 1 : 1400;

            (function pas(acum) {
                const t = Math.min((acum - start) / durata, 1);
                el.textContent = Math.round(tinta * (1 - Math.pow(1 - t, 3)));
                if (t < 1) requestAnimationFrame(pas);
            })(start);

            obs.unobserve(el);
        });
    }, { threshold: 0.6 });

    cifre.forEach(function (c) { obs.observe(c); });
})();

// ---------- 10. LUMINĂ PE CAPITOLELE DIN CUPRINS ----------
document.querySelectorAll('.cap').forEach(function (cap) {
    cap.addEventListener('mousemove', function (e) {
        const d = cap.getBoundingClientRect();
        cap.style.setProperty('--mx', (e.clientX - d.left) + 'px');
        cap.style.setProperty('--my', (e.clientY - d.top) + 'px');
    });
});

// ---------- 11. CURSOR PERSONALIZAT ----------
(function () {
    if (fara || !window.matchMedia('(hover: hover)').matches) return;

    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    document.body.appendChild(cursor);

    let x = 0, y = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', function (e) {
        x = e.clientX; y = e.clientY;
        cursor.classList.add('activ-cursor');
    });
    document.addEventListener('mouseleave', function () {
        cursor.classList.remove('activ-cursor');
    });

    (function urmareste() {
        cx += (x - cx) * 0.18;
        cy += (y - cy) * 0.18;
        cursor.style.transform = 'translate(' + (cx - cursor.offsetWidth / 2) + 'px,' + (cy - cursor.offsetHeight / 2) + 'px)';
        requestAnimationFrame(urmareste);
    })();

    document.querySelectorAll('a, button, .cap').forEach(function (el) {
        el.addEventListener('mouseenter', function () { cursor.classList.add('mare'); });
        el.addEventListener('mouseleave', function () { cursor.classList.remove('mare'); });
    });
})();

// ---------- 12. UNDĂ LA CLICK PE BUTOANE ----------
document.querySelectorAll('.buton, #buton-sus, #buton-tema').forEach(function (b) {
    b.addEventListener('click', function (e) {
        const d = b.getBoundingClientRect();
        const marime = Math.max(d.width, d.height);
        const val = document.createElement('span');
        val.className = 'val';
        val.style.width = val.style.height = marime + 'px';
        val.style.left = (e.clientX - d.left - marime / 2) + 'px';
        val.style.top = (e.clientY - d.top - marime / 2) + 'px';
        b.appendChild(val);
        setTimeout(function () { val.remove(); }, 650);
    });
});

// ---------- 13. BUTON "ÎNCEPE LECTURA" MAGNETIC ----------
(function () {
    const buton = document.querySelector('.buton');
    if (!buton || fara) return;
    const header = document.getElementById('titlu');
    header.addEventListener('mousemove', function (e) {
        const d = buton.getBoundingClientRect();
        const dx = e.clientX - (d.left + d.width / 2);
        const dy = e.clientY - (d.top + d.height / 2);
        if (Math.hypot(dx, dy) < 120) {
            buton.style.translate = (dx * 0.25) + 'px ' + (dy * 0.25) + 'px';
        } else {
            buton.style.translate = '';
        }
    });
})();

// extra.js: se leagă DUPĂ script.js

// ---------- 1. ACCESIBILITATE ----------
(function () {
    const tema = document.getElementById('buton-tema');
    const sus = document.getElementById('buton-sus');
    if (tema) tema.setAttribute('aria-label', 'Schimbă tema');
    if (sus) sus.setAttribute('aria-label', 'Înapoi sus');
})();

// ---------- 2. TEMA IMPLICITĂ = TEMA SISTEMULUI ----------
(function () {
    let salvata = null;
    try { salvata = localStorage.getItem('tema'); } catch (e) {}
    if (!salvata && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('intunecat');
        const b = document.getElementById('buton-tema');
        if (b) b.textContent = '☀️';
    }
})();

// ---------- 3. CĂUTARE ÎN PROIECT ----------
(function () {
    const camp = document.getElementById('cautare');
    const info = document.getElementById('rezultate');
    if (!camp) return;

    const norm = function (s) {
        return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };
    const grupe = Array.from(document.querySelectorAll('.subgrupa'));
    grupe.forEach(function (g) { g.dataset.text = norm(g.textContent); });

    camp.addEventListener('input', function () {
        const q = norm(camp.value.trim());
        let gasite = 0;
        grupe.forEach(function (g) {
            const potrivit = !q || g.dataset.text.includes(q);
            g.classList.toggle('ascunsa-cautare', !potrivit);
            if (potrivit && q) gasite++;
        });
        if (!q) info.textContent = '';
        else if (gasite) info.textContent = gasite + (gasite === 1 ? ' subcapitol găsit' : ' subcapitole găsite');
        else info.textContent = 'Niciun rezultat. Încearcă alt cuvânt, de exemplu „ironie” sau „Brâncuși”.';
    });

    document.addEventListener('keydown', function (e) {
        const scrie = /input|textarea/i.test(document.activeElement.tagName);
        if (e.key === '/' && !scrie) { e.preventDefault(); camp.focus(); }
        if (e.key === 'Escape' && document.activeElement === camp) {
            camp.value = ''; camp.dispatchEvent(new Event('input')); camp.blur();
        }
    });
})();

// ---------- 4. QUIZ ----------
(function () {
    const loc = document.getElementById('quiz-continut');
    if (!loc) return;

    const intrebari = [
        { q: 'Cine a formulat teoria sincronismului?',
          o: ['Tudor Arghezi', 'Eugen Lovinescu', 'Nicolae Manolescu', 'Matei Călinescu'], c: 1,
          e: 'Lovinescu, fondatorul cenaclului și revistei Sburătorul (1919).' },
        { q: 'Care este atitudinea postmodernismului față de tradiție?',
          o: ['o respinge', 'o reia fără schimbări', 'o parodiază și o reciclează', 'o ignoră'], c: 2,
          e: 'Modernismul o respinge, neomodernismul o reia, postmodernismul o parodiază.' },
        { q: 'Care dintre acești poeți aparține generației ’60 (neomodernism)?',
          o: ['George Bacovia', 'Mircea Cărtărescu', 'Ion Barbu', 'Nichita Stănescu'], c: 3,
          e: 'Stănescu a debutat în 1960 și este figura centrală a șaizecismului.' },
        { q: 'Cine a scris „Condiția postmodernă” (1979)?',
          o: ['Jean-François Lyotard', 'Jean Baudrillard', 'Umberto Eco', 'Charles Jencks'], c: 0,
          e: 'Lyotard a vorbit despre neîncrederea față de marile povestiri.' },
        { q: 'Unde a fost fondată școala Bauhaus, în 1919?',
          o: ['Dessau', 'Berlin', 'Weimar', 'München'], c: 2,
          e: 'Walter Gropius a fondat-o la Weimar.' }
    ];

    let i = 0, scor = 0;

    function intrebare() {
        const it = intrebari[i];
        loc.innerHTML =
            '<p class="quiz-stare">Întrebarea ' + (i + 1) + ' din ' + intrebari.length + '</p>' +
            '<div class="quiz-bara"><i style="width:' + (i / intrebari.length * 100) + '%"></i></div>' +
            '<h3></h3><div class="quiz-optiuni"></div>' +
            '<p class="quiz-explicatie" aria-live="polite"></p>';
        loc.querySelector('h3').textContent = it.q;
        const cutie = loc.querySelector('.quiz-optiuni');
        it.o.forEach(function (text, k) {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = text;
            b.addEventListener('click', function () { raspuns(k, cutie); });
            cutie.appendChild(b);
        });
    }

    function raspuns(k, cutie) {
        const it = intrebari[i];
        const butoane = cutie.querySelectorAll('button');
        butoane.forEach(function (b, j) {
            b.disabled = true;
            if (j === it.c) b.classList.add('corect');
        });
        if (k === it.c) scor++; else butoane[k].classList.add('gresit');
        loc.querySelector('.quiz-explicatie').textContent =
            (k === it.c ? 'Corect. ' : 'Greșit. ') + it.e;

        const urm = document.createElement('button');
        urm.type = 'button';
        urm.className = 'quiz-urmator';
        urm.textContent = i === intrebari.length - 1 ? 'Vezi rezultatul' : 'Întrebarea următoare';
        urm.addEventListener('click', function () {
            i++;
            if (i < intrebari.length) intrebare(); else final();
        });
        loc.appendChild(urm);
        urm.focus();
    }

    function final() {
        const mesaj = scor === intrebari.length ? 'Excelent, ai înțeles toate cele trei curente.'
            : scor >= 3 ? 'Bine. Recitește subcapitolele la care ai greșit.'
            : 'Mai citește o dată proiectul, apoi încearcă din nou.';
        loc.innerHTML =
            '<p class="quiz-scor">' + scor + ' / ' + intrebari.length + '</p><p></p>' +
            '<button type="button" class="quiz-urmator">Reia quiz-ul</button>';
        loc.querySelector('p:nth-of-type(2)').textContent = mesaj;
        loc.querySelector('button').addEventListener('click', function () {
            i = 0; scor = 0; intrebare();
        });
    }

    intrebare();
})();
// extra.js: se leagă DUPĂ script.js

// ---------- 1. ACCESIBILITATE ----------
(function () {
    const tema = document.getElementById('buton-tema');
    const sus = document.getElementById('buton-sus');
    if (tema) tema.setAttribute('aria-label', 'Schimbă tema');
    if (sus) sus.setAttribute('aria-label', 'Înapoi sus');
})();

// ---------- 2. TEMA IMPLICITĂ = TEMA SISTEMULUI ----------
(function () {
    let salvata = null;
    try { salvata = localStorage.getItem('tema'); } catch (e) {}
    if (!salvata && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('intunecat');
        const b = document.getElementById('buton-tema');
        if (b) b.textContent = '☀️';
    }
})();

// ---------- 3. CĂUTARE ÎN PROIECT ----------
(function () {
    const camp = document.getElementById('cautare');
    const info = document.getElementById('rezultate');
    if (!camp) return;

    const norm = function (s) {
        return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };
    const grupe = Array.from(document.querySelectorAll('.subgrupa'));
    grupe.forEach(function (g) { g.dataset.text = norm(g.textContent); });

    camp.addEventListener('input', function () {
        const q = norm(camp.value.trim());
        let gasite = 0;
        grupe.forEach(function (g) {
            const potrivit = !q || g.dataset.text.includes(q);
            g.classList.toggle('ascunsa-cautare', !potrivit);
            if (potrivit && q) gasite++;
        });
        if (!q) info.textContent = '';
        else if (gasite) info.textContent = gasite + (gasite === 1 ? ' subcapitol găsit' : ' subcapitole găsite');
        else info.textContent = 'Niciun rezultat. Încearcă alt cuvânt, de exemplu „ironie” sau „Brâncuși”.';
    });

    document.addEventListener('keydown', function (e) {
        const scrie = /input|textarea/i.test(document.activeElement.tagName);
        if (e.key === '/' && !scrie) { e.preventDefault(); camp.focus(); }
        if (e.key === 'Escape' && document.activeElement === camp) {
            camp.value = ''; camp.dispatchEvent(new Event('input')); camp.blur();
        }
    });
})();

// ---------- 4. QUIZ ----------
(function () {
    const loc = document.getElementById('quiz-continut');
    if (!loc) return;

    const intrebari = [
        { q: 'Cine a formulat teoria sincronismului?',
          o: ['Tudor Arghezi', 'Eugen Lovinescu', 'Nicolae Manolescu', 'Matei Călinescu'], c: 1,
          e: 'Lovinescu, fondatorul cenaclului și revistei Sburătorul (1919).' },
        { q: 'Care este atitudinea postmodernismului față de tradiție?',
          o: ['o respinge', 'o reia fără schimbări', 'o parodiază și o reciclează', 'o ignoră'], c: 2,
          e: 'Modernismul o respinge, neomodernismul o reia, postmodernismul o parodiază.' },
        { q: 'Care dintre acești poeți aparține generației ’60 (neomodernism)?',
          o: ['George Bacovia', 'Mircea Cărtărescu', 'Ion Barbu', 'Nichita Stănescu'], c: 3,
          e: 'Stănescu a debutat în 1960 și este figura centrală a șaizecismului.' },
        { q: 'Cine a scris „Condiția postmodernă” (1979)?',
          o: ['Jean-François Lyotard', 'Jean Baudrillard', 'Umberto Eco', 'Charles Jencks'], c: 0,
          e: 'Lyotard a vorbit despre neîncrederea față de marile povestiri.' },
        { q: 'Unde a fost fondată școala Bauhaus, în 1919?',
          o: ['Dessau', 'Berlin', 'Weimar', 'München'], c: 2,
          e: 'Walter Gropius a fondat-o la Weimar.' }
    ];

    let i = 0, scor = 0;

    function intrebare() {
        const it = intrebari[i];
        loc.innerHTML =
            '<p class="quiz-stare">Întrebarea ' + (i + 1) + ' din ' + intrebari.length + '</p>' +
            '<div class="quiz-bara"><i style="width:' + (i / intrebari.length * 100) + '%"></i></div>' +
            '<h3></h3><div class="quiz-optiuni"></div>' +
            '<p class="quiz-explicatie" aria-live="polite"></p>';
        loc.querySelector('h3').textContent = it.q;
        const cutie = loc.querySelector('.quiz-optiuni');
        it.o.forEach(function (text, k) {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = text;
            b.addEventListener('click', function () { raspuns(k, cutie); });
            cutie.appendChild(b);
        });
    }

    function raspuns(k, cutie) {
        const it = intrebari[i];
        const butoane = cutie.querySelectorAll('button');
        butoane.forEach(function (b, j) {
            b.disabled = true;
            if (j === it.c) b.classList.add('corect');
        });
        if (k === it.c) scor++; else butoane[k].classList.add('gresit');
        loc.querySelector('.quiz-explicatie').textContent =
            (k === it.c ? 'Corect. ' : 'Greșit. ') + it.e;

        const urm = document.createElement('button');
        urm.type = 'button';
        urm.className = 'quiz-urmator';
        urm.textContent = i === intrebari.length - 1 ? 'Vezi rezultatul' : 'Întrebarea următoare';
        urm.addEventListener('click', function () {
            i++;
            if (i < intrebari.length) intrebare(); else final();
        });
        loc.appendChild(urm);
        urm.focus();
    }

    function final() {
        const mesaj = scor === intrebari.length ? 'Excelent, ai înțeles toate cele trei curente.'
            : scor >= 3 ? 'Bine. Recitește subcapitolele la care ai greșit.'
            : 'Mai citește o dată proiectul, apoi încearcă din nou.';
        loc.innerHTML =
            '<p class="quiz-scor">' + scor + ' / ' + intrebari.length + '</p><p></p>' +
            '<button type="button" class="quiz-urmator">Reia quiz-ul</button>';
        loc.querySelector('p:nth-of-type(2)').textContent = mesaj;
        loc.querySelector('button').addEventListener('click', function () {
            i = 0; scor = 0; intrebare();
        });
    }

    intrebare();
})();

// ---------- 5. ACCENTUL SE SCHIMBĂ CU CURENTUL CITIT ----------
(function () {
    const harta = { modernism: 'mod', neomodernism: 'neo', postmodernism: 'post' };
    const sectiuni = Object.keys(harta)
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

    function sincronizeaza() {
        const y = window.scrollY + window.innerHeight * 0.35;
        let curent = '';
        sectiuni.forEach(function (s) {
            if (s.offsetTop <= y && s.offsetTop + s.offsetHeight > y) curent = harta[s.id];
        });
        if (curent) document.body.dataset.curent = curent;
        else delete document.body.dataset.curent;
    }
    window.addEventListener('scroll', sincronizeaza, { passive: true });
    sincronizeaza();
})();

// ---------- 6. TERMENI EXPLICAȚI (prima apariție în text) ----------
(function () {
    const dictionar = [
        ['sincronism', 'Ideea că cultura română trebuie să evolueze în pas cu cea europeană.'],
        ['monolog interior', 'Redarea gândurilor personajului în ordinea în care îi vin în minte.'],
        ['intertextualitate', 'Legătura dintre un text și alte texte la care face trimitere.'],
        ['metaficțiune', 'Ficțiune care vorbește despre propria ei scriere.'],
        ['pastișă', 'Imitarea stilului altei opere, de obicei cu umor.'],
        ['simulacre', 'Imagini sau copii care nu mai au un original real în spate.']
    ];
    const cuvinte = document.querySelectorAll('.subgrupa p, .subgrupa li');

    dictionar.forEach(function (pereche) {
        const re = new RegExp('(' + pereche[0] + '\\w*)', 'i');
        for (let k = 0; k < cuvinte.length; k++) {
            const walker = document.createTreeWalker(cuvinte[k], NodeFilter.SHOW_TEXT);
            let nod, gasit = false;
            while ((nod = walker.nextNode())) {
                const m = re.exec(nod.nodeValue);
                if (!m) continue;
                const dupa = nod.splitText(m.index);
                dupa.nodeValue = dupa.nodeValue.slice(m[1].length);
                const s = document.createElement('span');
                s.className = 'termen';
                s.tabIndex = 0;
                s.dataset.def = pereche[1];
                s.textContent = m[1];
                nod.parentNode.insertBefore(s, dupa);
                gasit = true;
                break;
            }
            if (gasit) break;
        }
    });
})();