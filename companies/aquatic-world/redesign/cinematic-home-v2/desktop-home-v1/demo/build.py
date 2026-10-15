"""Build eight independent, no-JS-readable static pages using only the stdlib."""
from html import escape
import json
from pathlib import Path
import shutil
from site_data import BRAND, NAV, CATEGORIES, category_url, enquiry_url

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "public"
ASSETS = json.loads((ROOT / "assets/manifest.json").read_text())
ARROW = '<span class="arrow" aria-hidden="true">↗</span>'


def image(asset, alt="", css="", eager=False, sizes="(max-width: 767px) 100vw, 50vw"):
    data = ASSETS[asset]
    low, high = data["variants"]
    priority = 'loading="eager" fetchpriority="high"' if eager else 'loading="lazy"'
    return (f'<img class="{css}" src="/assets/{high["file"]}" '
            f'srcset="/assets/{low["file"]} {low["width"]}w, /assets/{high["file"]} {high["width"]}w" '
            f'sizes="{sizes}" width="{data["width"]}" height="{data["height"]}" '
            f'alt="{escape(alt)}" {priority} decoding="async">')


def link(label, href, style="text-link"):
    return f'<a class="{style}" href="{href}">{label}{ARROW}</a>'


def nav_links(route, footer=False):
    links = []
    for label, href in NAV:
        current = ' aria-current="page"' if route == href else (
            ' aria-current="location"' if href == "/collections/" and route.startswith("/collections/") else "")
        links.append(f'<a href="{href}"{current}>{label}</a>')
    return "".join(links)


def brand(show_tagline=True):
    tagline = f'<span class="tagline">{BRAND["tagline"].upper()}</span>' if show_tagline else ''
    return f'''<a class="brand" href="/" aria-label="Aquatic World — Home">
      <svg class="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="18"/><path d="M4 21c6-8 11-8 16 0s10 8 16 0M6 27c5-7 9-7 14 0s9 7 14 0M6 15c5-7 9-7 14 0s9 7 14 0"/></svg>
      <span><span class="wordmark">{BRAND['name'].upper()}</span>{tagline}</span></a>'''


def header(route):
    if route == '/':
        return f'''<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header"><div class="header-inner wrap">
      <a class="brand" href="/" aria-label="Aquatic World — Home"><span class="wordmark">AQUATIC WORLD</span></a>
      <nav class="desktop-nav" aria-label="Main navigation">{nav_links(route)}</nav>
      <details class="mobile-menu"><summary aria-controls="home-menu-links"><span class="menu-closed">Menu</span><span class="menu-open">Close</span><span class="menu-icon" aria-hidden="true"><i></i><i></i></span></summary>
        <nav id="home-menu-links" aria-label="Mobile navigation">{nav_links(route)}</nav>
      </details></div></header>'''
    return f'''<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header"><div class="header-inner wrap">{brand(False)}
      <nav class="desktop-nav" aria-label="Main navigation">{nav_links(route)}</nav>
      {link('Discuss a project', '/contact/#enquiry', 'button header-cta')}
      <details class="mobile-menu"><summary><span class="menu-closed">Menu</span><span class="menu-open">Close</span><span class="menu-icon" aria-hidden="true"><i></i><i></i></span></summary>
        <nav aria-label="Mobile navigation">{nav_links(route)}{link('Discuss a project', '/contact/#enquiry', 'button')}</nav>
      </details></div></header>'''


def footer(route):
    if route == '/':
        return f'''<footer class="home-footer"><div class="home-wrap">
      <div class="home-footer-links"><a class="home-footer-brand" href="/">AQUATIC WORLD</a><nav aria-label="Footer navigation">{nav_links(route)}</nav></div>
      <p class="home-disclosure">Fictional design demo. Imagery and copy are illustrative; enquiries are local previews only.</p>
    </div></footer>'''
    return f'''<footer class="site-footer"><div class="wrap footer-top"><div>{brand()}<p class="footer-thought">A little closer to nature.<br>A world of possibilities.</p></div>
      <div><p class="eyebrow">Explore</p><nav class="footer-nav" aria-label="Footer navigation">{nav_links(route)}</nav></div>
      <div><p class="eyebrow">The collection</p><nav class="footer-nav" aria-label="Collection navigation">{''.join(f'<a href="{category_url(c)}">{c["name"]}</a>' for c in CATEGORIES)}</nav></div>
    </div><div class="wrap footer-bottom"><p>Aquatic World is an illustrative concept. Imagery and copy are for demonstration; no stock or business service is represented.</p><span>Nature connects us all</span></div></footer>'''


def breadcrumb(label, category=False):
    parent = '<li><a href="/collections/">Collections</a></li>' if category else ""
    return f'<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>{parent}<li><span aria-current="page">{label}</span></li></ol></nav>'


def invitation(title="Let’s imagine your aquatic world.", body="Start with an idea, a setting or a favourite detail. Shape a project brief at your own pace.", href="/contact/#enquiry", action="Discuss a project"):
    return f'''<section class="invitation dark">{image('enquiry-underwater-school', css='invitation-image', sizes='100vw')}
      <div class="wrap invitation-inner"><p class="eyebrow">The next chapter</p><h2>{title}</h2><p>{body}</p>{link(action, href, 'button')}</div></section>'''


def category_cards():
    return '<div class="category-grid">' + ''.join(f'''<a class="category-card" href="{category_url(c)}">
      <div class="category-photo">{image(c['image'], c['alt'], sizes='(max-width: 767px) 100vw, (max-width: 1119px) 50vw, 33vw')}<span class="photo-label">{c['theme']}</span></div>
      <div class="category-copy"><span class="eyebrow">Collection {c['number']}</span><h3>{c['name']}{ARROW}</h3><p>{c['summary']}</p></div></a>''' for c in CATEGORIES) + '</div>'


def siblings(category):
    others = [c for c in CATEGORIES if c != category]
    return f'''<section class="section sibling-section"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">Continue exploring</p><h2>Complete the picture.</h2></div>{link('All collections', '/collections/')}</div>
    <div class="sibling-grid">{''.join(f'<a class="sibling-card" href="{category_url(c)}">{image(c["image"], c["alt"], sizes="(max-width: 767px) 30vw, 20vw")}<div><span class="eyebrow">{c["theme"]}</span><h3>{c["name"]}</h3></div>{ARROW}</a>' for c in others)}</div></div></section>'''


def home_environment():
    return '''<div class="home-environment" data-home-environment data-state="poster" data-frame="poster" aria-hidden="true">
      <picture><source media="(min-aspect-ratio: 6/5)" srcset="/assets/ecosystem/landscape-poster.png">
        <img src="/assets/ecosystem/portrait-poster.png" width="941" height="1672" alt="" fetchpriority="high" loading="eager" decoding="async"></picture>
      <video id="home-background" muted loop playsinline preload="none" tabindex="-1" disablepictureinpicture
        data-landscape-src="/assets/ecosystem/landscape.mp4"
        data-landscape-poster="/assets/ecosystem/landscape-poster.png" data-portrait-poster="/assets/ecosystem/portrait-poster.png"></video>
    </div>'''


def home_motion_control():
    return '''<div class="home-motion-control"><button type="button" data-motion-toggle aria-controls="home-background" aria-label="Play background" title="Play background" hidden>
      <svg data-pause-icon viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" hidden><path d="M7 5v14M17 5v14"/></svg>
      <svg data-play-icon viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m8 4 12 8-12 8Z"/></svg>
    </button><span class="home-motion-explanation" data-motion-label aria-hidden="true">Play background</span></div>'''


def home_link(label, href, style='home-text-link'):
    return f'<a class="{style}" href="{href}">{label}<span aria-hidden="true">→</span></a>'


def home():
    descriptions = ['Colour, form and gentle movement.', 'Texture, depth and a living landscape.', 'Natural lines and structure.']
    entries = ''.join(f'''<article class="ecosystem-chapter"><a class="ecosystem-photo" href="{category_url(c)}"><img src="/assets/ecosystem/collection-{c['slug']}.png" alt="{escape(c['alt'])}" width="1448" height="1086" loading="lazy" decoding="async"></a><div class="ecosystem-chapter-copy"><p class="home-eyebrow">Collection {c['number']}</p><h3>{c['name']}</h3><p>{description}</p>{home_link('Explore ' + c['name'].lower(), category_url(c))}</div></article>''' for c, description in zip(CATEGORIES, descriptions))
    return f'''<section class="home-arrival" aria-labelledby="home-heading"><div class="home-arrival-copy">
      <p class="home-eyebrow">FISH · PLANTS · DRIFTWOOD</p><h1 id="home-heading">A world beneath <br>the surface.</h1>
      <p class="home-description">Discover ornamental fish, aquatic plants and natural driftwood.</p>
      {home_link('Explore the collections', '/collections/', 'home-primary')}
    </div><p class="home-scroll-hint">Scroll to explore<span aria-hidden="true"></span></p></section>
    <section class="home-chapter home-collection" aria-labelledby="home-collection-heading"><div class="home-wrap"><div class="home-reading-zone ecosystem-collection-intro">
      <p class="home-eyebrow">The collection</p><h2 id="home-collection-heading">Three elements.<br>One aquatic world.</h2>
      </div><div class="ecosystem-chapters">{entries}</div>
    </div></section>
    <section class="home-chapter home-perspective" aria-labelledby="home-perspective-heading"><div class="home-wrap"><div class="home-reading-zone">
      <p class="home-eyebrow">Our perspective</p><h2 id="home-perspective-heading">A closer connection<br>to nature.</h2>
      <p class="home-perspective-copy">Explore the elements of an aquatic landscape, and the questions that shape it.</p>
      <nav class="home-perspective-links" aria-label="Discover our perspective">{home_link('Our Story', '/our-story/')}{home_link('Quality', '/quality/')}</nav>
      {home_link('Discuss a project', '/contact/#enquiry', 'home-primary')}
    </div></div></section>'''


def collections():
    return f'''<section class="section collection-intro"><div class="wrap">{breadcrumb('Collections')}<div class="section-heading"><div><p class="eyebrow">The Aquatic World collection</p><h1>Three elements.<br><em>Endless possibilities.</em></h1></div><div class="heading-side"><p class="lead">A living focal point. A layered landscape. A natural framework.</p><p>Explore each collection as a visual starting point, then bring the pieces together around your setting.</p><p class="small muted">Illustrative collection studies, not a stock catalogue.</p></div></div>{category_cards()}</div></section>
    <section class="section composition dark"><div class="wrap"><p class="eyebrow">Thinking about the whole</p><div class="section-heading"><h2>Build a composition,<br><em>one decision at a time.</em></h2><p class="heading-side">You might start with a colour, a leaf shape or a branching line. Let that first choice guide the balance of the scene.</p></div><div class="three-notes"><div><span>01</span><h3>Choose a focal point</h3><p>What should catch the eye first? Consider the relationship between movement, colour and the quieter background.</p></div><div><span>02</span><h3>Create layers</h3><p>Vary textures and heights. Think about how the view changes from the front, the side and at a distance.</p></div><div><span>03</span><h3>Leave room to breathe</h3><p>Open space gives the composition clarity. Plan the practical setting alongside the visual idea.</p></div></div></div></section>
    {invitation('Have a composition in mind?', 'Choose a collection or describe the whole scene. The enquiry preview helps you organise your ideas.') }'''


def fish():
    c = CATEGORIES[0]
    return f'''<section class="category-intro fish-intro dark"><div class="wrap">{breadcrumb(c['name'], True)}<div class="detail-split"><div><p class="eyebrow">Collection 01 · Colour & movement</p><h1>Ornamental<br><em>Fish</em></h1><p class="lead">A living focal point.<br>An ever-changing picture.</p><p>Flowing fins, distinctive silhouettes and expressive colour introduce movement to a composed aquatic landscape.</p>{link(c['action'], enquiry_url(c), 'button')}</div><figure>{image(c['image'], c['alt'], 'fish-feature', True)}<figcaption>A study in colour and form · illustrative imagery</figcaption></figure></div></div></section>
    <section class="section"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">Visual studies</p><h2>Two different ways<br>to draw the eye.</h2></div><p class="heading-side">These illustrated studies explore visual character. They are not confirmed species listings or available products.</p></div><div class="fish-studies"><figure>{image('highlight-red-betta', 'Illustrated red fish with a broad, flowing fan of fins')}<figcaption><span class="eyebrow">Study 01</span><h3>A flourish of colour</h3><p>Warm red tones and flowing curves create a bold point of contrast against a quiet green setting.</p></figcaption></figure><figure>{image('highlight-angelfish', 'Illustrated striped fish with a tall triangular silhouette')}<figcaption><span class="eyebrow">Study 02</span><h3>A sculptural silhouette</h3><p>Vertical stripes and an angular profile offer a different kind of presence: graphic, poised and expressive.</p></figcaption></figure></div></div></section>
    <section class="section tinted"><div class="wrap planning-layout"><div><p class="eyebrow">Before you choose</p><h2>Look beyond<br>the first impression.</h2><p>Visual preference is only a starting point. Suitability and care deserve a conversation with a qualified aquatic specialist.</p>{link('Read our quality principles', '/quality/')}</div><ol class="planning-list"><li><h3>The setting</h3><p>Describe the aquarium, its intended layout and whether it is an existing or proposed project.</p></li><li><h3>The visual direction</h3><p>Share the colours, silhouettes or illustrated studies that caught your eye.</p></li><li><h3>The practical questions</h3><p>Ask about identification, compatibility, care requirements and suitability before making a real selection.</p></li></ol></div></section>
    {siblings(c)}{invitation('Let’s start with your setting.', 'Build a fish enquiry preview with the visual direction and practical questions you want to explore.', enquiry_url(c), c['action'])}'''


def plants():
    c = CATEGORIES[1]
    return f'''<section class="category-intro plant-intro"><div class="wrap">{breadcrumb(c['name'], True)}<div class="detail-split"><div><p class="eyebrow">Collection 02 · Texture & depth</p><h1>Aquatic<br><em>Plants</em></h1><p class="lead">The landscape, in layers.</p><p>A broad leaf catches the light. Fine stems soften an edge. Plant forms bring texture, depth and a sense of atmosphere to the scene.</p>{link(c['action'], enquiry_url(c), 'button')}</div><figure>{image(c['image'], c['alt'], 'plant-feature', True)}<figcaption>Green textures and leafy layers · illustrative study</figcaption></figure></div></div></section>
    <section class="section dark"><div class="wrap plant-palette"><figure>{image('highlight-red-plants', 'Illustrated bronze and red aquatic leaves against green foliage')}<figcaption>Palette study · green, bronze and red</figcaption></figure><div><p class="eyebrow">A considered palette</p><h2>Quiet greens.<br><em>A little contrast.</em></h2><p>Combine fine and broad textures to create depth. An accent of bronze or red can draw attention to a chosen part of the composition.</p><p>Use these images to describe a mood, rather than to specify a species. Confirm plant identification and suitability with a specialist.</p></div></div></section>
    <section class="section"><div class="wrap planning-layout"><div><p class="eyebrow">Plan the layers</p><h2>Think from<br>front to back.</h2><p>Sketch where texture, height and open water might sit. This is a visual planning exercise, not a planting or care prescription.</p></div><ol class="planning-list"><li><h3>Foreground · establish space</h3><p>Decide where the eye enters the scene and how much open area supports the composition.</p></li><li><h3>Middle · connect the elements</h3><p>Explore leaf shapes and textures around the hardscape. Look for transitions rather than isolated pieces.</p></li><li><h3>Background · shape the view</h3><p>Consider height and density as a backdrop. Include questions about lighting, maintenance and suitability in your brief.</p></li></ol></div></section>
    {siblings(c)}{invitation('Describe the landscape you imagine.', 'Share a palette, a layout and the practical questions behind your planting idea.', enquiry_url(c), c['action'])}'''


def wood():
    c = CATEGORIES[2]
    return f'''<section class="wood-intro dark"><div class="wrap">{breadcrumb(c['name'], True)}<div class="section-heading"><div><p class="eyebrow">Collection 03 · Structure & character</p><h1>Driftwood.<br><em>Nature draws the line.</em></h1></div><div class="heading-side"><p class="lead">The shape of the scene.</p><p>Branching forms and weathered textures give a composition its framework. Begin with the direction of a line, and let the landscape gather around it.</p>{link(c['action'], enquiry_url(c), 'button')}</div></div><figure class="wood-panorama">{image(c['image'], c['alt'], eager=True, sizes='100vw')}<figcaption>Branch, grain and negative space · illustrative material study</figcaption></figure></div></section>
    <section class="section"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">Reading the material</p><h2>Character is<br>in the irregularities.</h2></div><p class="heading-side">A strong composition can begin with one distinctive form. Consider how it directs the eye, frames a view and leaves space for other elements.</p></div><div class="three-notes light-notes"><div><span>01 / Line</span><h3>Follow the branches</h3><p>A rising branch introduces height; a low sweep suggests a wider landscape. Try different orientations in a sketch.</p></div><div><span>02 / Space</span><h3>Let the gaps matter</h3><p>Open areas between branches are part of the design. Think about sightlines and the relationship to the planting.</p></div><div><span>03 / Scale</span><h3>Relate it to the setting</h3><p>A compelling shape still needs to fit. Describe the available footprint and the intended visual balance.</p></div></div></div></section>
    <section class="section tinted"><div class="wrap planning-layout"><div><p class="eyebrow">Your hardscape brief</p><h2>From a natural form<br>to a considered plan.</h2><p>These images suggest a visual direction. They do not verify wood type, dimensions or aquarium suitability.</p></div><div class="checklist"><h3>Useful details to include</h3><ul><li>The proposed aquarium footprint and layout</li><li>A sketch of the desired branch direction</li><li>The balance between open space and planting</li><li>Questions about material identity, preparation and suitability</li></ul>{link('Explore our quality principles', '/quality/')}</div></div></section>
    {siblings(c)}{invitation('Start with a line. Shape a landscape.', 'Prepare a hardscape enquiry preview around your space, preferred form and material questions.', enquiry_url(c), c['action'])}'''


def story():
    return f'''<section class="section story-intro"><div class="wrap">{breadcrumb('Our Story')}<div class="editorial-title"><p class="eyebrow">Our story · A proposed perspective</p><h1>Nature is closer<br><em>than we think.</em></h1><p class="lead">A pause at the water’s edge.<br>A closer look at a leaf. A world within a world.</p></div><figure class="waterfront">{image('heritage-waterfront', 'Illustrated Singapore-inspired waterfront with gardens, skyline and open water', eager=True, sizes='100vw')}<figcaption>A Singapore-inspired waterfront illustration. A visual inspiration, not a company location.</figcaption></figure></div></section>
    <section class="section story-narrative"><div class="wrap editorial-grid"><div><p class="eyebrow">Nature, water & people</p><h2>A connection<br>worth making.</h2></div><div><p class="lead">An aquarium can be a small invitation to notice more.</p><p>The interplay of water, movement and natural forms changes the way a space feels. It asks us to slow down, look closely and consider how individual elements belong together.</p><p>Aquatic World imagines a place for that curiosity: a considered collection of fish, plants and driftwood, and a clear path from visual inspiration to thoughtful project questions.</p><p class="small muted">This story expresses the proposed brand idea. It is not a record of an established company, its history or its operations.</p></div></div></section>
    <section class="section story-values dark"><div class="wrap"><p class="eyebrow">The ideas that guide the concept</p><div class="value-row"><span>01</span><h3>Notice the detail.</h3><p>Look at a fin, a leaf or a branching line before looking at the whole.</p></div><div class="value-row"><span>02</span><h3>Consider the connection.</h3><p>Think about how the elements relate to one another, their setting and the people caring for them.</p></div><div class="value-row"><span>03</span><h3>Stay curious.</h3><p>Ask useful questions. Leave room for specialist knowledge and a better-informed next step.</p></div></div></section>
    {invitation('Find your own starting point.', 'Explore the three collections and see which detail draws you in.', '/collections/', 'Explore the collections')}'''


def quality():
    principles = [
        ('Begin with the setting', 'A selection should make sense in context.', 'Describe the project, its scale, the existing layout and who will look after it. A visual idea becomes more useful when its practical setting is clear.', 'What is already in the space, and what needs to change?'),
        ('Look closely at each element', 'The details should inform the decision.', 'Use the illustrated studies to discuss form, texture and visual balance. For a real selection, ask for clear identification and current information about the actual item.', 'What can be confirmed about the item being considered?'),
        ('Bring specialist questions forward', 'Good questions belong at the beginning.', 'Compatibility, care and material suitability need informed guidance. Record uncertainties alongside preferences, rather than treating appearance as the only criterion.', 'What needs a qualified aquatic specialist’s advice?'),
        ('Plan the next steps', 'A clear brief makes expectations visible.', 'Clarify the information, preparation and ongoing responsibilities a real project would require. Avoid assuming availability, handling or delivery arrangements from a picture.', 'What should be agreed before any real commitment?'),
    ]
    return f'''<section class="section quality-intro"><div class="wrap">{breadcrumb('Quality')}<div class="section-heading"><div><p class="eyebrow">Our proposed approach</p><h1>Thoughtful choices.<br><em>From the start.</em></h1></div><div class="heading-side"><p class="lead">Quality begins with attention, context and clear expectations.</p><p>These are proposed selection principles for the Aquatic World concept, not claims about a verified process or certification.</p>{link('Discuss your requirements', '/contact/#enquiry', 'button')}</div></div><div class="process-index" aria-label="Four principles"><span>01 / Context</span><span>02 / Observation</span><span>03 / Guidance</span><span>04 / Preparation</span></div></div></section>
    <section class="quality-principles dark"><div class="wrap">{''.join(f'<article class="principle"><span class="principle-number">0{i+1}</span><div><p class="eyebrow">{sub}</p><h2>{title}</h2><p>{body}</p></div><aside><span class="eyebrow">A question to carry forward</span><p>{question}</p></aside></article>' for i,(title,sub,body,question) in enumerate(principles))}</div></section>
    <section class="section"><div class="wrap planning-layout"><div><p class="eyebrow">Useful questions</p><h2>Make uncertainty<br>part of the brief.</h2><p>A clear question is a valuable starting point. These prompts can help you prepare a conversation about a real project.</p></div><div class="questions"><details open><summary>What should I share about my project?</summary><p>Include the setting, whether the aquarium is new or established, your preferred visual direction and any practical constraints you already know.</p></details><details><summary>Do these images show available items?</summary><p>No. All images are illustrative studies. They do not establish stock, species identity, dimensions or the condition of a real item.</p></details><details><summary>Where does specialist guidance fit?</summary><p>Use qualified guidance to confirm identification, compatibility, care and material suitability before any real selection.</p></details><details><summary>Can I send an enquiry from this site?</summary><p>This demo creates a local preview only. Nothing is sent, and no contact service is connected.</p></details></div></div></section>
    {invitation('Bring your questions with you.', 'A useful enquiry combines the idea you love with the information you still need.', '/contact/#enquiry', 'Prepare an enquiry brief')}'''


def contact():
    options = ''.join(f'<option value="{c["slug"]}">{c["name"]}</option>' for c in CATEGORIES)
    return f'''<section class="section contact-section"><div class="wrap">{breadcrumb('Contact')}<div class="contact-grid">
    <div class="form-panel" id="enquiry"><h1 id="contact-title">Your project brief</h1><p class="local-disclosure" id="local-disclosure" hidden>Local preview only. Nothing is sent or saved.</p>
    <noscript><p class="local-disclosure">Preview needs JavaScript; nothing can be sent or saved. You can still browse the site and use the brief guidance below.</p></noscript>
    <form id="enquiry-form" aria-labelledby="contact-title" novalidate><div class="error-summary" id="error-summary" tabindex="-1" role="alert" hidden></div><fieldset id="enquiry-fields" disabled>
      <div class="field"><label for="name">Name <span>(required)</span></label><input id="name" name="name" autocomplete="name" maxlength="100" required aria-describedby="name-error"><p class="field-error" id="name-error" hidden></p></div>
      <div class="field"><label for="email">Email <span>(required)</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required aria-describedby="email-error"><p class="field-error" id="email-error" hidden></p></div>
      <div class="field field-wide"><label for="category">Collection</label><select id="category" name="category" aria-describedby="category-context"><option value="general">Not sure yet</option>{options}</select><p class="field-hint" id="category-context">Not sure yet includes a complete aquascape or an open idea.</p></div>
      <div class="field field-wide"><label for="project">Project <span>(required)</span></label><textarea id="project" name="project" rows="5" minlength="20" maxlength="2000" required aria-describedby="project-hint project-error" placeholder="Your setting, visual direction and questions…"></textarea><p class="field-hint" id="project-hint">20–2,000 characters. Use illustrative details.</p><p class="field-error" id="project-error" hidden></p></div>
      <div class="form-actions field-wide"><button class="button" id="preview-button" type="submit" disabled>Preview enquiry <span class="arrow" aria-hidden="true">↗</span></button><button class="text-button" id="clear-brief" type="reset">Clear brief</button></div><p class="field-hint field-wide" id="form-status" role="status"></p>
    </fieldset></form><section class="preview-result" id="preview-result" tabindex="-1" aria-labelledby="preview-title" hidden><h2 id="preview-title">Preview created. Nothing was sent.</h2><dl id="preview-content"></dl><div class="form-actions"><button class="text-button" id="edit-brief" type="button">Return to edit <span aria-hidden="true">↗</span></button><button class="text-button" id="clear-preview" type="button">Clear brief</button></div></section></div>
    <aside class="contact-secondary" aria-label="Brief guidance"><details class="contact-help"><summary>Help with your brief</summary><p>Start with your setting, preferred colours or materials, and the practical questions you want to explore. Include dimensions or timing in Project if useful; a rough idea is enough.</p><p>Choose “Not sure yet” for a complete aquascape. Review your preview, return to edit, or clear the brief to start again.</p>{link('Explore the collections', '/collections/')}</details><figure class="contact-photo">{image('enquiry-underwater-school', 'Illustrated small fish among an underwater landscape')}<figcaption>Imagine the possibilities.</figcaption></figure></aside></div></div></section>'''


def not_found():
    return '''<section class="section not-found"><div class="wrap"><p class="eyebrow">404 · Uncharted waters</p><h1>This page is<br><em>out of the picture.</em></h1><p class="lead">The address may be incomplete, or this destination may not exist. Let’s find your way back.</p><div class="actions">''' + link('Back to Home', '/', 'button') + link('Explore collections', '/collections/') + '</div></div></section>'


PAGES = [
    ("/", "A closer connection to nature", "Explore the Aquatic World concept through ornamental fish, aquatic plants and natural driftwood.", home),
    ("/collections/", "Collections", "Discover three aquatic collection families: ornamental fish, aquatic plants and driftwood.", collections),
    ("/collections/ornamental-fish/", "Ornamental Fish", "Explore illustrative ornamental fish studies, visual character and useful project questions.", fish),
    ("/collections/aquatic-plants/", "Aquatic Plants", "Explore plant textures, a green and bronze palette, and layered aquascape planning.", plants),
    ("/collections/driftwood/", "Driftwood", "Consider branching lines, material texture, scale and space in a driftwood composition.", wood),
    ("/our-story/", "Our Story", "A proposed brand perspective on the connections between nature, water and people.", story),
    ("/quality/", "Quality", "Four proposed principles for thoughtful selection, useful questions and clear expectations.", quality),
    ("/contact/", "Contact — Enquiry preview", "Prepare a local enquiry preview. No message is sent and no contact service is connected.", contact),
    ("/404.html", "Page not found", "Find your way back to the Aquatic World collections.", not_found),
]


def document(route, title, description, render):
    home_resources = '<link rel="stylesheet" href="/home-motion.css"><script src="/home-motion.js" defer></script><link rel="stylesheet" href="/ecosystem-home.css">' if route == '/' else ''
    opening = '<body class="home-immersive">' + home_environment() if route == '/' else '<body>'
    utility = home_motion_control() if route == '/' else ''
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{escape(title)} | Aquatic World</title><meta name="description" content="{escape(description)}"><meta name="theme-color" content="#061c26"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><script src="/script.js" defer></script>{home_resources}</head>
{opening}{header(route)}<main id="main" tabindex="-1">{render()}</main>{footer(route)}{utility}</body></html>'''


OUT.mkdir(exist_ok=True)
for route, title, description, render in PAGES:
    target = OUT / ("404.html" if route == "/404.html" else route.strip("/") + "/index.html" if route != "/" else "index.html")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(document(route, title, description, render))
for file in ["styles.css", "script.js", "home-motion.css", "home-motion.js", "ecosystem-home.css", "favicon.svg"]:
    shutil.copyfile(ROOT / file, OUT / file)
shutil.copytree(ROOT / "assets", OUT / "assets", dirs_exist_ok=True)
shutil.copytree(ROOT / "playback-comparison", OUT / "playback-comparison", dirs_exist_ok=True)
print(f"Built {len(PAGES)-1} independent pages plus 404 in {OUT}")
