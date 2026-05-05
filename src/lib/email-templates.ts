// Email templates for UI tools - safe for client-side use
export interface EmailTemplate {
  id: string
  title: string
  subject: string
  delay: string
  content: string
  useCase: string
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    title: 'Welkomstserie',
    subject: 'Welkom bij [Bedrijfsnaam] - Hier is wat je kunt verwachten',
    delay: 'Direct',
    useCase: 'Nieuwe klant of subscriber',
    content: `Beste [Naam],

Welkom bij [Bedrijfsnaam]! 👋

Leuk dat je er bent. Hier is wat je de komende dagen kunt verwachten:

📅 Dag 1-2: We nemen contact met je op om kennis te maken
📈 Dag 3-7: We sturen je onze beste tips en tricks
🎁 Dag 14: Een exclusieve aanbieding alleen voor jou

Ondertussen... heb je vragen? Reply gewoon op deze email - ik lees alles.

Tot snel!

[Je naam]
[Bedrijfsnaam]`
  },
  {
    id: 'follow-up',
    title: 'Follow-up na contact',
    subject: 'Even checken - nog vragen over [dienst/product]?',
    delay: '2 uur na geen reactie',
    useCase: 'Na eerste contactformulier',
    content: `Hey [Naam],

Ik wilde even checken of je mijn vorige email hebt ontvangen.

Geen zorgen als je even geen tijd hebt - ik wil gewoon zeker weten dat je alle info hebt die je nodig hebt.

Even samenvatten waar ik je mee kan helpen:
✓ [Dienst 1] - [korte beschrijving]
✓ [Dienst 2] - [korte beschrijving]
✓ [Dienst 3] - [korte beschrijving]

Wil je even bellen om te kijken wat het beste past bij jouw situatie? Ik heb morgen tussen 10:00 en 14:00 vrij.

[Je naam]`
  },
  {
    id: 'value-sequence',
    title: 'Waarde email',
    subject: '[Tips die je helpt met jouw probleem]',
    delay: 'Dag 3 na inschrijving',
    useCase: 'Nieuwe subscriber',
    content: `Hoi [Naam],

Veel bedrijven in [jouw branche] hebben hetzelfde probleem: [gemeenschappelijk probleem].

Hier is hoe sommige van onze klanten dit hebben opgelost:

1. [Tip 1 met voorbeeld]
2. [Tip 2 met voorbeeld]  
3. [Tip 3 met voorbeeld]

Deze tips werken het beste als je ze combineert. Wil je dat we even kijken wat het beste voor jouw situatie werkt?

PS: De volgende email in deze serie bevat een speciaal aanbod alleen voor jou.

[Je naam]`
  },
  {
    id: 'offer',
    title: 'Aanbieding / CTA',
    subject: 'Je persoonlijke aanbieding -限时优惠',
    delay: 'Dag 7 na inschrijving',
    useCase: 'Na waarde-emails',
    content: `Hey [Naam],

Ik hoop dat je de vorige emails waardevol hebt gevonden!

Als je klaar bent om de volgende stap te zetten, heb ik iets speciaals voor je:

🎁 [AANBIEDING NAAM]
[Specifieke beschrijving van wat ze krijgen]

✍️ Hoe het werkt:
1. Klik op de button hieronder
2. Kies je gewenste startdatum
3. Wij regelen de rest

👉 [BUTTON: Ik wil graag beginnen]

Deze aanbieding is persoonlijk voor jou en verloopt over [X] dagen.

Nog vragen? Reply gewoon - ik ben er voor je.

[Je naam]`
  },
  {
    id: 'review-request',
    title: 'Review verzoek',
    subject: 'Bedankt voor je vertrouwen! Kun je ons helpen?',
    delay: '1 dag na aankoop/dienst',
    useCase: 'Na levering dienst',
    content: `Hey [Naam],

Nogmaals bedankt dat je voor [Bedrijfsnaam] hebt gekozen! 🙏

We willen graag weten hoe we het hebben gedaan. Als je een momentje hebt:

⭐⭐⭐⭐⭐ Zou je ons een review willen geven op [Google/Facebook/etc]?
Het helpt ons enorm om meer ondernemers zoals jij te helpen.

👉 [LINK NAAR REVIEW PAGINA]

Nog geen 5 sterren? Geen probleem - reply me en vertel wat we beter kunnen doen. Ik neem elke feedback serieus.

Nogmaals bedankt!

[Je naam]`
  },
  {
    id: 're-engagement',
    title: 'Heractivatie',
    subject: 'Lang niet gesproken - alles goed daar?',
    delay: '30 dagen inactief',
    useCase: 'Lange tijd geen contact',
    content: `Hey [Naam],

Het is alweer een tijdje geleden dat we contact hebben gehad - alles goed daar?

Ik wilde even checken of je nog ergens mee geholpen bent. Ondertussen hebben we een paar nieuwe dingen die je misschien interessant vindt:

🆕 [Nieuwe dienst/functie 1]
🆕 [Nieuwe dienst/functie 2]

Geen actie nodig van je als je nu even geen tijd hebt - ik wilde gewoon even laten weten dat we er zijn als je ons nodig hebt.

Groetjes,

[Je naam]`
  }
]