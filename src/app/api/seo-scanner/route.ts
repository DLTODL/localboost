import { NextResponse } from 'next/server';

// Real SEO analysis - fetches and analyzes actual web pages
export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 });
    }

    // Normalize URL
    let targetUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      targetUrl = 'https://' + url;
    }

    try {
      // Fetch the target page
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'LocalBoost SEO Scanner Bot/1.0',
          'Accept': 'text/html',
        },
        signal: AbortSignal.timeout(10000)
      });

      const html = await response.text();
      
      // Analyze the page
      const analysis = analyzeSEO(html, targetUrl, response);
      
      return NextResponse.json(analysis);
    } catch (fetchError: unknown) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
      return NextResponse.json({
        url: targetUrl,
        error: `Could not fetch: ${errorMessage}`,
        score: 0,
        issues: [
          {
            severity: 'high',
            message: 'Website kon niet worden opgehaald',
            recommendation: 'Controleer of de URL correct is en de website online is'
          }
        ],
        score_breakdown: {
          title: 0,
          meta: 0,
          headings: 0,
          images: 0,
          speed: 0,
          mobile: 0
        }
      });
    }

  } catch (error) {
    console.error('SEO scan error:', error);
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
  }
}

function analyzeSEO(html: string, url: string, response: Response) {
  const issues: { severity: 'high' | 'medium' | 'low', message: string, recommendation: string }[] = [];
  
  let score = 100;
  const breakdown = {
    title: 0,
    meta: 0,
    headings: 0,
    images: 0,
    speed: 0,
    mobile: 0
  };

  // 1. Title Check
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  if (!title) {
    issues.push({
      severity: 'high',
      message: 'Pagina titel ontbreekt',
      recommendation: 'Voeg een unieke, beschrijvende title tag toe van 50-60 tekens'
    });
    breakdown.title = 0;
    score -= 15;
  } else if (title.length < 30) {
    issues.push({
      severity: 'medium',
      message: ` Titel is te kort (${title.length} tekens)`,
      recommendation: 'Maak de titel 50-60 tekens voor optimale weergave in Google'
    });
    breakdown.title = 60;
    score -= 8;
  } else if (title.length > 60) {
    issues.push({
      severity: 'medium',
      message: ` Titel is te lang (${title.length} tekens)`,
      recommendation: 'Kort de titel in tot 60 tekens voor volledige weergave in Google'
    });
    breakdown.title = 70;
    score -= 5;
  } else {
    breakdown.title = 100;
  }

  // 2. Meta Description Check
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1] : '';
  
  if (!metaDesc) {
    issues.push({
      severity: 'high',
      message: 'Meta description ontbreekt',
      recommendation: 'Voeg een meta description van 150-160 tekens toe'
    });
    breakdown.meta = 0;
    score -= 15;
  } else if (metaDesc.length < 120) {
    issues.push({
      severity: 'medium',
      message: `Meta description te kort (${metaDesc.length} tekens)`,
      recommendation: 'Schrijf 150-160 tekens voor optimale CTR in Google'
    });
    breakdown.meta = 70;
    score -= 8;
  } else if (metaDesc.length > 160) {
    issues.push({
      severity: 'medium',
      message: `Meta description te lang (${metaDesc.length} tekens)`,
      recommendation: 'Kort in tot 160 tekens voor volledige weergave'
    });
    breakdown.meta = 75;
    score -= 5;
  } else {
    breakdown.meta = 100;
  }

  // 3. Heading Structure
  const h1s = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
  
  if (h1s.length === 0) {
    issues.push({
      severity: 'high',
      message: 'Geen H1 heading gevonden',
      recommendation: 'Voeg precies één H1 toe met je belangrijkste zoekwoord'
    });
    breakdown.headings = 0;
    score -= 15;
  } else if (h1s.length > 1) {
    issues.push({
      severity: 'medium',
      message: `${h1s.length} H1 headings gevonden (hoort er maar 1 te zijn)`,
      recommendation: 'Gebruik maar één H1 per pagina voor betere SEO'
    });
    breakdown.headings = 60;
    score -= 10;
  } else {
    breakdown.headings = 100;
  }

  // 4. Images Check
  const images = html.match(/<img[^>]*>/gi) || [];
  const imagesWithAlt = html.match(/<img[^>]*alt=["'][^"']+["'][^>]*>/gi) || [];
  
  if (images.length > 0) {
    const altRatio = imagesWithAlt.length / images.length;
    
    if (altRatio < 0.5) {
      issues.push({
        severity: 'medium',
        message: `${images.length - imagesWithAlt.length} afbeeldingen zonder alt-tekst`,
        recommendation: 'Voeg alt-tekst toe aan alle afbeeldingen voor betere toegankelijkheid en SEO'
      });
      breakdown.images = Math.round(altRatio * 100);
      score -= 10;
    } else {
      breakdown.images = 100;
    }
  } else {
    breakdown.images = 100;
  }

  // 5. Mobile/Viewport Check
  const hasViewport = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  
  if (!hasViewport) {
    issues.push({
      severity: 'high',
      message: 'Viewport meta tag ontbreekt',
      recommendation: 'Voeg <meta name="viewport" content="width=device-width, initial-scale=1"> toe voor mobiele vriendelijkheid'
    });
    breakdown.mobile = 0;
    score -= 15;
  } else {
    breakdown.mobile = 100;
  }

  // 6. SSL/HTTPS Check
  if (url.startsWith('http://')) {
    issues.push({
      severity: 'high',
      message: 'Geen SSL certificaat (HTTP i.p.v. HTTPS)',
      recommendation: 'Installeer een SSL certificaat voor veilige verbinding en betere Google ranking'
    });
    breakdown.speed = 50;
    score -= 10;
  } else {
    breakdown.speed = 100;
  }

  // 7. Structured Data Check (basic)
  const hasSchema = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/i);
  
  if (!hasSchema) {
    issues.push({
      severity: 'low',
      message: 'Geen structured data (Schema.org) gevonden',
      recommendation: 'Voeg JSON-LD structured data toe voor rijkere zoekresultaten'
    });
    score -= 5;
  }

  // 8. Open Graph Tags (social sharing)
  const hasOgTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*>/i);
  const hasOgDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*>/i);
  
  if (!hasOgTitle || !hasOgDesc) {
    issues.push({
      severity: 'low',
      message: 'Open Graph tags ontbreken voor social sharing',
      recommendation: 'Voeg og:title, og:description en og:image toe voor betere social media preview'
    });
    score -= 5;
  }

  // Ensure score bounds
  score = Math.max(0, Math.min(100, score));

  return {
    url,
    statusCode: response.status,
    score,
    score_breakdown: breakdown,
    issues: issues.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    }),
    summary: {
      title: title || 'Geen titel',
      metaDesc: metaDesc ? metaDesc.substring(0, 100) + '...' : 'Geen description',
      h1Count: h1s.length,
      imageCount: images.length,
      hasSSL: url.startsWith('https://'),
      hasSchema: !!hasSchema
    }
  };
}
