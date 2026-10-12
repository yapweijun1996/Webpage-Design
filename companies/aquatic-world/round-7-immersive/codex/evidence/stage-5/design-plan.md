# Stage 5 focused footer plan

Inspect only this implementation's Home footer markup and relevant CSS cascade. Home currently uses `body.home-immersive` and `footer.home-footer`, without `site-footer`; the generic `.site-footer` background cannot match it. The Home background shorthand supplies a transparent background color and a soft gradient from alpha 0 to 194/255, with no opaque stop. No footer pseudo-element wash is declared.

Keep the existing implementation if the focused source/output check confirms this cascade. Preserve footer links, disclosure, responsive padding and motion-control clearance. Build with the existing builder, compare pre/post file hashes, and record source/output evidence. Do not run a browser, server, geometry suite or prior evidence scripts. Actual computed style and rendered checks at 390×844 and 1440×900 remain coordinator-owned and not tested here.
