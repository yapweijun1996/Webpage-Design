# Stage 4 design/state plan

The controller assigns `.hidden` on SVG icons, which does not reliably reflect the real attribute. Replace only these two assignments with `toggleAttribute('hidden', condition)` using the existing action state. Eligible motion must expose Pause, manual Pause must expose Play with Resume background as its action, and explicit Resume must expose Pause again.

Keep markup, CSS, playback decisions, media, layout and copy unchanged. Build with the existing Python builder. Run one focused Node check against source and generated render code with attribute-backed SVG doubles whose `.hidden` properties deliberately disagree; assert real attributes and accessible actions across the three states. Confirm existing hidden CSS. Rendered browser verification remains unavailable and belongs to the coordinator.
