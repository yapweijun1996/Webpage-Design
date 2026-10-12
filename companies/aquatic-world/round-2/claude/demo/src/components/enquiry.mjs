import { esc, attr, lines, image, arrow } from './lib.mjs';
import { SideNote } from './hero.mjs';

function PreviewForm(e, collections) {
  const f = e.form;
  const field = (id, label, input, required) => `<div class="field" data-field="${id}">
          <label for="enq-${id}">${esc(label)}${required ? ' <span aria-hidden="true">*</span>' : ''}</label>
          ${input}
          <p class="field__error" id="enq-${id}-error" hidden></p>
        </div>`;
  return `<form class="enquiry-form" id="enquiry-form" data-enquiry-form novalidate hidden aria-labelledby="enquiry-form-title"
      data-error-name="${attr(f.errors.name)}" data-error-email="${attr(f.errors.email)}" data-error-message="${attr(f.errors.message)}">
      <h3 class="enquiry-form__title" id="enquiry-form-title" tabindex="-1">${esc(f.heading)}</h3>
      <p class="enquiry-form__intro">${esc(f.intro)}</p>
      <div class="enquiry-form__summary" data-error-summary role="alert" tabindex="-1" hidden>
        <p>${esc(f.errorSummary)}</p>
        <ul></ul>
      </div>
      <div class="enquiry-form__grid">
        ${field('name', f.fields.name, '<input id="enq-name" name="name" type="text" autocomplete="name" required aria-required="true">', true)}
        ${field('company', f.fields.company, '<input id="enq-company" name="company" type="text" autocomplete="organization">', false)}
        ${field('email', f.fields.email, '<input id="enq-email" name="email" type="email" autocomplete="email" required aria-required="true">', true)}
        ${field('topic', f.fields.topic, `<select id="enq-topic" name="topic"><option value="">${esc(f.fields.topicAny)}</option>${collections.map((c) => `<option value="${attr(c.id)}">${esc(c.title)}</option>`).join('')}</select>`, false)}
        ${field('message', f.fields.message, '<textarea id="enq-message" name="message" rows="4" required aria-required="true"></textarea>', true)}
      </div>
      <button class="btn btn--gold" type="submit">${esc(f.submitLabel)}</button>
      <p class="enquiry-form__result" data-form-result role="status" aria-live="polite" hidden>${esc(f.previewResult)}</p>
    </form>`;
}

export function Enquiry({ site, home, ctx, collections }) {
  const e = home.enquiry;
  // Only a configured, verified email produces a real contact link; there is no form backend in this build.
  const contactHref = site.contact.email ? `mailto:${site.contact.email}` : null;
  const preview = site.features.enableEnquiryPreview && !contactHref;
  return `<section class="enquiry" id="enquiry" aria-labelledby="enquiry-title">
  <div class="section-bg" aria-hidden="true">${image({ ...e.background, alt: '' }, { ctx, sizes: '100vw', className: 'section-bg__img' })}</div>
  <div class="container enquiry__inner">
    <div class="enquiry__content">
      <p class="eyebrow eyebrow--light">${esc(e.eyebrow)}</p>
      <h2 class="section-title" id="enquiry-title">${esc(e.heading)}</h2>
      <p class="enquiry__lead">${esc(e.description)}</p>
      ${contactHref
        ? `<a class="btn btn--gold" href="${attr(contactHref)}">${esc(e.previewToggleLabel)}${arrow()}</a>`
        : `<p class="enquiry__notice" id="enquiry-notice"><strong>${esc(site.ui.demoLabel)}:</strong> ${esc(e.unavailableNotice)}</p>`}
      ${preview ? `<button class="btn btn--gold" type="button" data-form-toggle aria-expanded="false" aria-controls="enquiry-form" aria-describedby="enquiry-notice" hidden>${esc(e.previewToggleLabel)}${arrow()}</button>` : ''}
    </div>
    ${preview ? PreviewForm(e, collections) : ''}
    ${e.signature ? `<p class="enquiry__signature" aria-hidden="true">${lines(e.signature)}</p>` : ''}
    ${SideNote(e.sideNote, 'side-note--enquiry')}
  </div>
</section>`;
}
