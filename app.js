/* ==============================================
   QuickServe — app.js
   Navbar + Provider Cards + Customer Dashboard
   + Provider Dashboard + Review Modal
   ============================================== */

(function () {
    "use strict";

    /* ===========================================
       FIRESTORE INITIALIZATION
       =========================================== */
    var db = null;
    if (typeof firebase !== "undefined" && firebase.firestore) {
        db = firebase.firestore();
    }

    function generateBookingId() {
        var num = Math.floor(10000 + Math.random() * 90000);
        return "BK-" + num;
    }

    function generateReviewId() {
        return "REV-" + Math.floor(10000 + Math.random() * 90000);
    }

    /* ===========================================
       1. NAVBAR AUTH CONTROLS
       =========================================== */
    var navAuthControls = document.getElementById("navAuthControls");
    var loginModalBtn = document.getElementById("loginModalBtn");
    var registerModalBtn = document.getElementById("registerModalBtn");
    var logoutBtn = document.getElementById("logoutBtn");
    var heroSection = document.getElementById("heroSection");

    function updateNavbarUI(user, role) {
        if (user) {
            /* Logged in — hide Login/Signup, show Logout */
            if (loginModalBtn) loginModalBtn.style.display = "none";
            if (registerModalBtn) registerModalBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";
        } else {
            /* Logged out — show Login/Signup, hide Logout */
            if (loginModalBtn) loginModalBtn.style.display = "inline-block";
            if (registerModalBtn) registerModalBtn.style.display = "inline-block";
            if (logoutBtn) logoutBtn.style.display = "none";
        }

        /* Switch dashboard view based on role */
        if (user) {
            switchDashboardView(role);
        } else {
            switchDashboardView(null);
        }
    }

    window.updateNavbarUI = updateNavbarUI;

    /* ===========================================
       FIRESTORE CRUD HELPERS
       =========================================== */

    /* ---- Bookings ---- */
    function saveBookingToFirestore(booking) {
        if (!db) return Promise.resolve();
        return db.collection("bookings").doc(booking.id).set(booking);
    }

    function updateBookingInFirestore(bookingId, updates) {
        if (!db) return Promise.resolve();
        return db.collection("bookings").doc(bookingId).update(updates);
    }

    function loadBookingsFromFirestore() {
        if (!db) return Promise.resolve();
        return db.collection("bookings").get().then(function (snap) {
            var loaded = [];
            snap.forEach(function (doc) {
                loaded.push(doc.data());
            });
            if (loaded.length > 0) {
                customerBookings = loaded;
            }
        }).catch(function (err) {
            console.error("[QuickServe] Error loading bookings:", err);
        });
    }

    /* ---- Reviews ---- */
    function saveReviewToFirestore(review) {
        if (!db) return Promise.resolve();
        return db.collection("reviews").doc(review.id).set(review);
    }

    function loadReviewsFromFirestore() {
        if (!db) return Promise.resolve();
        return db.collection("reviews").get().then(function (snap) {
            var loaded = [];
            snap.forEach(function (doc) {
                loaded.push(doc.data());
            });
            if (loaded.length > 0) {
                customerReviews = loaded;
            }
        }).catch(function (err) {
            console.error("[QuickServe] Error loading reviews:", err);
        });
    }

    /* ---- Provider Requests ---- */
    function saveProviderRequestToFirestore(request) {
        if (!db) return Promise.resolve();
        return db.collection("providerRequests").doc(request.id).set(request);
    }

    function updateProviderRequestInFirestore(requestId, updates) {
        if (!db) return Promise.resolve();
        return db.collection("providerRequests").doc(requestId).update(updates);
    }

    function loadProviderRequestsFromFirestore() {
        if (!db) return Promise.resolve();
        return db.collection("providerRequests").get().then(function (snap) {
            var loaded = [];
            snap.forEach(function (doc) {
                loaded.push(doc.data());
            });
            if (loaded.length > 0) {
                providerRequests = loaded;
            }
        }).catch(function (err) {
            console.error("[QuickServe] Error loading provider requests:", err);
        });
    }

    /* ===========================================
       2. SAMPLE PROVIDER DATA (cards)
       =========================================== */
    var providers = [
        { name: "Mike's Plumbing Co.", category: "Plumbing", location: "Downtown Chicago, IL", experience: "12 years experience", rating: 4.8, price: "$45/hr" },
        { name: "BrightSpark Electric", category: "Electrical", location: "Austin, TX", experience: "8 years experience", rating: 4.9, price: "$55/hr" },
        { name: "FreshSpace Cleaning", category: "Cleaning", location: "Brooklyn, NY", experience: "6 years experience", rating: 4.7, price: "$30/hr" },
        { name: "WoodCraft Carpentry", category: "Carpentry", location: "Portland, OR", experience: "15 years experience", rating: 4.6, price: "$50/hr" },
        { name: "CoolBreeze AC Services", category: "AC Repair", location: "Phoenix, AZ", experience: "10 years experience", rating: 4.8, price: "$60/hr" },
        { name: "ColorPro Painting", category: "Painting", location: "Denver, CO", experience: "9 years experience", rating: 4.5, price: "$35/hr" },
        { name: "QuickFix Plumbers", category: "Plumbing", location: "Seattle, WA", experience: "7 years experience", rating: 4.4, price: "$40/hr" },
        { name: "SparkWired Electrical", category: "Electrical", location: "San Francisco, CA", experience: "11 years experience", rating: 4.7, price: "$60/hr" },
        { name: "SparkleHouse Cleaners", category: "Cleaning", location: "Nashville, TN", experience: "5 years experience", rating: 4.9, price: "$35/hr" },
        { name: "ACMaster Pro", category: "AC Repair", location: "Miami, FL", experience: "14 years experience", rating: 4.6, price: "$55/hr" },
        { name: "PaintPerfect Studio", category: "Painting", location: "Boston, MA", experience: "4 years experience", rating: 4.3, price: "$38/hr" },
        { name: "OakTree Carpentry", category: "Carpentry", location: "Asheville, NC", experience: "20 years experience", rating: 4.8, price: "$52/hr" }
    ];

    /* ===========================================
       3. CUSTOMER BOOKINGS DATA
       =========================================== */
    var customerBookings = [
        { id: "BK-9482", provider: "Mike's Plumbing Co.", category: "Plumbing", date: "2026-09-05", time: "10:00 AM", location: "142 Oak Street, Chicago, IL", status: "Completed", hasReviewed: true },
        { id: "BK-7351", provider: "BrightSpark Electric", category: "Electrical", date: "2026-09-12", time: "2:30 PM", location: "88 River Rd, Austin, TX", status: "In Progress", hasReviewed: false },
        { id: "BK-6024", provider: "FreshSpace Cleaning", category: "Cleaning", date: "2026-09-18", time: "9:00 AM", location: "55 Maple Ave, Brooklyn, NY", status: "Pending", hasReviewed: false },
        { id: "BK-5890", provider: "ColorPro Painting", category: "Painting", date: "2026-08-28", time: "11:00 AM", location: "310 Pine Blvd, Denver, CO", status: "Completed", hasReviewed: false },
        { id: "BK-4215", provider: "WoodCraft Carpentry", category: "Carpentry", date: "2026-09-22", time: "3:00 PM", location: "17 Cedar Lane, Portland, OR", status: "Accepted", hasReviewed: false },
        { id: "BK-3100", provider: "CoolBreeze AC Services", category: "AC Repair", date: "2026-08-20", time: "1:00 PM", location: "200 Desert View, Phoenix, AZ", status: "Rejected", hasReviewed: false }
    ];

    /* ===========================================
       4. PROVIDER REQUESTS DATA
       =========================================== */
    var providerRequests = [
        { id: "BK-6024", customer: "Sarah Johnson", service: "Deep Cleaning", description: "3-bedroom apartment deep clean. Kitchen and bathrooms priority.", date: "2026-09-18", time: "9:00 AM", status: "Pending" },
        { id: "BK-4215", customer: "Tom Bradley", service: "Custom Shelving", description: "Install 3 floating shelves in living room. Wall type: drywall.", date: "2026-09-22", time: "3:00 PM", status: "Accepted" },
        { id: "BK-7351", customer: "Lisa Chen", service: "Panel Upgrade", description: "Upgrade electrical panel from 100A to 200A. Permit already obtained.", date: "2026-09-12", time: "2:30 PM", status: "In Progress" },
        { id: "BK-8810", customer: "James Wilson", service: "AC Installation", description: "Install new split AC unit in master bedroom. Unit provided.", date: "2026-09-25", time: "10:00 AM", status: "Pending" },
        { id: "BK-9482", customer: "Maria Garcia", service: "Pipe Repair", description: "Fix leaking kitchen sink pipe. Water shutoff needed.", date: "2026-09-05", time: "10:00 AM", status: "Completed" }
    ];

    /* ===========================================
       5. DOM REFERENCES
       =========================================== */
    var searchInput = document.getElementById("searchInput");
    var categorySelect = document.getElementById("categorySelect");
    var resetFiltersBtn = document.getElementById("resetFiltersBtn");
    var providerGrid = document.getElementById("providerGrid");
    var noResults = document.getElementById("noResults");
    var resultsCount = document.getElementById("resultsCount");
    var bookingModal = null;
    var reviewModal = null;
    var currentReviewBookingId = null;

    /* ===========================================
       6. PROVIDER CARDS — renderProviders(list)
       =========================================== */
    function renderProviders(list) {
        if (!providerGrid) return;
        providerGrid.innerHTML = "";

        if (resultsCount) {
            resultsCount.textContent = list.length + " provider" + (list.length !== 1 ? "s" : "") + " found";
        }

        if (list.length === 0) {
            if (noResults) noResults.classList.remove("d-none");
            return;
        }
        if (noResults) noResults.classList.add("d-none");

        list.forEach(function (p, index) {
            var col = document.createElement("div");
            col.className = "col-12 col-md-6 col-lg-4";

            var card = document.createElement("div");
            card.className = "ls-card";

            var header = document.createElement("div");
            header.className = "ls-card-header";
            var catBadge = document.createElement("span");
            catBadge.className = "ls-card-badge ls-badge-category";
            catBadge.textContent = p.category;
            var ratingBadge = document.createElement("span");
            ratingBadge.className = "ls-card-badge ls-badge-rating";
            ratingBadge.textContent = "\u2605 " + p.rating;
            header.appendChild(catBadge);
            header.appendChild(ratingBadge);

            var body = document.createElement("div");
            body.className = "ls-card-body";
            var nameEl = document.createElement("div");
            nameEl.className = "ls-card-name";
            nameEl.textContent = p.name;
            var locEl = document.createElement("div");
            locEl.className = "ls-card-location";
            locEl.textContent = p.location;
            var expEl = document.createElement("div");
            expEl.className = "ls-card-experience";
            expEl.textContent = p.experience;
            body.appendChild(nameEl);
            body.appendChild(locEl);
            body.appendChild(expEl);

            var footer = document.createElement("div");
            footer.className = "ls-card-footer";
            var priceEl = document.createElement("span");
            priceEl.className = "ls-card-price";
            priceEl.textContent = p.price;
            var bookBtn = document.createElement("button");
            bookBtn.type = "button";
            bookBtn.className = "btn ls-btn-primary ls-card-book-btn";
            bookBtn.textContent = "View & Book";
            bookBtn.setAttribute("data-provider-index", index);
            bookBtn.addEventListener("click", function () {
                openBookingModal(p);
            });
            footer.appendChild(priceEl);
            footer.appendChild(bookBtn);

            card.appendChild(header);
            card.appendChild(body);
            card.appendChild(footer);
            col.appendChild(card);
            providerGrid.appendChild(col);
        });
    }

    /* ===========================================
       7. BOOKING MODAL
       =========================================== */
    var currentBookingProvider = null;

    function openBookingModal(provider) {
        currentBookingProvider = provider;
        var modalTitle = document.getElementById("bookingModalLabel");
        var providerInfo = document.getElementById("bookingProviderInfo");
        if (modalTitle) modalTitle.textContent = "Book " + provider.name;
        if (providerInfo) {
            providerInfo.innerHTML =
                '<div class="ls-modal-detail"><strong>Provider:</strong> ' + provider.name + '</div>' +
                '<div class="ls-modal-detail"><strong>Category:</strong> ' + provider.category + '</div>' +
                '<div class="ls-modal-detail"><strong>Rate:</strong> ' + provider.price + '</div>' +
                '<div class="ls-modal-detail"><strong>Rating:</strong> \u2605 ' + provider.rating + '</div>';
        }
        /* Pre-select the service category to match the provider */
        var bookingService = document.getElementById("bookingService");
        if (bookingService) bookingService.value = provider.category;
        /* Set minimum date to today */
        var bookingDate = document.getElementById("bookingDate");
        if (bookingDate) bookingDate.min = new Date().toISOString().split("T")[0];
        /* Reset form fields */
        if (bookingDate) bookingDate.value = "";
        var bookingTime = document.getElementById("bookingTime");
        if (bookingTime) bookingTime.value = "";
        var bookingLocation = document.getElementById("bookingLocation");
        if (bookingLocation) bookingLocation.value = "";
        var bookingDesc = document.getElementById("bookingDescription");
        if (bookingDesc) bookingDesc.value = "";
        if (!bookingModal) {
            var modalEl = document.getElementById("bookingModal");
            if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                bookingModal = new bootstrap.Modal(modalEl);
            }
        }
        if (bookingModal) bookingModal.show();
    }

    /* ===========================================
       8. PROVIDER CARDS — FILTERING
       =========================================== */
    function getFilteredProviders() {
        var query = (searchInput ? searchInput.value : "").toLowerCase().trim();
        var category = categorySelect ? categorySelect.value : "";
        return providers.filter(function (p) {
            var matchesSearch = !query ||
                p.name.toLowerCase().indexOf(query) !== -1 ||
                p.category.toLowerCase().indexOf(query) !== -1 ||
                p.location.toLowerCase().indexOf(query) !== -1;
            var matchesCategory = !category || p.category === category;
            return matchesSearch && matchesCategory;
        });
    }

    function applyFilters() {
        renderProviders(getFilteredProviders());
    }

    /* ===========================================
       9. CUSTOMER DASHBOARD — Metrics
       =========================================== */
    function renderCustomerMetrics() {
        var container = document.getElementById("customerMetrics");
        if (!container) return;

        var total = customerBookings.length;
        var active = customerBookings.filter(function (b) {
            return b.status === "Pending" || b.status === "Accepted" || b.status === "In Progress";
        }).length;
        var completed = customerBookings.filter(function (b) {
            return b.status === "Completed";
        }).length;

        container.innerHTML =
            '<div class="col-sm-4">' +
                '<div class="ls-metric-card ls-metric-violet">' +
                    '<span class="ls-metric-label">Total Bookings</span>' +
                    '<span class="ls-metric-value">' + total + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="col-sm-4">' +
                '<div class="ls-metric-card ls-metric-amber">' +
                    '<span class="ls-metric-label">Active Services</span>' +
                    '<span class="ls-metric-value">' + active + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="col-sm-4">' +
                '<div class="ls-metric-card ls-metric-green">' +
                    '<span class="ls-metric-label">Completed Jobs</span>' +
                    '<span class="ls-metric-value">' + completed + '</span>' +
                '</div>' +
            '</div>';
    }

    /* ===========================================
       10. CUSTOMER DASHBOARD — Table
       =========================================== */
    function getStatusBadgeClass(status) {
        switch (status) {
            case "Pending":      return "ls-status-pending";
            case "Accepted":     return "ls-status-accepted";
            case "In Progress":  return "ls-status-in-progress";
            case "Completed":    return "ls-status-completed";
            case "Rejected":     return "ls-status-rejected";
            default:             return "ls-status-pending";
        }
    }

    function formatDate(dateStr) {
        var parts = dateStr.split("-");
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[parseInt(parts[1], 10) - 1] + " " + parseInt(parts[2], 10) + ", " + parts[0];
    }

    function renderCustomerTable() {
        var tbody = document.getElementById("customerTableBody");
        var noRes = document.getElementById("customerNoResults");
        var searchVal = (document.getElementById("customerSearchInput") ? document.getElementById("customerSearchInput").value : "").toLowerCase().trim();
        var statusVal = document.getElementById("customerStatusFilter") ? document.getElementById("customerStatusFilter").value : "";

        var filtered = customerBookings.filter(function (b) {
            var matchesSearch = !searchVal ||
                b.provider.toLowerCase().indexOf(searchVal) !== -1 ||
                b.id.toLowerCase().indexOf(searchVal) !== -1;
            var matchesStatus = !statusVal || b.status === statusVal;
            return matchesSearch && matchesStatus;
        });

        if (!tbody) return;
        tbody.innerHTML = "";

        if (filtered.length === 0) {
            if (noRes) noRes.classList.remove("d-none");
            return;
        }
        if (noRes) noRes.classList.add("d-none");

        filtered.forEach(function (b) {
            var tr = document.createElement("tr");

            /* Booking ID */
            var tdId = document.createElement("td");
            var idSpan = document.createElement("span");
            idSpan.className = "ls-booking-id";
            idSpan.textContent = "#" + b.id;
            tdId.appendChild(idSpan);

            /* Provider Info */
            var tdProvider = document.createElement("td");
            var nameSpan = document.createElement("span");
            nameSpan.className = "ls-provider-name";
            nameSpan.textContent = b.provider;
            var catTag = document.createElement("span");
            catTag.className = "ls-category-tag";
            catTag.textContent = b.category;
            tdProvider.appendChild(nameSpan);
            tdProvider.appendChild(catTag);

            /* Date & Time */
            var tdDate = document.createElement("td");
            tdDate.textContent = formatDate(b.date) + " " + b.time;

            /* Location */
            var tdLoc = document.createElement("td");
            tdLoc.textContent = b.location;

            /* Status Badge */
            var tdStatus = document.createElement("td");
            var badge = document.createElement("span");
            badge.className = "ls-status-badge " + getStatusBadgeClass(b.status);
            badge.textContent = b.status;
            tdStatus.appendChild(badge);

            /* Actions */
            var tdActions = document.createElement("td");

            if (b.status === "Completed" && !b.hasReviewed) {
                var reviewBtn = document.createElement("button");
                reviewBtn.type = "button";
                reviewBtn.className = "btn ls-btn-primary btn-sm";
                reviewBtn.textContent = "Leave Review";
                reviewBtn.addEventListener("click", function () {
                    openReviewModal(b.id);
                });
                tdActions.appendChild(reviewBtn);
            } else if (b.status === "Completed" && b.hasReviewed) {
                var reviewedBadge = document.createElement("span");
                reviewedBadge.className = "ls-status-badge ls-status-reviewed";
                reviewedBadge.textContent = "Reviewed \u2605";
                tdActions.appendChild(reviewedBadge);
            } else if (b.status === "Pending") {
                var cancelBtn = document.createElement("button");
                cancelBtn.type = "button";
                cancelBtn.className = "btn ls-btn-danger btn-sm";
                cancelBtn.textContent = "Cancel Booking";
                cancelBtn.addEventListener("click", (function (booking) {
                    return function () {
                        booking.status = "Rejected";
                        updateBookingInFirestore(booking.id, { status: "Rejected" });
                        updateProviderRequestInFirestore(booking.id, { status: "Rejected" });
                        renderCustomerTable();
                        renderCustomerMetrics();
                        renderProviderTable();
                        renderProviderMetrics();
                    };
                })(b));
                tdActions.appendChild(cancelBtn);
            } else {
                var noAction = document.createElement("span");
                noAction.style.color = "#64748b";
                noAction.style.fontSize = "0.82rem";
                noAction.textContent = "No Actions Available";
                tdActions.appendChild(noAction);
            }

            tr.appendChild(tdId);
            tr.appendChild(tdProvider);
            tr.appendChild(tdDate);
            tr.appendChild(tdLoc);
            tr.appendChild(tdStatus);
            tr.appendChild(tdActions);
            tbody.appendChild(tr);
        });
    }

    /* ===========================================
       11. CUSTOMER DASHBOARD — FILTERS
       =========================================== */
    function setupCustomerFilters() {
        var cSearch = document.getElementById("customerSearchInput");
        var cFilter = document.getElementById("customerStatusFilter");
        var cReset = document.getElementById("customerResetBtn");

        if (cSearch) cSearch.addEventListener("input", renderCustomerTable);
        if (cFilter) cFilter.addEventListener("change", renderCustomerTable);
        if (cReset) {
            cReset.addEventListener("click", function () {
                if (cSearch) cSearch.value = "";
                if (cFilter) cFilter.value = "";
                renderCustomerTable();
            });
        }
    }

    /* ===========================================
       12. REVIEW MODAL — Star Rating
       =========================================== */
    function openReviewModal(bookingId) {
        /* ---- Review Guardrail: only Completed, not yet reviewed ---- */
        var targetBooking = null;
        for (var i = 0; i < customerBookings.length; i++) {
            if (customerBookings[i].id === bookingId) {
                targetBooking = customerBookings[i];
                break;
            }
        }
        if (!targetBooking) {
            alert("Booking not found.");
            return;
        }
        if (targetBooking.status !== "Completed") {
            alert("Reviews can only be submitted for completed bookings.");
            return;
        }
        if (targetBooking.hasReviewed) {
            alert("A review has already been submitted for this booking.");
            return;
        }

        currentReviewBookingId = bookingId;
        var selectedRating = document.getElementById("selectedRating");
        var feedback = document.getElementById("reviewFeedback");
        if (selectedRating) selectedRating.value = "0";
        if (feedback) feedback.value = "";

        /* Reset star visual state */
        var stars = document.querySelectorAll("#starRating .ls-star");
        for (var j = 0; j < stars.length; j++) {
            stars[j].classList.remove("ls-star-active");
        }

        if (!reviewModal) {
            var modalEl = document.getElementById("reviewModal");
            if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                reviewModal = new bootstrap.Modal(modalEl);
            }
        }
        if (reviewModal) reviewModal.show();
    }

    function setupStarRating() {
        var stars = document.querySelectorAll("#starRating .ls-star");
        var selectedRating = document.getElementById("selectedRating");

        for (var i = 0; i < stars.length; i++) {
            stars[i].addEventListener("click", function () {
                var val = parseInt(this.getAttribute("data-value"), 10);
                if (selectedRating) selectedRating.value = val;

                /* Highlight stars up to selected */
                var allStars = document.querySelectorAll("#starRating .ls-star");
                for (var j = 0; j < allStars.length; j++) {
                    var starVal = parseInt(allStars[j].getAttribute("data-value"), 10);
                    allStars[j].classList.toggle("ls-star-active", starVal <= val);
                }
            });
        }
    }

    function setupReviewSubmit() {
        var submitBtn = document.getElementById("submitReviewBtn");
        if (submitBtn) {
            submitBtn.addEventListener("click", function () {
                var rating = document.getElementById("selectedRating") ? document.getElementById("selectedRating").value : "0";
                var feedback = document.getElementById("reviewFeedback") ? document.getElementById("reviewFeedback").value.trim() : "";

                /* ---- Review Guardrail: only Completed bookings ---- */
                var targetBooking = null;
                for (var i = 0; i < customerBookings.length; i++) {
                    if (customerBookings[i].id === currentReviewBookingId) {
                        targetBooking = customerBookings[i];
                        break;
                    }
                }
                if (!targetBooking) {
                    alert("Booking not found.");
                    return;
                }
                if (targetBooking.status !== "Completed") {
                    alert("Reviews can only be submitted for completed bookings.");
                    return;
                }
                if (targetBooking.hasReviewed) {
                    alert("A review has already been submitted for this booking.");
                    return;
                }
                if (rating === "0") {
                    alert("Please select a star rating before submitting.");
                    return;
                }
                if (!feedback) {
                    alert("Please write your feedback before submitting.");
                    return;
                }

                /* ---- Build review object ---- */
                var reviewId = generateReviewId();
                var reviewObj = {
                    id: reviewId,
                    bookingId: currentReviewBookingId,
                    name: "Customer",
                    initials: "CU",
                    service: targetBooking.category,
                    provider: targetBooking.provider,
                    rating: parseInt(rating, 10),
                    date: new Date().toISOString().split("T")[0],
                    comment: feedback,
                    verified: true,
                    avatarColor: "violet"
                };

                /* ---- Persist to Firestore ---- */
                saveReviewToFirestore(reviewObj).then(function () {
                    /* Update booking hasReviewed flag in Firestore */
                    return updateBookingInFirestore(currentReviewBookingId, { hasReviewed: true });
                }).then(function () {
                    /* Update local state */
                    targetBooking.hasReviewed = true;
                    customerReviews.unshift(reviewObj);

                    /* Re-render */
                    renderCustomerTable();
                    renderCustomerMetrics();
                    renderReviewSummary();
                    applyReviewFilters();

                    /* Close modal */
                    if (reviewModal) reviewModal.hide();
                    currentReviewBookingId = null;

                    /* Reset review form */
                    var selectedRatingEl = document.getElementById("selectedRating");
                    var feedbackEl = document.getElementById("reviewFeedback");
                    if (selectedRatingEl) selectedRatingEl.value = "0";
                    if (feedbackEl) feedbackEl.value = "";
                    var stars = document.querySelectorAll("#starRating .ls-star");
                    for (var s = 0; s < stars.length; s++) {
                        stars[s].classList.remove("ls-star-active");
                    }

                    console.log("[QuickServe] Review " + reviewId + " saved to Firestore.");
                }).catch(function (error) {
                    console.error("[QuickServe] Firestore review save error:", error);
                    alert("Failed to save review. Please try again.");
                });
            });
        }
    }

    /* ===========================================
       13. PROVIDER DASHBOARD — Metrics
       =========================================== */
    function renderProviderMetrics() {
        var container = document.getElementById("providerMetrics");
        if (!container) return;

        var pending = providerRequests.filter(function (r) {
            return r.status === "Pending";
        }).length;
        var inProgress = providerRequests.filter(function (r) {
            return r.status === "In Progress";
        }).length;

        /* Simulated total earnings */
        var completedCount = providerRequests.filter(function (r) {
            return r.status === "Completed";
        }).length;
        var earnings = completedCount * 150;

        container.innerHTML =
            '<div class="col-sm-4">' +
                '<div class="ls-metric-card ls-metric-amber">' +
                    '<span class="ls-metric-label">Pending Requests</span>' +
                    '<span class="ls-metric-value">' + pending + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="col-sm-4">' +
                '<div class="ls-metric-card ls-metric-violet">' +
                    '<span class="ls-metric-label">Jobs In Progress</span>' +
                    '<span class="ls-metric-value">' + inProgress + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="col-sm-4">' +
                '<div class="ls-metric-card ls-metric-green">' +
                    '<span class="ls-metric-label">Total Earnings</span>' +
                    '<span class="ls-metric-value">$' + earnings + '</span>' +
                '</div>' +
            '</div>';
    }

    /* ===========================================
       14. PROVIDER DASHBOARD — Table
       =========================================== */
    function renderProviderTable() {
        var tbody = document.getElementById("providerTableBody");
        var noRes = document.getElementById("providerNoResults");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (providerRequests.length === 0) {
            if (noRes) noRes.classList.remove("d-none");
            return;
        }
        if (noRes) noRes.classList.add("d-none");

        providerRequests.forEach(function (r) {
            var tr = document.createElement("tr");

            /* Booking ID & Customer */
            var tdId = document.createElement("td");
            var idSpan = document.createElement("span");
            idSpan.className = "ls-booking-id";
            idSpan.textContent = "#" + r.id;
            var custName = document.createElement("div");
            custName.style.fontSize = "0.85rem";
            custName.style.color = "#cbd5e1";
            custName.style.marginTop = "0.2rem";
            custName.textContent = r.customer;
            tdId.appendChild(idSpan);
            tdId.appendChild(custName);

            /* Service & Description */
            var tdService = document.createElement("td");
            var svcName = document.createElement("div");
            svcName.style.fontWeight = "600";
            svcName.style.color = "#f1f5f9";
            svcName.textContent = r.service;
            var svcDesc = document.createElement("div");
            svcDesc.style.fontSize = "0.82rem";
            svcDesc.style.color = "#94a3b8";
            svcDesc.style.marginTop = "0.2rem";
            svcDesc.textContent = r.description;
            tdService.appendChild(svcName);
            tdService.appendChild(svcDesc);

            /* Scheduled Slot */
            var tdSlot = document.createElement("td");
            tdSlot.textContent = formatDate(r.date) + " " + r.time;

            /* Status Badge */
            var tdStatus = document.createElement("td");
            var badge = document.createElement("span");
            badge.className = "ls-status-badge " + getStatusBadgeClass(r.status);
            badge.textContent = r.status;
            tdStatus.appendChild(badge);

            /* Actions — State Machine */
            var tdActions = document.createElement("td");

            if (r.status === "Pending") {
                var acceptBtn = document.createElement("button");
                acceptBtn.type = "button";
                acceptBtn.className = "btn ls-btn-success btn-sm me-1";
                acceptBtn.textContent = "Accept";
                acceptBtn.addEventListener("click", (function (req) {
                    return function () {
                        req.status = "Accepted";
                        updateProviderRequestInFirestore(req.id, { status: "Accepted" });
                        updateBookingInFirestore(req.id, { status: "Accepted" });
                        renderProviderTable();
                        renderProviderMetrics();
                        renderCustomerTable();
                        renderCustomerMetrics();
                    };
                })(r));

                var rejectBtn = document.createElement("button");
                rejectBtn.type = "button";
                rejectBtn.className = "btn ls-btn-danger btn-sm";
                rejectBtn.textContent = "Reject";
                rejectBtn.addEventListener("click", (function (req) {
                    return function () {
                        req.status = "Rejected";
                        updateProviderRequestInFirestore(req.id, { status: "Rejected" });
                        updateBookingInFirestore(req.id, { status: "Rejected" });
                        renderProviderTable();
                        renderProviderMetrics();
                        renderCustomerTable();
                        renderCustomerMetrics();
                    };
                })(r));

                tdActions.appendChild(acceptBtn);
                tdActions.appendChild(rejectBtn);

            } else if (r.status === "Accepted") {
                var startBtn = document.createElement("button");
                startBtn.type = "button";
                startBtn.className = "btn ls-btn-purple btn-sm";
                startBtn.textContent = "Start Job";
                startBtn.addEventListener("click", (function (req) {
                    return function () {
                        req.status = "In Progress";
                        updateProviderRequestInFirestore(req.id, { status: "In Progress" });
                        updateBookingInFirestore(req.id, { status: "In Progress" });
                        renderProviderTable();
                        renderProviderMetrics();
                        renderCustomerTable();
                        renderCustomerMetrics();
                    };
                })(r));
                tdActions.appendChild(startBtn);

            } else if (r.status === "In Progress") {
                var completeBtn = document.createElement("button");
                completeBtn.type = "button";
                completeBtn.className = "btn ls-btn-success btn-sm";
                completeBtn.textContent = "Mark as Completed";
                completeBtn.addEventListener("click", (function (req) {
                    return function () {
                        req.status = "Completed";
                        updateProviderRequestInFirestore(req.id, { status: "Completed" });
                        updateBookingInFirestore(req.id, { status: "Completed" });
                        renderProviderTable();
                        renderProviderMetrics();
                        renderCustomerTable();
                        renderCustomerMetrics();
                    };
                })(r));
                tdActions.appendChild(completeBtn);

            } else {
                /* Rejected or Completed — no actions */
                var noAction = document.createElement("span");
                noAction.style.color = "#64748b";
                noAction.style.fontSize = "0.82rem";
                noAction.textContent = "No Actions Available";
                tdActions.appendChild(noAction);
            }

            tr.appendChild(tdId);
            tr.appendChild(tdService);
            tr.appendChild(tdSlot);
            tr.appendChild(tdStatus);
            tr.appendChild(tdActions);
            tbody.appendChild(tr);
        });
    }

    /* ===========================================
       15. ROLE TOGGLE — switchDashboardView(role)
       =========================================== */
    function switchDashboardView(role) {
        var custDash = document.getElementById("customerDashboard");
        var provDash = document.getElementById("providerDashboard");
        var toggleContainer = document.getElementById("roleToggleContainer");
        var toggleBtns = document.querySelectorAll("#roleToggleContainer .ls-role-toggle-btn");

        /* Toggle hero section */
        if (heroSection) {
            heroSection.classList.toggle("d-none", !!role);
        }

        /* Show/hide dashboards */
        if (custDash) custDash.classList.toggle("d-none", role !== "customer");
        if (provDash) provDash.classList.toggle("d-none", role !== "provider");

        /* Update active pill button */
        for (var i = 0; i < toggleBtns.length; i++) {
            var btnRole = toggleBtns[i].getAttribute("data-role");
            toggleBtns[i].classList.toggle("active", btnRole === role);
        }

        /* Scroll to the visible dashboard */
        if (role === "customer" && custDash) {
            custDash.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (role === "provider" && provDash) {
            provDash.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    window.switchDashboardView = switchDashboardView;

    /* Attach click listeners to toggle buttons (no inline handlers) */
    var roleToggleBtns = document.querySelectorAll("#roleToggleContainer .ls-role-toggle-btn");
    for (var t = 0; t < roleToggleBtns.length; t++) {
        roleToggleBtns[t].addEventListener("click", function () {
            var role = this.getAttribute("data-role");
            switchDashboardView(role);
        });
    }

    /* ===========================================
       16. CUSTOMER REVIEWS — Data
       =========================================== */
    var customerReviews = [
        { id: 1, name: "Anna Nguyen", initials: "AN", service: "Plumbing", provider: "Mike's Plumbing Co.", rating: 5, date: "2026-08-20", comment: "Mike responded within 30 minutes and fixed our kitchen sink leak the same day. Professional, clean work. Highly recommend to anyone needing fast plumbing service!", verified: true, avatarColor: "violet" },
        { id: 2, name: "James Davis", initials: "JD", service: "Electrical", provider: "BrightSpark Electric", rating: 5, date: "2026-08-18", comment: "Installed new ceiling fans in our living room and bedrooms. Everything works perfectly. Very knowledgeable and courteous team.", verified: true, avatarColor: "amber" },
        { id: 3, name: "Priya Patel", initials: "PP", service: "Cleaning", provider: "FreshSpace Cleaning", rating: 4, date: "2026-08-15", comment: "Deep cleaning of our 2-bedroom apartment was thorough. Kitchen and bathrooms look brand new. Scheduling was a breeze.", verified: true, avatarColor: "green" },
        { id: 4, name: "Carlos Mendez", initials: "CM", service: "Carpentry", provider: "WoodCraft Carpentry", rating: 5, date: "2026-08-12", comment: "Custom bookshelf built to perfectly fit our alcove. The craftsmanship is outstanding and the finish matches our existing furniture.", verified: true, avatarColor: "blue" },
        { id: 5, name: "Sarah Kim", initials: "SK", service: "AC Repair", provider: "CoolBreeze AC Services", rating: 4, date: "2026-08-10", comment: "Our AC unit was blowing warm air on a 100F day. Technician arrived within 2 hours and had it running cold again. Fair pricing too.", verified: true, avatarColor: "red" },
        { id: 6, name: "David Okafor", initials: "DO", service: "Plumbing", provider: "QuickFix Plumbers", rating: 3, date: "2026-08-08", comment: "Good work on the pipe repair but took longer than quoted. The final result was solid and the leak is completely fixed.", verified: true, avatarColor: "amber" },
        { id: 7, name: "Emily Zhang", initials: "EZ", service: "Electrical", provider: "SparkWired Electrical", rating: 5, date: "2026-08-05", comment: "Full panel upgrade completed ahead of schedule. The electrician walked me through every step and left the workspace spotless.", verified: true, avatarColor: "violet" },
        { id: 8, name: "Michael Brown", initials: "MB", service: "Cleaning", provider: "SparkleHouse Cleaners", rating: 5, date: "2026-08-03", comment: "Weekly cleaning service has been consistently excellent for 3 months now. They remember our preferences and always do a thorough job.", verified: true, avatarColor: "green" },
        { id: 9, name: "Laura Sanchez", initials: "LS", service: "AC Repair", provider: "ACMaster Pro", rating: 4, date: "2026-08-01", comment: "Split AC installation went smoothly. The team was punctual and explained the maintenance schedule. Minor delay due to part delivery.", verified: true, avatarColor: "blue" }
    ];

    /* ===========================================
       17. CUSTOMER REVIEWS — Render Summary
       =========================================== */
    function renderReviewSummary() {
        if (customerReviews.length === 0) return;

        var total = customerReviews.length;
        var sum = 0;
        var dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        for (var i = 0; i < total; i++) {
            var r = customerReviews[i].rating;
            sum += r;
            if (dist[r] !== undefined) dist[r]++;
        }
        var avg = (sum / total).toFixed(1);

        var scoreBig = document.querySelector(".ls-review-score-big");
        var scoreCount = document.querySelector(".ls-review-score-count");
        if (scoreBig) scoreBig.textContent = avg;
        if (scoreCount) scoreCount.textContent = "Based on " + total + " verified review" + (total !== 1 ? "s" : "");

        var bars = document.querySelectorAll(".ls-review-dist-row");
        for (var b = 0; b < bars.length; b++) {
            var stars = 5 - b;
            var count = dist[stars] || 0;
            var pct = total > 0 ? Math.round((count / total) * 100) : 0;
            var fill = bars[b].querySelector(".ls-review-dist-fill");
            var countEl = bars[b].querySelector(".ls-review-dist-count");
            if (fill) fill.style.width = pct + "%";
            if (countEl) countEl.textContent = count;
        }
    }

    /* ===========================================
       18. CUSTOMER REVIEWS — Render Cards
       =========================================== */
    function renderReviews(list) {
        var grid = document.getElementById("reviewsGrid");
        var noRes = document.getElementById("reviewsNoResults");
        if (!grid) return;
        grid.innerHTML = "";

        if (list.length === 0) {
            if (noRes) noRes.classList.remove("d-none");
            return;
        }
        if (noRes) noRes.classList.add("d-none");

        list.forEach(function (rev) {
            var col = document.createElement("div");
            col.className = "col-12 col-md-6 col-lg-4";

            var card = document.createElement("div");
            card.className = "ls-review-card";

            /* Header: Avatar + Author */
            var header = document.createElement("div");
            header.className = "ls-review-card-header";

            var avatar = document.createElement("div");
            avatar.className = "ls-review-avatar " + rev.avatarColor;
            avatar.textContent = rev.initials;

            var authorInfo = document.createElement("div");
            authorInfo.className = "ls-review-author-info";

            var authorName = document.createElement("div");
            authorName.className = "ls-review-author-name";
            authorName.textContent = rev.name;
            if (rev.verified) {
                var badge = document.createElement("span");
                badge.className = "ls-review-verified";
                badge.textContent = "Verified";
                authorName.appendChild(badge);
            }

            var meta = document.createElement("div");
            meta.className = "ls-review-meta";
            meta.textContent = formatDate(rev.date);
            var catTag = document.createElement("span");
            catTag.className = "ls-review-meta-tag";
            catTag.textContent = rev.service;
            meta.appendChild(catTag);

            authorInfo.appendChild(authorName);
            authorInfo.appendChild(meta);
            header.appendChild(avatar);
            header.appendChild(authorInfo);

            /* Stars */
            var starsRow = document.createElement("div");
            starsRow.className = "ls-review-stars";
            for (var s = 1; s <= 5; s++) {
                var star = document.createElement("span");
                star.className = "ls-review-star" + (s > rev.rating ? " empty" : "");
                star.textContent = "\u2605";
                starsRow.appendChild(star);
            }

            /* Comment */
            var comment = document.createElement("div");
            comment.className = "ls-review-comment";
            comment.textContent = rev.comment;

            /* Provider tag */
            var providerTag = document.createElement("div");
            providerTag.className = "ls-review-provider-tag";
            var reviewedLabel = document.createElement("span");
            reviewedLabel.textContent = "Reviewed ";
            var providerStrong = document.createElement("strong");
            providerStrong.textContent = rev.provider;
            providerTag.appendChild(reviewedLabel);
            providerTag.appendChild(providerStrong);

            card.appendChild(header);
            card.appendChild(starsRow);
            card.appendChild(comment);
            card.appendChild(providerTag);
            col.appendChild(card);
            grid.appendChild(col);
        });
    }

    /* ===========================================
       19. CUSTOMER REVIEWS — Filters & Sort
       =========================================== */
    function getFilteredReviews() {
        var catFilter = document.getElementById("reviewCategoryFilter");
        var sortSelect = document.getElementById("reviewSortSelect");
        var category = catFilter ? catFilter.value : "";
        var sortBy = sortSelect ? sortSelect.value : "recent";

        var filtered = customerReviews.filter(function (r) {
            return !category || r.service === category;
        });

        filtered.sort(function (a, b) {
            if (sortBy === "highest") return b.rating - a.rating;
            if (sortBy === "lowest") return a.rating - b.rating;
            /* most recent */
            return new Date(b.date) - new Date(a.date);
        });

        return filtered;
    }

    function applyReviewFilters() {
        renderReviews(getFilteredReviews());
    }

    /* ===========================================
       20. PUBLIC REVIEW MODAL — Star Rating
       =========================================== */
    function setupPublicStarRating() {
        var stars = document.querySelectorAll("#publicStarRating .ls-star");
        var selectedRating = document.getElementById("publicSelectedRating");

        for (var i = 0; i < stars.length; i++) {
            stars[i].addEventListener("click", function () {
                var val = parseInt(this.getAttribute("data-value"), 10);
                if (selectedRating) selectedRating.value = val;
                var allStars = document.querySelectorAll("#publicStarRating .ls-star");
                for (var j = 0; j < allStars.length; j++) {
                    var starVal = parseInt(allStars[j].getAttribute("data-value"), 10);
                    allStars[j].classList.toggle("ls-star-active", starVal <= val);
                }
            });
        }
    }

    function setupPublicReviewSubmit() {
        var submitBtn = document.getElementById("submitPublicReviewBtn");
        var publicModal = null;

        if (submitBtn) {
            submitBtn.addEventListener("click", function () {
                var providerSelect = document.getElementById("reviewProviderSelect");
                var serviceSelect = document.getElementById("reviewServiceSelect");
                var selectedRating = document.getElementById("publicSelectedRating");
                var reviewText = document.getElementById("publicReviewText");

                var provider = providerSelect ? providerSelect.value : "";
                var service = serviceSelect ? serviceSelect.value : "";
                var rating = selectedRating ? selectedRating.value : "0";
                var comment = reviewText ? reviewText.value.trim() : "";

                /* Validation */
                if (!provider) {
                    alert("Please select a provider.");
                    return;
                }
                if (!service) {
                    alert("Please select a service category.");
                    return;
                }
                if (rating === "0") {
                    alert("Please select a star rating.");
                    return;
                }
                if (!comment) {
                    alert("Please write your review.");
                    return;
                }

                /* Build initials from provider name */
                var words = provider.split(" ");
                var initials = "";
                for (var w = 0; w < words.length && initials.length < 2; w++) {
                    if (words[w].length > 0) initials += words[w].charAt(0).toUpperCase();
                }

                var colors = ["violet", "amber", "green", "blue", "red"];
                var randomColor = colors[Math.floor(Math.random() * colors.length)];

                var newReview = {
                    id: customerReviews.length + 1,
                    name: "Anonymous User",
                    initials: initials,
                    service: service,
                    provider: provider,
                    rating: parseInt(rating, 10),
                    date: new Date().toISOString().split("T")[0],
                    comment: comment,
                    verified: false,
                    avatarColor: randomColor
                };

                /* Add to array and re-render */
                customerReviews.unshift(newReview);
                renderReviewSummary();
                applyReviewFilters();

                /* Reset form */
                if (providerSelect) providerSelect.value = "";
                if (serviceSelect) serviceSelect.value = "";
                if (selectedRating) selectedRating.value = "0";
                if (reviewText) reviewText.value = "";
                var resetStars = document.querySelectorAll("#publicStarRating .ls-star");
                for (var r = 0; r < resetStars.length; r++) {
                    resetStars[r].classList.remove("ls-star-active");
                }

                /* Close modal */
                var modalEl = document.getElementById("addPublicReviewModal");
                if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                    if (!publicModal) publicModal = new bootstrap.Modal(modalEl);
                    publicModal.hide();
                }

                console.log("[QuickServe] Public review submitted for " + provider);
            });
        }
    }

    /* ===========================================
       22. BOOKING FORM — SUBMIT HANDLER
       =========================================== */
    function setupBookingSubmit() {
        var confirmBtn = document.getElementById("confirmBookingBtn");
        if (!confirmBtn) return;

        confirmBtn.addEventListener("click", function () {
            var service = document.getElementById("bookingService") ? document.getElementById("bookingService").value : "";
            var date = document.getElementById("bookingDate") ? document.getElementById("bookingDate").value : "";
            var time = document.getElementById("bookingTime") ? document.getElementById("bookingTime").value : "";
            var location = document.getElementById("bookingLocation") ? document.getElementById("bookingLocation").value.trim() : "";
            var description = document.getElementById("bookingDescription") ? document.getElementById("bookingDescription").value.trim() : "";

            /* ---- Strict field validation ---- */
            if (!service) {
                alert("Please select a service.");
                return;
            }
            if (!date) {
                alert("Please select a date.");
                return;
            }
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            if (new Date(date) < today) {
                alert("The booking date cannot be in the past.");
                return;
            }
            if (!time) {
                alert("Please select a time.");
                return;
            }
            if (!location) {
                alert("Please enter a service location.");
                return;
            }
            if (!description) {
                alert("Please describe the job.");
                return;
            }

            /* ---- Generate unique booking ID ---- */
            var bookingId = generateBookingId();

            /* ---- Format time for display ---- */
            var timeParts = time.split(":");
            var hours = parseInt(timeParts[0], 10);
            var minutes = timeParts[1];
            var ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;
            var formattedTime = hours + ":" + minutes + " " + ampm;

            var newBooking = {
                id: bookingId,
                provider: currentBookingProvider ? currentBookingProvider.name : "",
                category: service,
                date: date,
                time: formattedTime,
                location: location,
                description: description,
                status: "Pending",
                hasReviewed: false,
                createdAt: new Date().toISOString()
            };

            /* ---- Persist to Firestore ---- */
            saveBookingToFirestore(newBooking).then(function () {
                /* Also create matching provider request */
                var newRequest = {
                    id: bookingId,
                    customer: "Customer",
                    service: service,
                    description: description,
                    date: date,
                    time: formattedTime,
                    status: "Pending"
                };
                return saveProviderRequestToFirestore(newRequest);
            }).then(function () {
                /* Add to local arrays */
                customerBookings.unshift(newBooking);
                providerRequests.unshift({
                    id: bookingId,
                    customer: "Customer",
                    service: service,
                    description: description,
                    date: date,
                    time: formattedTime,
                    status: "Pending"
                });

                /* Re-render tables */
                renderCustomerTable();
                renderCustomerMetrics();
                renderProviderTable();
                renderProviderMetrics();

                /* Close modal */
                if (bookingModal) bookingModal.hide();
                currentBookingProvider = null;

                alert("Booking " + bookingId + " confirmed!");
                console.log("[QuickServe] Booking " + bookingId + " saved to Firestore.");
            }).catch(function (error) {
                console.error("[QuickServe] Firestore save error:", error);
                alert("Failed to save booking. Please try again.");
            });
        });
    }

    /* ===========================================
       21. CARDS — EVENT LISTENERS
       =========================================== */
    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (categorySelect) categorySelect.addEventListener("change", applyFilters);
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            if (categorySelect) categorySelect.value = "";
            applyFilters();
        });
    }

    /* Review section filters */
    var reviewCatFilter = document.getElementById("reviewCategoryFilter");
    var reviewSortSel = document.getElementById("reviewSortSelect");
    var reviewResetBtn = document.getElementById("reviewResetBtn");

    if (reviewCatFilter) reviewCatFilter.addEventListener("change", applyReviewFilters);
    if (reviewSortSel) reviewSortSel.addEventListener("change", applyReviewFilters);
    if (reviewResetBtn) {
        reviewResetBtn.addEventListener("click", function () {
            if (reviewCatFilter) reviewCatFilter.value = "";
            if (reviewSortSel) reviewSortSel.value = "recent";
            applyReviewFilters();
        });
    }

    /* ===========================================
       17. CHATBOT WIDGET
       =========================================== */
    function setupChatbot() {
        var chatToggle = document.getElementById("chatToggleBtn");
        var chatClose = document.getElementById("closeChatBtn");
        var chatContainer = document.getElementById("chatContainer");
        var chatMessages = document.getElementById("chatMessages");
        var chatForm = document.getElementById("chatForm");
        var chatInput = document.getElementById("chatInput");
        var chatChips = document.querySelectorAll(".ls-chat-chip");

        if (!chatToggle || !chatContainer) return;

        /* Toggle open/close */
        chatToggle.addEventListener("click", function () {
            chatContainer.classList.toggle("d-none");
            if (!chatContainer.classList.contains("d-none")) {
                chatInput.focus();
            }
        });

        if (chatClose) {
            chatClose.addEventListener("click", function () {
                chatContainer.classList.add("d-none");
            });
        }

        /* Add a message bubble */
        function addMessage(text, type) {
            var bubble = document.createElement("div");
            bubble.className = "ls-chat-bubble " + type;
            bubble.textContent = text;
            chatMessages.appendChild(bubble);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        /* Bot keyword response engine */
        function getBotResponse(input) {
            var lower = input.toLowerCase();
            if (lower.indexOf("book") !== -1 || lower.indexOf("service") !== -1) {
                return "You can search for verified providers above and click 'Book Service' to reserve a slot!";
            }
            if (lower.indexOf("price") !== -1 || lower.indexOf("rate") !== -1 || lower.indexOf("cost") !== -1) {
                return "All providers list their transparent hourly rates directly on their profile cards.";
            }
            if (lower.indexOf("dashboard") !== -1 || lower.indexOf("status") !== -1) {
                return "Log in to view your Customer or Provider dashboard and track active job statuses.";
            }
            if (lower.indexOf("review") !== -1 || lower.indexOf("rating") !== -1) {
                return "You can leave a review after completing a booking. Check our Reviews section to see what others are saying!";
            }
            if (lower.indexOf("hello") !== -1 || lower.indexOf("hi") !== -1 || lower.indexOf("hey") !== -1) {
                return "Hello! I'm here to help you find and book local services. What can I do for you?";
            }
            return "Thanks for reaching out! A service representative will assist you shortly.";
        }

        /* Handle send */
        function handleSend() {
            var text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, "user");
            chatInput.value = "";

            /* Bot reply after delay */
            setTimeout(function () {
                addMessage(getBotResponse(text), "bot");
            }, 400);
        }

        /* Form submit */
        if (chatForm) {
            chatForm.addEventListener("submit", function (e) {
                e.preventDefault();
                handleSend();
            });
        }

        /* Quick suggestion chips */
        for (var i = 0; i < chatChips.length; i++) {
            chatChips[i].addEventListener("click", function () {
                var msg = this.getAttribute("data-msg");
                if (msg) {
                    addMessage(msg, "user");
                    setTimeout(function () {
                        addMessage(getBotResponse(msg), "bot");
                    }, 400);
                }
            });
        }

        /* Welcome message */
        addMessage("Hello! How can I help you find or book a service on QuickServe today?", "bot");
    }

    /* ===========================================
       18. INIT ON DOM READY
       =========================================== */
    document.addEventListener("DOMContentLoaded", function () {
        window.scrollTo(0, 0);

        /* Navbar — default logged out, hide both dashboards */
        updateNavbarUI(null, null);
        switchDashboardView(null);

        /* Provider cards */
        renderProviders(providers);

        /* Customer dashboard */
        renderCustomerMetrics();
        renderCustomerTable();
        setupCustomerFilters();

        /* Provider dashboard */
        renderProviderMetrics();
        renderProviderTable();

        /* Review modal */
        setupStarRating();
        setupReviewSubmit();

        /* Booking modal */
        setupBookingSubmit();

        /* Customer reviews section */
        renderReviewSummary();
        renderReviews(getFilteredReviews());
        setupPublicStarRating();
        setupPublicReviewSubmit();

        /* Chatbot widget */
        setupChatbot();

        /* ---- Load persisted data from Firestore ---- */
        Promise.all([
            loadBookingsFromFirestore(),
            loadProviderRequestsFromFirestore(),
            loadReviewsFromFirestore()
        ]).then(function () {
            /* Re-render with Firestore data */
            renderCustomerMetrics();
            renderCustomerTable();
            renderProviderMetrics();
            renderProviderTable();
            renderReviewSummary();
            applyReviewFilters();
            console.log("[QuickServe] Firestore data loaded.");
        }).catch(function (err) {
            console.error("[QuickServe] Error loading Firestore data:", err);
        });

        /* ---- Firebase Auth State Listener ---- */
        if (typeof firebase !== "undefined" && firebase.auth) {
            var auth = firebase.auth();
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    /* User is logged in — show logout, hide login/register, hide hero, show dashboard */
                    updateNavbarUI(user, null);
                    switchDashboardView("customer");
                    console.log("[QuickServe] Auth state: logged in as " + user.email);
                } else {
                    /* User is logged out — show login/register, hide logout, show hero, hide dashboards */
                    updateNavbarUI(null, null);
                    switchDashboardView(null);
                    console.log("[QuickServe] Auth state: logged out");
                }
            });
        }

        /* ---- Logout Button Click Handler ---- */
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                if (typeof firebase !== "undefined" && firebase.auth) {
                    var authRef = firebase.auth();
                    authRef.signOut().then(function () {
                        console.log("[QuickServe] signOut(auth) successful.");
                    }).catch(function (error) {
                        console.error("[QuickServe] signOut error:", error);
                    });
                }
            });
        }
    });

})();
