/* ============================================
   MARINA TOWERS — Rentals Browse Page JS
   ============================================ */

(function initRentals() {
  const grid       = document.getElementById('listingsGrid');
  const totalCount = document.getElementById('totalCount');
  const resultsInfo= document.getElementById('resultsInfo');
  const sortSelect = document.getElementById('sortSelect');
  const applyBtn   = document.getElementById('applyFilters');
  const resetBtn   = document.getElementById('resetFilters');
  const filterToggle  = document.getElementById('filterToggle');
  const filtersContent= document.getElementById('filtersContent');

  if (!grid) return;

  // ── Mobile filter toggle ──
  if (filterToggle) {
    filterToggle.addEventListener('click', () => {
      filtersContent.classList.toggle('open');
    });
  }

  // ── Get filters ────────────────────────────
  function getFilters() {
    return {
      tower:     document.getElementById('filterTower')?.value    || '',
      bedrooms:  document.getElementById('filterBedrooms')?.value || '',
      guests:    document.getElementById('filterGuests')?.value   || '',
      maxPrice:  parseFloat(document.getElementById('filterMaxPrice')?.value) || 0,
      checkIn:   document.getElementById('filterCheckIn')?.value  || '',
      checkOut:  document.getElementById('filterCheckOut')?.value || '',
    };
  }

  // ── Filter & sort ──────────────────────────
  function getFiltered() {
    const f = getFilters();
    let data = DB.getApprovedListings();

    if (f.tower)    data = data.filter(l => l.tower === f.tower);
    if (f.bedrooms) {
      const b = parseInt(f.bedrooms);
      if (b >= 4) data = data.filter(l => l.bedrooms >= 4);
      else        data = data.filter(l => l.bedrooms === b);
    }
    if (f.guests)   data = data.filter(l => l.maxGuests >= parseInt(f.guests));
    if (f.maxPrice) data = data.filter(l => l.price <= f.maxPrice);

    // Date filter: listing's availability range must cover requested dates
    if (f.checkIn && f.checkOut) {
      data = data.filter(l => {
        const from = new Date(l.availableFrom || '2000-01-01');
        const to   = new Date(l.availableTo   || '2099-01-01');
        const ci   = new Date(f.checkIn);
        const co   = new Date(f.checkOut);
        return ci >= from && co <= to;
      });
    }

    // Sort
    const sort = sortSelect?.value || 'default';
    if (sort === 'price_asc')      data.sort((a,b) => a.price - b.price);
    if (sort === 'price_desc')     data.sort((a,b) => b.price - a.price);
    if (sort === 'bedrooms_asc')   data.sort((a,b) => a.bedrooms - b.bedrooms);
    if (sort === 'bedrooms_desc')  data.sort((a,b) => b.bedrooms - a.bedrooms);

    return data;
  }

  // ── Render ─────────────────────────────────
  function render() {
    const listings = getFiltered();
    if (totalCount) totalCount.textContent = DB.getApprovedListings().length;

    if (resultsInfo) {
      resultsInfo.innerHTML = `Showing <strong>${listings.length}</strong> residence${listings.length !== 1 ? 's' : ''}`;
    }

    if (!listings.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">🏛</div>
          <h3>No residences found</h3>
          <p>Try adjusting your filters or check back soon for new listings.</p>
        </div>`;
      return;
    }

    grid.innerHTML = listings.map(l => renderCard(l)).join('');
  }

  function renderCard(l) {
    const hasPhoto = l.photos && l.photos.length > 0;
    const imgHtml  = hasPhoto
      ? `<img class="card-image" src="${Utils.escapeHtml(l.photos[0])}" alt="${Utils.escapeHtml(l.title)}" loading="lazy" />`
      : `<div class="card-image-placeholder">🏛</div>`;

    const minStayBadge = l.minimumStay > 1 ? `<div class="card-img-badge">${l.minimumStay}+ Night Minimum</div>` : '';
    const serviceLabel = l.serviceType === 'full' ? '<span style="color:var(--gold);font-size:11px;letter-spacing:0.1em">✦ Full Service</span>' : '';

    return `
      <div class="card">
        <div class="card-img-wrap">
          ${imgHtml}
          ${minStayBadge}
        </div>
        <div class="card-body">
          <div class="card-tower" style="display:flex;align-items:center;justify-content:space-between">
            <span>${Utils.escapeHtml(l.tower || '')}</span>
            ${serviceLabel}
          </div>
          <h3 class="card-title">${Utils.escapeHtml(l.title)}</h3>
          <p class="card-description">${Utils.escapeHtml(l.description || '')}</p>
          <div class="card-meta">
            <span>🛏 ${l.bedrooms} Bed${l.bedrooms !== 1 ? 's' : ''}</span>
            <span>👥 ${l.maxGuests} guests</span>
            ${l.apartmentType ? `<span>🏛 ${Utils.escapeHtml(l.apartmentType)}</span>` : ''}
          </div>
          <div class="card-price">
            <span class="card-price-amount">${Utils.formatCurrency(l.price)}</span>
            <span class="card-price-unit">/ night</span>
          </div>
          <div class="card-footer">
            <div style="display:flex;gap:8px;align-items:center">
              ${l.availableFrom ? `<span style="font-size:11px;color:var(--text-muted)">From ${Utils.formatDate(l.availableFrom)}</span>` : ''}
            </div>
            <a href="property.html?id=${l.id}" class="btn btn-gold-outline btn-sm">View Details</a>
          </div>
        </div>
      </div>`;
  }

  // ── Event listeners ────────────────────────
  applyBtn?.addEventListener('click', render);
  resetBtn?.addEventListener('click', () => {
    ['filterTower','filterBedrooms','filterGuests','filterMaxPrice','filterCheckIn','filterCheckOut'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    render();
  });
  sortSelect?.addEventListener('change', render);

  // Initial render
  render();

})();
