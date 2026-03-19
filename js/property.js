/* ============================================
   MARINA TOWERS — Property Detail Page JS
   ============================================ */

(function initProperty() {
  const id = Utils.getQueryParam('id');
  if (!id) { showNotFound(); return; }

  const listing = DB.getListing(id);
  if (!listing || listing.status !== 'approved') { showNotFound(); return; }

  document.getElementById('propertyContent').style.display = 'block';
  document.title = `${listing.title} — Marina Towers`;

  // ── Gallery ────────────────────────────────
  const photos      = listing.photos || [];
  const mainEl      = document.getElementById('galleryMain');
  const thumbsEl    = document.getElementById('galleryThumbs');
  const placeholder = document.getElementById('galleryPlaceholder');
  let currentPhoto  = 0;

  if (photos.length > 0) {
    placeholder.style.display = 'none';
    // Main image
    const mainImg = document.createElement('img');
    mainImg.src = photos[0];
    mainImg.alt = listing.title;
    mainEl.appendChild(mainImg);

    // Thumbs
    photos.forEach((src, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
      thumb.innerHTML = `<img src="${Utils.escapeHtml(src)}" alt="Photo ${i+1}" loading="lazy" />`;
      thumb.addEventListener('click', () => setPhoto(i));
      thumbsEl.appendChild(thumb);
    });

    // Main click → lightbox
    mainEl.addEventListener('click', () => openLightbox(currentPhoto));
  }

  function setPhoto(i) {
    currentPhoto = i;
    const mainImg = mainEl.querySelector('img');
    if (mainImg) mainImg.src = photos[i];
    thumbsEl.querySelectorAll('.gallery-thumb').forEach((t, ti) => {
      t.classList.toggle('active', ti === i);
    });
  }

  // ── Lightbox ───────────────────────────────
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbClose    = document.getElementById('lightboxClose');
  const lbPrev     = document.getElementById('lightboxPrev');
  const lbNext     = document.getElementById('lightboxNext');

  function openLightbox(i) {
    if (!photos.length) return;
    currentPhoto = i;
    lbImg.src = photos[i];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  lbClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  lbPrev?.addEventListener('click', () => {
    const i = (currentPhoto - 1 + photos.length) % photos.length;
    currentPhoto = i; lbImg.src = photos[i]; setPhoto(i);
  });
  lbNext?.addEventListener('click', () => {
    const i = (currentPhoto + 1) % photos.length;
    currentPhoto = i; lbImg.src = photos[i]; setPhoto(i);
  });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev?.click();
    if (e.key === 'ArrowRight') lbNext?.click();
  });

  // ── Populate Details ───────────────────────
  document.getElementById('breadcrumbTitle').textContent = listing.title;
  document.getElementById('propTower').textContent       = listing.tower || '';
  document.getElementById('propTitle').textContent       = listing.title;
  document.getElementById('propPrice').textContent       = Utils.formatCurrency(listing.price);
  document.getElementById('propDesc').textContent        = listing.description || '';

  // Meta row
  const metaItems = [
    { icon: '🛏', label: `${listing.bedrooms} Bedroom${listing.bedrooms !== 1 ? 's' : ''}` },
    { icon: '👥', label: `Up to ${listing.maxGuests} Guests` },
    { icon: '🏛', label: listing.apartmentType || '' },
    { icon: '🌙', label: `${listing.minimumStay}+ Night Minimum` },
    { icon: '✦',  label: listing.serviceType === 'full' ? 'Full Service' : 'Basic Listing' },
  ].filter(m => m.label);

  document.getElementById('propMeta').innerHTML = metaItems.map(m =>
    `<div class="property-meta-item"><span>${m.icon}</span><span>${Utils.escapeHtml(m.label)}</span></div>`
  ).join('');

  // Amenities
  if (listing.amenities && listing.amenities.length > 0) {
    const sec = document.getElementById('amenitiesSection');
    sec.style.display = 'block';
    document.getElementById('amenitiesGrid').innerHTML = listing.amenities.map(a =>
      `<div class="amenity-item"><div class="amenity-dot"></div><span>${Utils.escapeHtml(a)}</span></div>`
    ).join('');
  }

  // Availability
  document.getElementById('availRow').innerHTML = `
    <div class="avail-item">
      <div class="avail-label">Available From</div>
      <div class="avail-value">${Utils.formatDate(listing.availableFrom)}</div>
    </div>
    <div class="avail-item">
      <div class="avail-label">Available Until</div>
      <div class="avail-value">${Utils.formatDate(listing.availableTo)}</div>
    </div>
    <div class="avail-item">
      <div class="avail-label">Min. Stay</div>
      <div class="avail-value">${listing.minimumStay} Night${listing.minimumStay !== 1 ? 's' : ''}</div>
    </div>`;

  // Notes
  if (listing.notes) {
    document.getElementById('notesSection').style.display = 'block';
    document.getElementById('notesText').textContent = listing.notes;
  }

  // ── Booking Form ───────────────────────────
  const bookingForm = document.getElementById('bookingForm');
  const bookingBtn  = document.getElementById('bookingBtn');
  const bookingAlert= document.getElementById('bookingAlert');
  const checkInEl   = document.getElementById('checkIn');
  const checkOutEl  = document.getElementById('checkOut');
  const costSummary = document.getElementById('costSummary');

  // Pre-fill from query params if present
  const qIn  = Utils.getQueryParam('checkIn');
  const qOut = Utils.getQueryParam('checkOut');
  if (qIn)  checkInEl.value  = qIn;
  if (qOut) checkOutEl.value = qOut;

  // Set min date
  const today = new Date().toISOString().split('T')[0];
  checkInEl.min  = today;
  checkOutEl.min = today;

  // Dynamic cost preview
  function updateCost() {
    const ci = checkInEl.value, co = checkOutEl.value;
    if (!ci || !co) { costSummary.style.display = 'none'; return; }
    const nights = Utils.nightsBetween(ci, co);
    if (nights <= 0) { costSummary.style.display = 'none'; return; }
    const total = nights * listing.price;
    document.getElementById('nightsLabel').textContent = `${nights} Night${nights !== 1 ? 's' : ''} × ${Utils.formatCurrency(listing.price)}`;
    document.getElementById('nightsCost').textContent  = Utils.formatCurrency(total);
    document.getElementById('totalCost').textContent   = Utils.formatCurrency(total);
    costSummary.style.display = 'block';
  }
  checkInEl.addEventListener('change', () => {
    if (checkInEl.value) checkOutEl.min = checkInEl.value;
    updateCost();
  });
  checkOutEl.addEventListener('change', updateCost);

  // Validate & submit
  bookingForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name   = document.getElementById('guestName').value.trim();
    const email  = document.getElementById('guestEmail').value.trim();
    const phone  = document.getElementById('guestPhone').value.trim();
    const ci     = checkInEl.value;
    const co     = checkOutEl.value;
    const guests = document.getElementById('numGuests').value;
    const notes  = document.getElementById('specialRequests').value.trim();

    if (!name)   { Utils.showAlert(bookingAlert, 'error', 'Please enter your full name.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { Utils.showAlert(bookingAlert, 'error', 'Please enter a valid email.'); return; }
    if (!phone)  { Utils.showAlert(bookingAlert, 'error', 'Please enter your phone number.'); return; }
    if (!ci)     { Utils.showAlert(bookingAlert, 'error', 'Please select a check-in date.'); return; }
    if (!co)     { Utils.showAlert(bookingAlert, 'error', 'Please select a check-out date.'); return; }
    if (!guests) { Utils.showAlert(bookingAlert, 'error', 'Please select number of guests.'); return; }

    const nights = Utils.nightsBetween(ci, co);
    if (nights < listing.minimumStay) {
      Utils.showAlert(bookingAlert, 'error', `Minimum stay is ${listing.minimumStay} night${listing.minimumStay !== 1 ? 's' : ''}.`);
      return;
    }
    if (parseInt(guests) > listing.maxGuests) {
      Utils.showAlert(bookingAlert, 'error', `Maximum ${listing.maxGuests} guests allowed for this residence.`);
      return;
    }

    bookingBtn.disabled = true;
    bookingBtn.innerHTML = '<span class="loader"></span> Sending...';

    setTimeout(() => {
      DB.addBooking({
        listingId:   id,
        listingTitle:listing.title,
        guestName:   name,
        guestEmail:  email,
        guestPhone:  phone,
        checkIn:     ci,
        checkOut:    co,
        nights,
        guests:      parseInt(guests),
        specialRequests: notes,
        totalEstimate:  nights * listing.price,
      });
      document.getElementById('bookingFormWrap').style.display = 'none';
      document.getElementById('bookingSuccess').style.display  = 'block';
    }, 900);
  });

  function showNotFound() {
    document.getElementById('notFoundState').style.display = 'block';
  }

})();

function showNotFound() {
  document.getElementById('notFoundState').style.display  = 'block';
  document.getElementById('propertyContent').style.display = 'none';
}
