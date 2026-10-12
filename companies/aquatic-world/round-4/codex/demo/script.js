(() => {
  const menu = document.querySelector('.mobile-menu');
  const menuControl = menu.querySelector('summary');
  function closeMenu(restoreFocus = false) {
    const focusWasInside = menu.contains(document.activeElement);
    menu.open = false;
    if (restoreFocus || focusWasInside) menuControl.focus();
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) closeMenu();
  });
  const compactWidth = window.matchMedia('(max-width: 1119px)');
  compactWidth.addEventListener('change', event => {
    if (!event.matches) {
      const focusedLink = menu.contains(document.activeElement) && document.activeElement.closest('a');
      const href = focusedLink && focusedLink.getAttribute('href');
      const focusWasInside = menu.contains(document.activeElement);
      menu.open = false;
      if (focusWasInside) {
        const destination = href && Array.from(document.querySelectorAll('.desktop-nav a, .header-cta'))
          .find(anchor => anchor.getAttribute('href') === href);
        (destination || document.querySelector('.site-header .brand')).focus();
      }
    }
  });

  const form = document.querySelector('#enquiry-form');
  if (!form) return;
  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    project: form.elements.project
  };
  const category = form.elements.category;
  const context = document.querySelector('#category-context');
  const summary = document.querySelector('#error-summary');
  const result = document.querySelector('#preview-result');
  const output = document.querySelector('#preview-content');
  const previewButton = document.querySelector('#preview-button');
  const status = document.querySelector('#form-status');
  let attempted = false;
  const selected = new URLSearchParams(window.location.search).get('category');
  const allowed = Array.from(category.options).map(option => option.value);
  if (allowed.includes(selected)) category.value = selected;
  function updateContext() {
    const label = category.selectedOptions[0].textContent;
    context.textContent = category.value === 'general'
      ? 'Start with a collection, or explore a complete aquascape.'
      : `Your enquiry focus: ${label}. You can change it below.`;
    result.hidden = true;
    status.textContent = '';
  }
  updateContext();
  category.addEventListener('change', updateContext);
  previewButton.disabled = false;

  function validate(field) {
    const value = field.value.trim();
    if (field.name === 'name' && !value) return 'Enter a name for your sample brief.';
    if (field.name === 'email' && (!value || field.validity.typeMismatch)) return 'Enter a valid sample email address, such as name@example.com.';
    if (field.name === 'project' && value.length < 20) return 'Describe your idea in at least 20 characters.';
    if (field.name === 'project' && value.length > 2000) return 'Keep your project description within 2,000 characters.';
    return '';
  }
  function fieldError(field) {
    const message = validate(field);
    const error = document.querySelector(`#${field.name}-error`);
    error.textContent = message;
    error.hidden = !message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return message;
  }
  function updateSummary() {
    const invalid = Object.values(fields).filter(field => validate(field));
    summary.replaceChildren();
    summary.hidden = invalid.length === 0;
    if (!invalid.length) return;
    const heading = document.createElement('strong');
    heading.textContent = `Please check ${invalid.length} ${invalid.length === 1 ? 'field' : 'fields'} before previewing.`;
    const list = document.createElement('ul');
    invalid.forEach(field => {
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = `#${field.id}`;
      anchor.textContent = validate(field);
      anchor.addEventListener('click', event => {
        event.preventDefault();
        field.focus();
      });
      item.append(anchor);
      list.append(item);
    });
    summary.append(heading, list);
  }
  Object.values(fields).forEach(field => {
    field.addEventListener('input', () => {
      result.hidden = true;
      status.textContent = '';
      if (attempted) {
        fieldError(field);
        updateSummary();
      }
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    attempted = true;
    result.hidden = true;
    status.textContent = '';
    Object.values(fields).forEach(fieldError);
    updateSummary();
    if (!summary.hidden) {
      summary.focus();
      return;
    }
    output.replaceChildren();
    const entries = [
      ['Name', fields.name.value.trim()],
      ['Sample email', fields.email.value.trim()],
      ['Collection', category.value === 'general' ? 'Not sure yet / A complete aquascape' : category.selectedOptions[0].textContent],
      ['Project or idea', fields.project.value.trim()]
    ];
    entries.forEach(([label, value]) => {
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = value;
      output.append(term, description);
    });
    result.hidden = false;
    result.focus();
  });
  document.querySelector('#edit-brief').addEventListener('click', () => {
    result.hidden = true;
    fields.project.focus();
  });
  form.addEventListener('reset', event => {
    event.preventDefault();
    // Prevent native defaults from losing an incoming category's enquiry context.
    Object.values(fields).forEach(field => {
      field.value = '';
      field.removeAttribute('aria-invalid');
      const error = document.querySelector(`#${field.name}-error`);
      error.textContent = '';
      error.hidden = true;
    });
    category.value = allowed.includes(selected) ? selected : 'general';
    attempted = false;
    summary.replaceChildren();
    summary.hidden = true;
    output.replaceChildren();
    updateContext();
    status.textContent = 'Brief cleared. Nothing was saved or sent.';
    fields.name.focus();
  });
})();
