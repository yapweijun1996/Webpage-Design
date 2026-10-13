"""The shared brand, destinations and collection content for this static demo."""

BRAND = {"name": "Aquatic World", "tagline": "Nature connects us all"}
NAV = [
    ("Home", "/"),
    ("Collections", "/collections/"),
    ("Our Story", "/our-story/"),
    ("Quality", "/quality/"),
    ("Contact", "/contact/"),
]
CATEGORIES = [
    {
        "slug": "ornamental-fish", "name": "Ornamental Fish", "number": "01",
        "image": "collection-ornamental-fish", "alt": "Illustrated fish with flowing red fins and blue scales",
        "theme": "Colour & movement", "summary": "Expressive colour. Sculptural silhouettes. A living focal point for an aquatic world.",
        "short": "The living focal point", "action": "Prepare a fish enquiry",
    },
    {
        "slug": "aquatic-plants", "name": "Aquatic Plants", "number": "02",
        "image": "collection-aquatic-plants", "alt": "Illustrated underwater garden with broad green leaves and fine grasses",
        "theme": "Texture & depth", "summary": "From fine textures to generous leaves, explore the layers that give an aquascape its atmosphere.",
        "short": "The landscape, in layers", "action": "Prepare a plant enquiry",
    },
    {
        "slug": "driftwood", "name": "Driftwood", "number": "03",
        "image": "collection-driftwood", "alt": "Illustrated branching driftwood with textured grain in dark water",
        "theme": "Structure & character", "summary": "Branching lines, weathered grain and open space. Find the structure around which a composition can grow.",
        "short": "The shape of the scene", "action": "Prepare a hardscape enquiry",
    },
]


def category_url(category):
    return f'/collections/{category["slug"]}/'


def enquiry_url(category):
    return f'/contact/?category={category["slug"]}#enquiry'
