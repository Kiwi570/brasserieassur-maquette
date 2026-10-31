/* Parcours propres à BRASSERIEassur : test d'éligibilité TPE, demande de devis en étapes (double clic compris),
   calendrier de rendez-vous (jours passés, choix d'un service), carte des risques (onglets).
   Chaque problème s'ajoute au rapport : R.echec(controle, detail, { page, taille }) ou R.regarder(...). */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  /* 1. Éligibilité : trois réponses favorables → verdict « éligible », aiguille côté « en ligne ». */
  {
    const { ctx, page } = await contexte({ taille: T('1440×900') });
    try {
      await page.goto(BASE + '/#tpe', { waitUntil: 'load' });
      await attendrePret(page);
      for (const v of ['cafe', 'petite', 'petit']) await page.locator(`[data-eligibilite] input[value="${v}"]`).check({ force: true });
      await attendre(300);
      const oui = await page.evaluate(() => ({ verdict: document.querySelector('[data-verdict]').textContent.trim(), classe: document.querySelector('[data-eligibilite]').className, angle: document.querySelector('[data-aiguille]').style.transform }));
      if (!/éligible/.test(oui.verdict) || !/est-oui/.test(oui.classe) || !/82deg/.test(oui.angle)) R.echec('eligibilite', `trois réponses favorables : verdict « ${oui.verdict} », aiguille ${oui.angle}`, { page: '/', taille: '1440×900' });
      await page.locator('[data-eligibilite] input[value="grande"]').check({ force: true });
      await attendre(300);
      const non = await page.evaluate(() => ({ classe: document.querySelector('[data-eligibilite]').className, angle: document.querySelector('[data-aiguille]').style.transform }));
      if (!/est-non/.test(non.classe) || !/-\d+deg/.test(non.angle)) R.echec('eligibilite', `surface de 500 m² ou plus : le verdict ne bascule pas vers l’étude sur mesure (${non.angle})`, { page: '/', taille: '1440×900' });
    } finally { await ctx.close(); }
  }

  /* 2. Devis en étapes : étape suivante bloquée sans métier, préremplissage par l'adresse, orientation TPE, double clic. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/devis', { waitUntil: 'load' });
      await attendrePret(page);
      await page.locator('[data-etape-suivante]').click();
      await attendre(200);
      const bloque = await page.evaluate(() => document.querySelector('[data-etape-form="0"]').classList.contains('est-active') && !!document.querySelector('.champ-erreur')?.textContent);
      if (!bloque) R.echec('devis', 'l’étape suivante s’ouvre sans métier choisi, ou sans message d’erreur', { page: '/devis', taille: '390×844' });

      await page.goto(BASE + '/devis?metier=cafe', { waitUntil: 'load' });
      await attendrePret(page);
      const etape = await page.evaluate(() => [...document.querySelectorAll('[data-etape-form]')].findIndex((b) => b.classList.contains('est-active')));
      if (etape !== 1) R.echec('devis', `adresse ?metier=cafe : la demande devrait reprendre à l’étape 2 (étape ${etape + 1})`, { page: '/devis?metier=cafe', taille: '390×844' });
      await page.fill('#d-adresse', '1 rue de la Brasserie, 75001 Paris');
      await page.selectOption('#d-occupation', 'locataire');
      await page.fill('#d-superficie', '180');
      await page.locator('[data-etape-suivante]').click();
      await page.fill('#d-entreprise', 'Café test');
      await page.fill('#d-ca', '420000');
      await page.fill('#d-activites', 'Café-brasserie');
      await attendre(200);
      const eligible = await page.evaluate(() => !document.querySelector('[data-recap-eligible]').hidden);
      if (!eligible) R.echec('devis', 'café de 180 m² et 420 000 € de CA : l’orientation vers le devis en ligne n’apparaît pas', { page: '/devis', taille: '390×844' });
      await page.locator('[data-etape-suivante]').click();
      await page.fill('#d-email', 'test@exemple.fr');
      await page.fill('#d-tel', '0612345678');
      const envoi = page.locator('[data-etape-envoi]');
      await envoi.dblclick();
      await attendre(300);
      const etat = await page.evaluate(() => ({ desactive: document.querySelector('[data-etape-envoi]').disabled, message: !document.querySelector('[data-formulaire] [data-message-envoi]').hidden }));
      if (!etat.desactive || !etat.message) R.echec('devis', 'envoi simulé : bouton non désactivé ou message absent après un double clic', { page: '/devis', taille: '390×844' });
    } finally { await ctx.close(); }
  }

  /* 3. Rendez-vous : jours passés non proposés, jour même repéré, choix d'un jour et d'un service par lien. */
  {
    const { ctx, page } = await contexte({ taille: T('1440×900') });
    try {
      await page.goto(BASE + '/services', { waitUntil: 'load' });
      await attendrePret(page);
      const cal = await page.evaluate(() => {
        const auj = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
        const jours = [...document.querySelectorAll('[data-jour]')];
        const passes = jours.filter((j) => j.dataset.jour < auj);
        return { n: jours.length, passesActifs: passes.filter((j) => !j.disabled).length, aujRepere: !!document.querySelector(`[data-jour="${auj}"].est-aujourdhui`) };
      });
      if (!cal.n) R.echec('rendez-vous', 'le calendrier ne s’affiche pas', { page: '/services' });
      if (cal.passesActifs) R.echec('rendez-vous', `${cal.passesActifs} jours passés restent cliquables`, { page: '/services' });
      if (!cal.aujRepere) R.echec('rendez-vous', 'le jour même n’est pas repéré', { page: '/services' });
      await page.locator('[data-service="visite"]').click();
      await attendre(900);
      const service = await page.evaluate(() => document.querySelector('[name="service"][value="visite"]').checked && /Visite/.test(document.querySelector('[data-recap="service"]').textContent));
      if (!service) R.echec('rendez-vous', '« Réserver ce service » ne préremplit pas la demande', { page: '/services' });
      const libre = page.locator('[data-jour]:not([disabled])').last();
      await libre.click();
      await attendre(200);
      const date = await page.evaluate(() => ({ v: document.querySelector('[data-date-source]').value, r: document.querySelector('[data-recap="date"]').textContent }));
      if (!date.v || /choisir/.test(date.r)) R.echec('rendez-vous', 'le jour choisi n’est pas repris dans la demande', { page: '/services' });
    } finally { await ctx.close(); }
  }

  /* 4. Carte des risques épinglée : l'onglet F amène la zone F, avec son cachet. */
  {
    const { ctx, page } = await contexte({ taille: T('1440×900') });
    try {
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await attendrePret(page);
      const epinglee = await page.evaluate(() => document.querySelector('.carte').classList.contains('carte--epinglee'));
      if (epinglee) {
        await page.evaluate(() => document.querySelector('#carte').scrollIntoView());
        await attendre(600);
        await page.locator('[data-zone-onglet="accueil"]').click();
        await attendre(1800);
        const z = await page.evaluate(() => ({ active: document.querySelector('[data-zone-fiche].est-active')?.dataset.zoneFiche, cachet: document.querySelector('.zone[data-zone="accueil"]').classList.contains('est-couverte') }));
        if (z.active !== 'accueil') R.echec('carte', `l’onglet F affiche la zone « ${z.active} »`, { page: '/', taille: '1440×900' });
      } else R.regarder('carte', 'carte des risques non épinglée en 1440×900', { page: '/' });
    } finally { await ctx.close(); }
  }
}
