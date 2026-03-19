/* ============================================
   MARINA TOWERS — Owner Listing Form JS
   ============================================ */

(function initListingForm() {
  const form       = document.getElementById('listingForm');
  const formCard   = document.getElementById('formCard');
  const success    = document.getElementById('successState');
  const alertArea  = document.getElementById('alertArea');
  const submitBtn  = document.getElementById('submitBtn');
  const dropZone   = document.getElementById('dropZone');
  const photoInput = document.getElementById('photoInput');
  const previewGrid= document.getElementById('previewGrid');
  if (!form) return;

  let uploadedPhotos = []; // array of data URLs

  // ── Service type selection ─────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      card.querySelector('input[type="radio"]').checked = true;
    });
  });

  // ── File upload ────────────────────────────
  dropZone.addEventListener('click', () => photoInput.click());
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });
  photoInput.addEventListener('change', e => handleFiles(e.target.files));

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" exceeds 5MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedPhotos.push(e.target.result);
        renderPreviews();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPreviews() {
    previewGrid.innerHTML = uploadedPhotos.map((src, i) => `
      <div class="file-preview-item">
        <img src="${src}" alt="Photo ${i+1}" />
        <button class="file-preview-remove" data-idx="${i}" title="Remove">✕</button>
        ${i === 0 ? '<span style="position:absolute;bottom:4px;left:4px;background:var(--gold);color:#07090f;font-size:9px;font-weight:600;padding:2px 6px;border-radius:2px;letter-spacing:0.05em">COVER</span>' : ''}
      </div>
    `).join('');
    previewGrid.querySelectorAll('.file-preview-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        uploadedPhotos.splice(parseInt(btn.dataset.idx), 1);
        renderPreviews();
      });
    });
  }

  // ── Validation ─────────────────────────────
  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function validate() {
    const required = [
      { id: 'ownerName',    label: 'Full name' },
      { id: 'ownerEmail',   label: 'Email address' },
      { id: 'ownerPhone',   label: 'Phone / WhatsApp' },
      { id: 'unitNumber',   label: 'Unit number' },
      { id: 'tower',        label: 'Tower' },
      { id: 'apartmentType',label: 'Apartment type' },
      { id: 'bedrooms',     label: 'Bedrooms' },
      { id: 'maxGuests',    label: 'Max guests' },
      { id: 'availableFrom',label: 'Available from date' },
      { id: 'availableTo',  label: 'Available to date' },
      { id: 'minimumStay',  label: 'Minimum stay' },
      { id: 'price',        label: 'Nightly price' },
    ];
    for (const { id, label } of required) {
      if (!getVal(id)) return `Please fill in: ${label}.`;
    }
    const from = new Date(getVal('availableFrom'));
    const to   = new Date(getVal('availableTo'));
    if (to <= from) return 'Available-to date must be after available-from date.';
    const email = getVal('ownerEmail');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    return null;
  }

  // ── Submit ─────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      Utils.showAlert(alertArea, 'error', error);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loader"></span> Submitting...';

    // Simulate brief async delay
    setTimeout(() => {
      const serviceType = document.querySelector('input[name="serviceType"]:checked')?.value || 'basic';
      const rawTitle    = getVal('listingTitle');
      const bedrooms    = parseInt(getVal('bedrooms')) || 1;
      const tower       = getVal('tower');
      const aptType     = getVal('apartmentType');

      // Auto-generate title if blank
      const title = rawTitle || `${bedrooms} Bedroom ${aptType} — ${tower}`;

      const listingData = {
        ownerName:      getVal('ownerName'),
        ownerEmail:     getVal('ownerEmail'),
        ownerPhone:     getVal('ownerPhone'),
        unitNumber:     getVal('unitNumber'),
        tower,
        apartmentType:  aptType,
        bedrooms,
        maxGuests:      parseInt(getVal('maxGuests')) || 2,
        availableFrom:  getVal('availableFrom'),
        availableTo:    getVal('availableTo'),
        minimumStay:    parseInt(getVal('minimumStay')) || 1,
        price:          parseFloat(getVal('price')) || 0,
        optimizePricing:document.getElementById('optimizePricing').checked,
        serviceType,
        notes:          getVal('notes'),
        title,
        description:    getVal('listingDescription'),
        photos:         uploadedPhotos,
        amenities:      [],
      };

      DB.addListing(listingData);

      // Show success
      formCard.style.display = 'none';
      success.style.display  = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }, 900);
  });

})();
