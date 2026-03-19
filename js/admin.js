/* ============================================
   MARINA TOWERS — Admin Dashboard JS
   ============================================ */

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'marina2024';
const SESSION_KEY = 'mt_admin_session';

// ── Auth ──────────────────────────────────
function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}
function login(user, pass) {
  return user === ADMIN_USER && pass === ADMIN_PASS;
}
function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

// ── Init ──────────────────────────────────
(function init() {
  const loginScreen = document.getElementById('loginScreen');
  const adminShell  = document.getElementById('adminShell');
  const loginForm   = document.getElementById('loginForm');
  const loginAlert  = document.getElementById('loginAlert');
  const logoutBtn   = document.getElementById('logoutBtn');

  if (isLoggedIn()) {
    loginScreen.style.display = 'none';
    adminShell.classList.add('visible');
    initAdmin();
  }

  loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    if (login(user, pass)) {
      sessionStorage.setItem(SESSION_KEY, '1');
      loginScreen.style.display = 'none';
      adminShell.classList.add('visible');
      initAdmin();
    } else {
      Utils.showAlert(loginAlert, 'error', 'Invalid credentials. Please try again.');
    }
  });

  logoutBtn?.addEventListener('click', logout);
})();

// ── Admin App ─────────────────────────────
function initAdmin() {
  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Nav
  initNavigation();

  // Mobile sidebar
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  sidebarToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));

  // Modals
  initModals();

  // Initial render
  renderDashboard();
  updateNavBadges();
}

function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById('clockTime');
  const dateEl = document.getElementById('clockDate');
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ── Navigation ────────────────────────────
function initNavigation() {
  document.querySelectorAll('.admin-nav-item[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.panel;
      switchPanel(panel);
      document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('adminSidebar')?.classList.remove('open');
    });
  });
}

function switchPanel(id) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`panel-${id}`);
  if (!panel) return;
  panel.classList.add('active');

  // Render content for each panel
  switch (id) {
    case 'dashboard':        renderDashboard(); break;
    case 'listings':         renderListingsTable('listingsTableBody', null); break;
    case 'listings-pending': renderListingsTable('listingsPendingBody', 'pending'); break;
    case 'listings-approved':renderListingsTable('listingsApprovedBody', 'approved'); break;
    case 'bookings':         renderBookingsTable('bookingsTableBody', null); break;
    case 'bookings-pending': renderBookingsTable('bookingsPendingBody', 'pending'); break;
    case 'bookings-approved':renderBookingsTable('bookingsApprovedBody', 'approved'); break;
  }

  // Filter tabs for listings
  if (id === 'listings') {
    document.querySelectorAll('#listingsTabs .filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#listingsTabs .filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderListingsTable('listingsTableBody', tab.dataset.filter === 'all' ? null : tab.dataset.filter);
      });
    });
  }
  if (id === 'bookings') {
    document.querySelectorAll('#bookingsTabs .filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#bookingsTabs .filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderBookingsTable('bookingsTableBody', tab.dataset.filter === 'all' ? null : tab.dataset.filter);
      });
    });
  }
}

// ── Nav Badges ────────────────────────────
function updateNavBadges() {
  const stats = DB.getStats();
  const pl  = stats.pendingListings;
  const pb  = stats.pendingBookings;
  document.getElementById('navPendingListings')?.textContent  !== undefined && (document.getElementById('navPendingListings').textContent  = pl || '');
  document.getElementById('navPendingListings2')?.textContent !== undefined && (document.getElementById('navPendingListings2').textContent = pl || '');
  document.getElementById('navPendingBookings')?.textContent  !== undefined && (document.getElementById('navPendingBookings').textContent  = pb || '');
  document.getElementById('navPendingBookings2')?.textContent !== undefined && (document.getElementById('navPendingBookings2').textContent = pb || '');
}

// ── Dashboard ─────────────────────────────
function renderDashboard() {
  const stats = DB.getStats();

  // Stat cards
  const statCards = document.getElementById('statCards');
  if (statCards) {
    statCards.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">🏛</div>
        <div class="stat-value">${stats.approvedListings}</div>
        <div class="stat-label">Live Listings</div>
      </div>
      <div class="stat-card ${stats.pendingListings > 0 ? 'urgent' : ''}">
        <div class="stat-icon">⏳</div>
        <div class="stat-value">${stats.pendingListings}</div>
        <div class="stat-label">Pending Submissions</div>
      </div>
      <div class="stat-card ${stats.pendingBookings > 0 ? 'urgent' : ''}">
        <div class="stat-icon">📋</div>
        <div class="stat-value">${stats.pendingBookings}</div>
        <div class="stat-label">Pending Bookings</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✓</div>
        <div class="stat-value">${stats.approvedBookings}</div>
        <div class="stat-label">Approved Bookings</div>
      </div>`;
  }

  // Recent tables
  const dashTables = document.getElementById('dashboardTables');
  if (!dashTables) return;

  const recentListings  = DB.getListings().slice(0, 5);
  const recentBookings  = DB.getBookings().slice(0, 5);

  dashTables.innerHTML = `
    <div>
      <div class="admin-table-wrap">
        <div class="admin-table-header">
          <span class="admin-table-title">Recent Submissions</span>
          <button class="action-btn action-btn-view" onclick="switchPanelAndNav('listings')">View All</button>
        </div>
        ${recentListings.length
          ? `<table>
              <thead><tr>
                <th>Residence</th><th>Owner</th><th>Status</th><th>Submitted</th>
              </tr></thead>
              <tbody>${recentListings.map(l => `
                <tr>
                  <td>
                    <div class="td-main">${Utils.escapeHtml(l.title || l.unitNumber)}</div>
                    <div class="td-sub">${Utils.escapeHtml(l.tower || '')} · ${l.bedrooms} Bed · ${Utils.formatCurrency(l.price)}/night</div>
                  </td>
                  <td>
                    <div class="td-main">${Utils.escapeHtml(l.ownerName)}</div>
                    <div class="td-sub">${Utils.escapeHtml(l.ownerEmail)}</div>
                  </td>
                  <td><span class="badge badge-${l.status}">${l.status}</span></td>
                  <td style="color:var(--text-muted);font-size:12px">${Utils.formatDateTime(l.submittedAt)}</td>
                </tr>`).join('')}
              </tbody>
            </table>`
          : `<div class="table-empty">No submissions yet.</div>`
        }
      </div>
    </div>
    <div>
      <div class="admin-table-wrap">
        <div class="admin-table-header">
          <span class="admin-table-title">Recent Booking Requests</span>
          <button class="action-btn action-btn-view" onclick="switchPanelAndNav('bookings')">View All</button>
        </div>
        ${recentBookings.length
          ? `<table>
              <thead><tr>
                <th>Guest</th><th>Residence</th><th>Status</th><th>Submitted</th>
              </tr></thead>
              <tbody>${recentBookings.map(b => `
                <tr>
                  <td>
                    <div class="td-main">${Utils.escapeHtml(b.guestName)}</div>
                    <div class="td-sub">${Utils.escapeHtml(b.guestEmail)}</div>
                  </td>
                  <td>
                    <div class="td-main">${Utils.escapeHtml(b.listingTitle || b.listingId)}</div>
                    <div class="td-sub">${Utils.formatDate(b.checkIn)} → ${Utils.formatDate(b.checkOut)}</div>
                  </td>
                  <td><span class="badge badge-${b.status}">${b.status}</span></td>
                  <td style="color:var(--text-muted);font-size:12px">${Utils.formatDateTime(b.submittedAt)}</td>
                </tr>`).join('')}
              </tbody>
            </table>`
          : `<div class="table-empty">No booking requests yet.</div>`
        }
      </div>
    </div>`;
}

function switchPanelAndNav(id) {
  switchPanel(id);
  document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-panel="${id}"]`)?.classList.add('active');
}

// ── Listings Table ────────────────────────
function renderListingsTable(containerId, statusFilter) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let listings = DB.getListings();
  if (statusFilter) listings = listings.filter(l => l.status === statusFilter);

  if (!listings.length) {
    container.innerHTML = `<div class="table-empty">No listings found.</div>`;
    return;
  }

  container.innerHTML = `
    <table>
      <thead><tr>
        <th>Residence</th>
        <th>Owner</th>
        <th>Details</th>
        <th>Price</th>
        <th>Status</th>
        <th>Actions</th>
      </tr></thead>
      <tbody>
        ${listings.map(l => `
          <tr>
            <td>
              <div class="td-main">${Utils.escapeHtml(l.title || l.unitNumber)}</div>
              <div class="td-sub">${Utils.escapeHtml(l.tower || '')} · Unit ${Utils.escapeHtml(l.unitNumber)}</div>
              <div class="td-sub" style="margin-top:2px;color:var(--text-muted);font-size:11px">${Utils.formatDateTime(l.submittedAt)}</div>
            </td>
            <td>
              <div class="td-main">${Utils.escapeHtml(l.ownerName)}</div>
              <div class="td-sub">${Utils.escapeHtml(l.ownerEmail)}</div>
              <div class="td-sub">${Utils.escapeHtml(l.ownerPhone)}</div>
            </td>
            <td>
              <div class="td-sub">${l.bedrooms} Bed · ${l.maxGuests} guests</div>
              <div class="td-sub">${Utils.escapeHtml(l.apartmentType || '')} · ${l.serviceType === 'full' ? 'Full Service' : 'Basic'}</div>
              <div class="td-sub">${Utils.formatDate(l.availableFrom)} – ${Utils.formatDate(l.availableTo)}</div>
            </td>
            <td>
              <div style="font-family:var(--font-heading);font-size:18px;color:var(--text-primary)">${Utils.formatCurrency(l.price)}</div>
              <div class="td-sub">/ night · min ${l.minimumStay}n</div>
            </td>
            <td><span class="badge badge-${l.status}">${l.status}</span></td>
            <td>
              <div class="td-actions">
                <button class="action-btn action-btn-view" onclick="openListingModal('${l.id}')">View</button>
                <button class="action-btn action-btn-edit" onclick="openEditModal('${l.id}')">Edit</button>
                ${l.status !== 'approved'  ? `<button class="action-btn action-btn-approve" onclick="updateListingStatus('${l.id}','approved')">Approve</button>` : ''}
                ${l.status !== 'rejected'  ? `<button class="action-btn action-btn-reject"  onclick="updateListingStatus('${l.id}','rejected')">Reject</button>` : ''}
                ${l.status !== 'pending'   ? `<button class="action-btn action-btn-view"    onclick="updateListingStatus('${l.id}','pending')">Reset</button>` : ''}
                <button class="action-btn action-btn-delete" onclick="deleteListing('${l.id}')">Delete</button>
              </div>
              ${l.status === 'approved' ? `<div style="margin-top:6px"><a href="property.html?id=${l.id}" target="_blank" style="font-size:11px;color:var(--gold)">View Live →</a></div>` : ''}
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

// ── Bookings Table ────────────────────────
function renderBookingsTable(containerId, statusFilter) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let bookings = DB.getBookings();
  if (statusFilter) bookings = bookings.filter(b => b.status === statusFilter);

  if (!bookings.length) {
    container.innerHTML = `<div class="table-empty">No booking requests found.</div>`;
    return;
  }

  container.innerHTML = `
    <table>
      <thead><tr>
        <th>Guest</th>
        <th>Residence</th>
        <th>Dates</th>
        <th>Estimate</th>
        <th>Status</th>
        <th>Actions</th>
      </tr></thead>
      <tbody>
        ${bookings.map(b => `
          <tr>
            <td>
              <div class="td-main">${Utils.escapeHtml(b.guestName)}</div>
              <div class="td-sub">${Utils.escapeHtml(b.guestEmail)}</div>
              <div class="td-sub">${Utils.escapeHtml(b.guestPhone)}</div>
            </td>
            <td>
              <div class="td-main">${Utils.escapeHtml(b.listingTitle || b.listingId)}</div>
              <div class="td-sub">${b.guests} guest${b.guests !== 1 ? 's' : ''}</div>
            </td>
            <td>
              <div class="td-main">${Utils.formatDate(b.checkIn)} →</div>
              <div class="td-main">${Utils.formatDate(b.checkOut)}</div>
              <div class="td-sub">${b.nights || '—'} night${(b.nights || 0) !== 1 ? 's' : ''}</div>
            </td>
            <td>
              <div style="font-family:var(--font-heading);font-size:18px;color:var(--text-primary)">${b.totalEstimate ? Utils.formatCurrency(b.totalEstimate) : '—'}</div>
              <div class="td-sub">estimated</div>
            </td>
            <td><span class="badge badge-${b.status}">${b.status}</span></td>
            <td>
              <div class="td-actions">
                <button class="action-btn action-btn-view" onclick="openBookingModal('${b.id}')">View</button>
                ${b.status !== 'approved'  ? `<button class="action-btn action-btn-approve" onclick="updateBookingStatus('${b.id}','approved')">Approve</button>` : ''}
                ${b.status !== 'rejected'  ? `<button class="action-btn action-btn-reject"  onclick="updateBookingStatus('${b.id}','rejected')">Reject</button>` : ''}
                ${b.status !== 'pending'   ? `<button class="action-btn action-btn-view"    onclick="updateBookingStatus('${b.id}','pending')">Reset</button>` : ''}
                <button class="action-btn action-btn-delete" onclick="deleteBooking('${b.id}')">Delete</button>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

// ── Status Actions ────────────────────────
function updateListingStatus(id, status) {
  DB.updateListing(id, { status });
  updateNavBadges();
  refreshCurrentPanel();
}
function updateBookingStatus(id, status) {
  DB.updateBooking(id, { status });
  updateNavBadges();
  refreshCurrentPanel();
}
function deleteListing(id) {
  if (!confirm('Delete this listing? This cannot be undone.')) return;
  DB.deleteListing(id);
  updateNavBadges();
  refreshCurrentPanel();
}
function deleteBooking(id) {
  if (!confirm('Delete this booking request? This cannot be undone.')) return;
  DB.deleteBooking(id);
  updateNavBadges();
  refreshCurrentPanel();
}
function refreshCurrentPanel() {
  const active = document.querySelector('.admin-panel.active');
  if (!active) return;
  const id = active.id.replace('panel-', '');
  switchPanel(id);
}

// ── Modals ────────────────────────────────
function initModals() {
  document.getElementById('listingModalClose')?.addEventListener('click', closeListingModal);
  document.getElementById('bookingModalClose')?.addEventListener('click', closeBookingModal);
  document.getElementById('editModalClose')?.addEventListener('click', closeEditModal);
  document.getElementById('editCancel')?.addEventListener('click', closeEditModal);
  document.getElementById('editSave')?.addEventListener('click', saveEditListing);

  document.getElementById('listingModal')?.addEventListener('click', e => { if (e.target === document.getElementById('listingModal')) closeListingModal(); });
  document.getElementById('bookingModal')?.addEventListener('click', e => { if (e.target === document.getElementById('bookingModal')) closeBookingModal(); });
  document.getElementById('editModal')?.addEventListener('click', e => { if (e.target === document.getElementById('editModal')) closeEditModal(); });
}

function openListingModal(id) {
  const l = DB.getListing(id);
  if (!l) return;
  document.getElementById('modalListingTitle').textContent = l.title || l.unitNumber;

  const photosHtml = (l.photos || []).slice(0, 4).map(p =>
    `<img class="modal-photo" src="${Utils.escapeHtml(p)}" alt="" />`
  ).join('');

  document.getElementById('listingModalBody').innerHTML = `
    ${photosHtml ? `<div class="modal-photos">${photosHtml}</div>` : ''}
    <div class="modal-row">
      <div class="modal-field"><label>Owner</label><p>${Utils.escapeHtml(l.ownerName)}</p></div>
      <div class="modal-field"><label>Email</label><p>${Utils.escapeHtml(l.ownerEmail)}</p></div>
    </div>
    <div class="modal-row">
      <div class="modal-field"><label>Phone</label><p>${Utils.escapeHtml(l.ownerPhone)}</p></div>
      <div class="modal-field"><label>Unit</label><p>${Utils.escapeHtml(l.unitNumber)} · ${Utils.escapeHtml(l.tower || '')}</p></div>
    </div>
    <div class="modal-row">
      <div class="modal-field"><label>Type</label><p>${Utils.escapeHtml(l.apartmentType || '')} · ${l.bedrooms} bed · ${l.maxGuests} guests</p></div>
      <div class="modal-field"><label>Price</label><p>${Utils.formatCurrency(l.price)} / night</p></div>
    </div>
    <div class="modal-row">
      <div class="modal-field"><label>Available</label><p>${Utils.formatDate(l.availableFrom)} – ${Utils.formatDate(l.availableTo)}</p></div>
      <div class="modal-field"><label>Min. Stay</label><p>${l.minimumStay} nights</p></div>
    </div>
    <div class="modal-row">
      <div class="modal-field"><label>Service</label><p>${l.serviceType === 'full' ? 'Full Service Management' : 'Basic Listing'}</p></div>
      <div class="modal-field"><label>Pricing Optimise</label><p>${l.optimizePricing ? 'Yes' : 'No'}</p></div>
    </div>
    ${l.description ? `<div style="margin-bottom:16px"><div class="modal-field"><label>Description</label><p style="color:var(--text-secondary);line-height:1.6">${Utils.escapeHtml(l.description)}</p></div></div>` : ''}
    ${l.notes ? `<div style="margin-bottom:16px"><div class="modal-field"><label>Notes / Rules</label><p style="color:var(--text-secondary)">${Utils.escapeHtml(l.notes)}</p></div></div>` : ''}
    ${(l.amenities||[]).length ? `<div class="modal-field"><label>Amenities</label><p style="color:var(--text-secondary)">${l.amenities.join(' · ')}</p></div>` : ''}
    <div style="margin-top:16px"><div class="modal-field"><label>Submitted</label><p style="color:var(--text-muted)">${Utils.formatDateTime(l.submittedAt)}</p></div></div>
  `;

  document.getElementById('listingModalActions').innerHTML = `
    <button class="action-btn action-btn-edit" onclick="closeListingModal();openEditModal('${l.id}')">Edit</button>
    ${l.status !== 'approved' ? `<button class="action-btn action-btn-approve" onclick="updateListingStatus('${l.id}','approved');closeListingModal()">Approve</button>` : ''}
    ${l.status !== 'rejected' ? `<button class="action-btn action-btn-reject"  onclick="updateListingStatus('${l.id}','rejected');closeListingModal()">Reject</button>` : ''}
  `;

  document.getElementById('listingModal').classList.add('open');
}
function closeListingModal() { document.getElementById('listingModal').classList.remove('open'); }

function openBookingModal(id) {
  const b = DB.getBookings().find(b => b.id === id);
  if (!b) return;

  document.getElementById('bookingModalBody').innerHTML = `
    <div class="modal-row">
      <div class="modal-field"><label>Guest Name</label><p>${Utils.escapeHtml(b.guestName)}</p></div>
      <div class="modal-field"><label>Email</label><p>${Utils.escapeHtml(b.guestEmail)}</p></div>
    </div>
    <div class="modal-row">
      <div class="modal-field"><label>Phone</label><p>${Utils.escapeHtml(b.guestPhone)}</p></div>
      <div class="modal-field"><label>Guests</label><p>${b.guests}</p></div>
    </div>
    <div class="modal-row">
      <div class="modal-field"><label>Residence</label><p>${Utils.escapeHtml(b.listingTitle || b.listingId)}</p></div>
      <div class="modal-field"><label>Status</label><p><span class="badge badge-${b.status}">${b.status}</span></p></div>
    </div>
    <div class="modal-row">
      <div class="modal-field"><label>Check-In</label><p>${Utils.formatDate(b.checkIn)}</p></div>
      <div class="modal-field"><label>Check-Out</label><p>${Utils.formatDate(b.checkOut)}</p></div>
    </div>
    <div class="modal-row">
      <div class="modal-field"><label>Nights</label><p>${b.nights || '—'}</p></div>
      <div class="modal-field"><label>Estimated Total</label><p>${b.totalEstimate ? Utils.formatCurrency(b.totalEstimate) : '—'}</p></div>
    </div>
    ${b.specialRequests ? `<div class="modal-field" style="margin-top:12px"><label>Special Requests</label><p style="color:var(--text-secondary);line-height:1.6">${Utils.escapeHtml(b.specialRequests)}</p></div>` : ''}
    <div style="margin-top:16px"><div class="modal-field"><label>Submitted</label><p style="color:var(--text-muted)">${Utils.formatDateTime(b.submittedAt)}</p></div></div>
  `;

  document.getElementById('bookingModalActions').innerHTML = `
    ${b.status !== 'approved' ? `<button class="action-btn action-btn-approve" onclick="updateBookingStatus('${b.id}','approved');closeBookingModal()">Approve</button>` : ''}
    ${b.status !== 'rejected' ? `<button class="action-btn action-btn-reject"  onclick="updateBookingStatus('${b.id}','rejected');closeBookingModal()">Reject</button>` : ''}
    <button class="action-btn action-btn-view" onclick="closeBookingModal()">Close</button>
  `;

  document.getElementById('bookingModal').classList.add('open');
}
function closeBookingModal() { document.getElementById('bookingModal').classList.remove('open'); }

// ── Edit Listing ──────────────────────────
function openEditModal(id) {
  const l = DB.getListing(id);
  if (!l) return;
  document.getElementById('editId').value          = l.id;
  document.getElementById('editTitle').value       = l.title || '';
  document.getElementById('editTower').value       = l.tower || 'Tower A';
  document.getElementById('editPrice').value       = l.price || '';
  document.getElementById('editBedrooms').value    = l.bedrooms || '';
  document.getElementById('editMaxGuests').value   = l.maxGuests || '';
  document.getElementById('editMinStay').value     = l.minimumStay || '';
  document.getElementById('editDescription').value = l.description || '';
  document.getElementById('editAmenities').value   = (l.amenities || []).join(', ');
  document.getElementById('editNotes').value       = l.notes || '';
  document.getElementById('editModal').classList.add('open');
}
function closeEditModal() { document.getElementById('editModal').classList.remove('open'); }
function saveEditListing() {
  const id = document.getElementById('editId').value;
  if (!id) return;
  const amenitiesRaw = document.getElementById('editAmenities').value;
  const amenities    = amenitiesRaw ? amenitiesRaw.split(',').map(a => a.trim()).filter(Boolean) : [];
  DB.updateListing(id, {
    title:       document.getElementById('editTitle').value.trim(),
    tower:       document.getElementById('editTower').value,
    price:       parseFloat(document.getElementById('editPrice').value) || 0,
    bedrooms:    parseInt(document.getElementById('editBedrooms').value) || 1,
    maxGuests:   parseInt(document.getElementById('editMaxGuests').value) || 2,
    minimumStay: parseInt(document.getElementById('editMinStay').value) || 1,
    description: document.getElementById('editDescription').value.trim(),
    amenities,
    notes:       document.getElementById('editNotes').value.trim(),
  });
  closeEditModal();
  refreshCurrentPanel();
}
