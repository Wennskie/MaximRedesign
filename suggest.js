document.addEventListener('DOMContentLoaded', function() {
    // First, fix the app container to allow scrolling
    const appContainer = document.querySelector('.app-container');
    appContainer.style.height = 'auto';
    appContainer.style.minHeight = '100vh';
    appContainer.style.overflow = 'visible';
    
    // Make sure the main content area is scrollable
    const mainContent = document.querySelector('main');
    mainContent.style.paddingBottom = '80px'; // Add padding for bottom navigation
    
    // Fix bottom navigation to stay at bottom without affecting scroll
    const bottomNav = document.querySelector('.bottom-nav');
    bottomNav.style.position = 'fixed';
    bottomNav.style.bottom = '0';
    bottomNav.style.width = '100%';
    bottomNav.style.maxWidth = '480px'; // Match app container max-width
    
    // Fix navigation dots position
    const navDots = document.querySelector('.nav-dots');
    if (navDots) {
        navDots.style.position = 'fixed';
        navDots.style.bottom = '15px';
        navDots.style.width = '100%';
        navDots.style.maxWidth = '480px'; // Match app container max-width
    }
    
    // Handle transport option selection
    const transportOptions = document.querySelectorAll('.transport-option');
    transportOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            transportOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update order button text based on selection
            const orderBtn = document.querySelector('.order-btn');
            const transportType = this.querySelector('.transport-name').textContent;
            
            if (transportType === 'Bike' || transportType === 'Car') {
                orderBtn.textContent = 'MEMESAN';
            } else if (transportType === 'Delivery') {
                orderBtn.textContent = 'KIRIM PAKET';
            } else if (transportType === 'Food') {
                orderBtn.textContent = 'PESAN MAKANAN';
            }
        });
    });

    // Handle schedule option selection
    const scheduleOptions = document.querySelectorAll('.schedule-option-btn');

    scheduleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionText = this.querySelector('span').textContent;
            
            // Handle payment option click (all payment methods)
            if (optionText === 'Tunai' || optionText === 'Gopay' || optionText === 'OVO' || optionText === 'Dana') {
                showPaymentOptions(optionText);
            }
            
            // Handle time option click (all time formats)
            if (optionText === 'Saat ini' || optionText.match(/^\d{2}:\d{2}$/)) {
                showTimeOptions();
            }
            
            // Toggle active class for schedule options when needed
            scheduleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Function to show payment options
    function showPaymentOptions(currentPayment) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        
        // Create payment options
        const paymentOptions = ['Tunai', 'Gopay', 'OVO', 'Dana'];
        let modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Pilih Metode Pembayaran</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="payment-options">
        `;
        
        paymentOptions.forEach(option => {
            modalContent += `
                <div class="payment-option" data-payment="${option}">
                    <div class="payment-icon">
                        <i class="fas ${option === 'Tunai' ? 'fa-money-bill' : 'fa-wallet'}"></i>
                    </div>
                    <div class="payment-name">${option}</div>
                    <div class="payment-check ${option === currentPayment ? 'selected' : ''}">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
            `;
        });
        
        modalContent += `
                </div>
                <button class="confirm-payment">Konfirmasi</button>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Add event listeners for payment options
        modal.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', function() {
                modal.querySelectorAll('.payment-check').forEach(check => {
                    check.classList.remove('selected');
                });
                this.querySelector('.payment-check').classList.add('selected');
            });
        });
        
        // Add event listener for close button
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        
        // Add event listener for confirm button
        modal.querySelector('.confirm-payment').addEventListener('click', () => {
            const selectedPayment = modal.querySelector('.payment-check.selected').parentElement.dataset.payment;
            document.querySelector('.schedule-option-btn:first-child span').textContent = selectedPayment;
            
            // Change icon based on selection
            const paymentIcon = document.querySelector('.schedule-option-btn:first-child i');
            if (selectedPayment === 'Tunai') {
                paymentIcon.className = 'fas fa-money-bill';
            } else {
                paymentIcon.className = 'fas fa-wallet';
            }
            
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    }

    // Function to show time options
    function showTimeOptions() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'time-modal';
        
        // Get current time
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Get current selected time from button
        const currentTimeText = document.querySelector('.schedule-option-btn:nth-child(2) span').textContent;
        const isScheduled = currentTimeText !== 'Saat ini';
        let selectedHour = currentHour;
        let selectedMinute = Math.floor(currentMinute/5)*5;
        
        // If already scheduled, parse the time
        if (isScheduled && currentTimeText.match(/^\d{2}:\d{2}$/)) {
            const [hours, minutes] = currentTimeText.split(':').map(Number);
            selectedHour = hours;
            selectedMinute = minutes;
        }
        
        // Create time picker
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Pilih Waktu Penjemputan</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="time-options">
                    <div class="time-option ${!isScheduled ? 'active' : ''}" data-time="now">
                        <i class="fas fa-clock"></i>
                        <span>Saat ini</span>
                    </div>
                    <div class="time-option ${isScheduled ? 'active' : ''}" data-time="scheduled">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Jadwalkan</span>
                    </div>
                </div>
                <div class="time-picker" style="display: ${isScheduled ? 'block' : 'none'};">
                    <div class="time-picker-header">Pilih Waktu</div>
                    <div class="time-picker-content">
                        <div class="time-selector">
                            <label>Jam</label>
                            <select id="hour-select">
                                ${Array.from({length: 24}, (_, i) => 
                                    `<option value="${i}" ${i === selectedHour ? 'selected' : ''}>${i.toString().padStart(2, '0')}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="time-separator">:</div>
                        <div class="time-selector">
                            <label>Menit</label>
                            <select id="minute-select">
                                ${Array.from({length: 12}, (_, i) => i*5).map(min => 
                                    `<option value="${min}" ${min === selectedMinute ? 'selected' : ''}>${min.toString().padStart(2, '0')}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                </div>
                <button class="confirm-time">Konfirmasi</button>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Add event listeners for time options
        const timePicker = modal.querySelector('.time-picker');
        modal.querySelectorAll('.time-option').forEach(option => {
            option.addEventListener('click', function() {
                modal.querySelectorAll('.time-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                
                // Show/hide time picker based on selection
                if (this.dataset.time === 'scheduled') {
                    timePicker.style.display = 'block';
                } else {
                    timePicker.style.display = 'none';
                }
            });
        });
        
        // Add event listener for close button
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        
        // Add event listener for confirm button
        modal.querySelector('.confirm-time').addEventListener('click', () => {
            const timeOption = modal.querySelector('.time-option.active').dataset.time;
            
            if (timeOption === 'now') {
                document.querySelector('.schedule-option-btn:nth-child(2) span').textContent = 'Saat ini';
                document.querySelector('.schedule-option-btn:nth-child(2) i').className = 'fas fa-clock';
            } else {
                const hour = document.getElementById('hour-select').value;
                const minute = document.getElementById('minute-select').value;
                const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                document.querySelector('.schedule-option-btn:nth-child(2) span').textContent = formattedTime;
                document.querySelector('.schedule-option-btn:nth-child(2) i').className = 'fas fa-calendar-alt';
            }
            
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    }

    // Handle order button click
    const orderBtn = document.querySelector('.order-btn');

    orderBtn.addEventListener('click', function() {
        const pickupLocation = document.querySelector('.location-address').textContent;
        const destination = document.querySelector('.destination .location-label') ? 
                           document.querySelector('.destination .location-label').textContent : 'Tujuan';
        const transportType = document.querySelector('.transport-option.active') ? 
                            document.querySelector('.transport-option.active .transport-name').textContent : 'Car';
        const paymentMethod = document.querySelector('.schedule-option-btn:first-child span') ? 
                            document.querySelector('.schedule-option-btn:first-child span').textContent : 'Tunai';
        const timeOption = document.querySelector('.schedule-option-btn:nth-child(2) span') ? 
                         document.querySelector('.schedule-option-btn:nth-child(2) span').textContent : 'Saat ini';
        
        if (destination === 'Tujuan') {
            // Show alert if destination is not set
            alert('Silakan pilih tujuan Anda terlebih dahulu');
        } else {
            // Show booking confirmation with payment and time details
            let confirmMessage = `Pemesanan ${transportType} dari ${pickupLocation} menuju ${destination} berhasil!\n`;
            confirmMessage += `Metode pembayaran: ${paymentMethod}\n`;
            confirmMessage += `Waktu: ${timeOption === 'Saat ini' ? 'Sekarang' : timeOption}\n`;
            confirmMessage += `Driver akan segera menghubungi Anda.`;
            
            alert(confirmMessage);
        }
    });

    // Handle navigation item clicks
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // const navName = this.querySelector('span').textContent;
            // if (navName !== 'Beranda') {
            //     alert(`Halaman ${navName} sedang dalam pengembangan`);
            // }
        });
    });

    // Handle location selection
    const locationSelectors = document.querySelectorAll('.pickup-location, .destination');

    locationSelectors.forEach(selector => {
        selector.addEventListener('click', function() {
            const type = this.classList.contains('pickup-location') ? 'penjemputan' : 'tujuan';
            showLocationSelector(type);
        });
    });

    // Create missing destination element if it doesn't exist yet
    if (!document.querySelector('.destination')) {
        const locationCard = document.querySelector('.location-card');
        const destinationDiv = document.createElement('div');
        destinationDiv.className = 'destination';
        destinationDiv.innerHTML = `
            <div class="location-icon">
                <i class="fas fa-map-marker-alt blue-marker"></i>
            </div>
            <div class="location-details">
                <div class="location-label">Tujuan</div>
            </div>
            <div class="chevron">
                <i class="fas fa-chevron-right"></i>
            </div>
        `;
        locationCard.appendChild(destinationDiv);
    }

    // Simulate location selector
    function showLocationSelector(type) {
        if (type === 'tujuan') {
            const destinations = [
                'Mall Grand Indonesia',
                'Stasiun Gambir',
                'Bandara Soekarno-Hatta',
                'Taman Mini Indonesia Indah',
                'Monas'
            ];
            
            let locationOptions = 'Pilih lokasi tujuan:\n\n';
            destinations.forEach((dest, index) => {
                locationOptions += `${index + 1}. ${dest}\n`;
            });
            
            const selectedIndex = prompt(locationOptions, '1') - 1;
            if (selectedIndex >= 0 && selectedIndex < destinations.length) {
                document.querySelector('.destination .location-label').textContent = destinations[selectedIndex];
            }
        }
    }

    // Add focus effect to pickup input
    const pickupInput = document.querySelector('.pickup-input');

    pickupInput.addEventListener('focus', function() {
        this.setAttribute('placeholder', 'Titik Penjemputan (Rekomendasi)');
    });

    pickupInput.addEventListener('blur', function() {
        this.setAttribute('placeholder', 'Titik Penjemputan (Rekomendasi)');
    });

    // Handler untuk tombol lokasi saat ini
    const currentLocationBtn = document.querySelector('.current-location-btn');
    
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', function() {
            window.location.href = 'order.html';
        });
    } else {
        console.error('Tombol lokasi saat ini (.current-location-btn) tidak ditemukan');
        
        // Jika tombol tidak ditemukan, mungkin kita perlu membuatnya
        const locationCard = document.querySelector('.location-card');
        if (locationCard) {
            const currentLocationButton = document.createElement('button');
            currentLocationButton.className = 'current-location-btn';
            currentLocationButton.innerHTML = '<i class="fas fa-crosshairs"></i> Lokasi Saat Ini';
            
            // Tambahkan sebelum elemen lain dalam location card
            locationCard.prepend(currentLocationButton);
            
            currentLocationButton.addEventListener('click', function() {
                window.location.href = 'order.html';
            });
        }
    }
    
    // Unused functions below - keeping them in the code but they won't be triggered anymore
    // since we're redirecting to suggest.html instead
    
    // Fungsi untuk menampilkan loading saat mendapatkan lokasi
    function showLocationLoadingModal() {
        const modal = document.createElement('div');
        modal.className = 'location-modal';
        modal.id = 'locationLoadingModal';
        
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Mendapatkan Lokasi</h3>
                </div>
                <div class="location-content" style="text-align: center; padding: 30px 15px;">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin" style="font-size: 40px; color: #ffcc00;"></i>
                    </div>
                    <p style="margin-top: 15px; color: #666;">Mendapatkan lokasi Anda saat ini...</p>
                </div>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // Tampilkan modal dengan animasi
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    // Fungsi untuk menampilkan modal lokasi saat ini
    function showCurrentLocationModal(location) {
        // Hapus modal loading jika ada
        const loadingModal = document.getElementById('locationLoadingModal');
        if (loadingModal) {
            loadingModal.classList.remove('show');
            setTimeout(() => loadingModal.remove(), 300);
        }
        
        // Buat modal baru untuk lokasi
        const modal = document.createElement('div');
        modal.className = 'location-modal';
        
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Lokasi Saat Ini</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="location-content">
                    <div class="current-location-info">
                        <div class="location-info-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="location-info-details">
                            <div class="location-info-name">${location.name}</div>
                            <div class="location-info-address">${location.address}, ${location.district}</div>
                        </div>
                    </div>
                    <div style="padding: 0 10px 10px;">
                        <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
                            Apakah Anda ingin menggunakan lokasi ini sebagai titik penjemputan?
                        </p>
                    </div>
                </div>
                <button class="confirm-location">Gunakan Lokasi Ini</button>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // Tampilkan modal dengan animasi
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Tambahkan event listener untuk tombol tutup
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        
        // Tambahkan event listener untuk tombol konfirmasi
        modal.querySelector('.confirm-location').addEventListener('click', () => {
            // Update informasi lokasi penjemputan
            const locationAddressElem = document.querySelector('.location-address');
            if (locationAddressElem) {
                locationAddressElem.textContent = location.name;
            }
            
            const locationStreetElem = document.querySelector('.location-street');
            if (locationStreetElem) {
                locationStreetElem.textContent = location.address;
            }
            
            // Tampilkan notifikasi kecil
            showToast('Lokasi penjemputan diperbarui');
            
            // Tutup modal
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    }

    // Handle destination input and icon clicks to redirect to destination.html
    const destinationInput = document.querySelector('.destination-input');
    const destinationIconBtn = document.querySelector('.destination-icon-btn');
    const destinationPoint = document.getElementById('destination-redirect');

    if (destinationInput) {
        destinationInput.addEventListener('click', function() {
            window.location.href = 'destination.html';
        });
    }

    if (destinationIconBtn) {
        destinationIconBtn.addEventListener('click', function() {
            window.location.href = 'destination.html';
        });
    }

    if (destinationPoint) {
        destinationPoint.addEventListener('click', function(e) {
            // Only redirect if the click was directly on the container, not on its children
            if (e.target === this) {
                window.location.href = 'destination.html';
            }
        });
    }

    // Also update the destination selector in the header to redirect when clicked
    const destinationHeader = document.querySelector('.destination');
    if (destinationHeader) {
        destinationHeader.addEventListener('click', function() {
            window.location.href = 'destination.html';
        });
    }
    
    // Fungsi untuk menampilkan toast notification
    function showToast(message) {
        // Hapus toast yang ada jika ada
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Buat elemen toast baru
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        
        // Styling untuk toast
        toast.style.position = 'fixed';
        toast.style.bottom = '80px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '20px';
        toast.style.fontSize = '14px';
        toast.style.zIndex = '1000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        
        // Tambahkan ke body
        document.body.appendChild(toast);
        
        // Tampilkan dengan animasi
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // Hilangkan setelah beberapa detik
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }
});