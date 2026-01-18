// script.js - BDeskGigs Website Functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('BDeskGigs website loaded successfully!');
    
    // Initialize all functionality
    initializeSearch();
    initializeServiceCards();
    initializePaymentInstructions();
    initializeNavigation();
    initializeJoinButton();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeTestimonialsSlider();
    initializeOrderModal();
});

// Search functionality
function initializeSearch() {
    const searchButton = document.querySelector('.search-box button');
    const searchInput = document.querySelector('.search-box input');
    
    if (!searchButton || !searchInput) return;
    
    // Click event for search button
    searchButton.addEventListener('click', performSearch);
    
    // Enter key event for search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            showNotification('অনুগ্রহ করে সার্চ কীওয়ার্ড লিখুন।', 'warning');
            searchInput.focus();
            return;
        }
        
        // Show search results notification
        showNotification(`"${searchTerm}" - এই কীওয়ার্ডে সার্চ করা হয়েছে!`, 'success');
        
        // In a real application, you would make an API call here
        // For demo purposes, we'll simulate loading search results
        simulateSearchResults(searchTerm);
        
        // Add search to recent searches (localStorage)
        saveToRecentSearches(searchTerm);
    }
}

// Simulate search results loading
function simulateSearchResults(searchTerm) {
    const searchBox = document.querySelector('.search-box');
    if (!searchBox) return;
    
    // Show loading state
    const originalButtonText = searchBox.querySelector('button').textContent;
    searchBox.querySelector('button').textContent = 'খুঁজছি...';
    searchBox.querySelector('button').disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
        // Restore button
        searchBox.querySelector('button').textContent = originalButtonText;
        searchBox.querySelector('button').disabled = false;
        
        // Show results count (simulated)
        const services = document.querySelectorAll('.service-card');
        let matchedServices = 0;
        
        services.forEach(service => {
            const title = service.querySelector('h3').textContent.toLowerCase();
            const description = service.querySelector('p').textContent.toLowerCase();
            const searchTermLower = searchTerm.toLowerCase();
            
            if (title.includes(searchTermLower) || description.includes(searchTermLower)) {
                service.style.boxShadow = '0 0 0 3px var(--primary)';
                matchedServices++;
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    service.style.boxShadow = '';
                }, 3000);
            }
        });
        
        if (matchedServices > 0) {
            showNotification(`${matchedServices}টি সার্ভিস পাওয়া গেছে "${searchTerm}" এর জন্য`, 'success');
        } else {
            showNotification(`দুঃখিত, "${searchTerm}" এর জন্য কোন সার্ভিস পাওয়া যায়নি।`, 'info');
        }
    }, 1500);
}

// Save search term to localStorage
function saveToRecentSearches(searchTerm) {
    let searches = JSON.parse(localStorage.getItem('bdeskgigs_recent_searches')) || [];
    
    // Add new search if not already in the list
    if (!searches.includes(searchTerm)) {
        searches.unshift(searchTerm); // Add to beginning
        searches = searches.slice(0, 5); // Keep only last 5 searches
        localStorage.setItem('bdeskgigs_recent_searches', JSON.stringify(searches));
    }
}

// Service cards interaction
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Add click event to service cards
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a button inside the card
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            const serviceTitle = this.querySelector('h3').textContent;
            const servicePrice = this.querySelector('.service-price').textContent;
            
            // Show service details modal
            showServiceModal(serviceTitle, servicePrice, this);
        });
        
        // Add buy/order button if not already present
        if (!card.querySelector('.btn-order')) {
            const serviceFooter = card.querySelector('.service-footer');
            if (serviceFooter) {
                const orderBtn = document.createElement('button');
                orderBtn.className = 'btn btn-primary btn-order';
                orderBtn.textContent = 'অর্ডার করুন';
                orderBtn.style.marginTop = '10px';
                orderBtn.style.width = '100%';
                serviceFooter.appendChild(orderBtn);
                
                // Add order functionality
                orderBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent card click event
                    
                    const serviceTitle = card.querySelector('h3').textContent;
                    const servicePrice = card.querySelector('.service-price').textContent;
                    
                    showOrderModal(serviceTitle, servicePrice);
                });
            }
        }
    });
}

// Payment instructions toggle
function initializePaymentInstructions() {
    const paymentDetails = document.querySelector('.payment-details');
    if (!paymentDetails) return;
    
    // Add copy functionality to payment number
    const paymentNumber = document.querySelector('.payment-number .number');
    if (paymentNumber) {
        paymentNumber.style.cursor = 'pointer';
        paymentNumber.title = 'ক্লিক করে কপি করুন';
        
        paymentNumber.addEventListener('click', function() {
            const textToCopy = this.textContent.trim();
            
            // Use modern Clipboard API
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show copied notification
                const originalText = this.textContent;
                this.textContent = 'কপি করা হয়েছে!';
                this.style.color = 'var(--secondary)';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 2000);
                
                showNotification('পেমেন্ট নম্বর কপি করা হয়েছে!', 'success');
            }).catch(err => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                showNotification('পেমেন্ট নম্বর কপি করা হয়েছে!', 'success');
            });
        });
    }
    
    // Add expand/collapse for payment instructions
    const instructions = document.querySelector('.payment-instructions');
    if (instructions) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn btn-outline';
        toggleBtn.textContent = 'বিস্তারিত দেখুন';
        toggleBtn.style.marginTop = '15px';
        toggleBtn.style.width = '100%';
        
        // Insert after instructions
        instructions.parentNode.insertBefore(toggleBtn, instructions.nextSibling);
        
        // Initially hide the instructions on mobile
        if (window.innerWidth <= 768) {
            instructions.style.display = 'none';
        }
        
        // Toggle instructions visibility
        toggleBtn.addEventListener('click', function() {
            if (instructions.style.display === 'none') {
                instructions.style.display = 'block';
                this.textContent = 'সরল দেখুন';
            } else {
                instructions.style.display = 'none';
                this.textContent = 'বিস্তারিত দেখুন';
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                instructions.style.display = 'block';
                toggleBtn.style.display = 'none';
            } else {
                toggleBtn.style.display = 'block';
            }
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId.startsWith('#')) {
                // For demo purposes, just show a notification
                const linkText = this.textContent;
                showNotification(`${linkText} পেজ লোড হচ্ছে...`, 'info');
                
                // In a real application, you would navigate to the page
                // window.location.href = targetId;
            }
        });
    });
}

// Join/Sign In button functionality
function initializeJoinButton() {
    const joinButtons = document.querySelectorAll('.btn-primary');
    const signInButtons = document.querySelectorAll('.btn-outline');
    
    // Join button functionality
    joinButtons.forEach(button => {
        if (button.textContent === 'Join' || button.textContent.includes('Join')) {
            button.addEventListener('click', function() {
                showRegistrationModal();
            });
        }
    });
    
    // Sign In button functionality
    signInButtons.forEach(button => {
        if (button.textContent === 'Sign In' || button.textContent.includes('Sign In')) {
            button.addEventListener('click', function() {
                showLoginModal();
            });
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    // Create mobile menu toggle button
    const headerContainer = document.querySelector('.header-container');
    if (!headerContainer || window.innerWidth > 768) return;
    
    const nav = document.querySelector('nav');
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.style.background = 'none';
    toggleBtn.style.border = 'none';
    toggleBtn.style.fontSize = '24px';
    toggleBtn.style.color = 'var(--dark)';
    toggleBtn.style.cursor = 'pointer';
    
    // Insert toggle button before nav
    headerContainer.insertBefore(toggleBtn, nav);
    
    // Initially hide nav on mobile
    nav.style.display = 'none';
    
    // Toggle menu visibility
    toggleBtn.addEventListener('click', function() {
        if (nav.style.display === 'none') {
            nav.style.display = 'block';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.background = 'white';
            nav.style.padding = '20px';
            nav.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            nav.style.zIndex = '1000';
            
            // Adjust nav ul for mobile
            const navUl = nav.querySelector('ul');
            navUl.style.flexDirection = 'column';
            navUl.style.gap = '15px';
        } else {
            nav.style.display = 'none';
        }
    });
    
    // Hide menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !toggleBtn.contains(e.target) && nav.style.display === 'block') {
            nav.style.display = 'none';
        }
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Add scroll animation to service cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .service-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .service-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Testimonials slider (if added to HTML later)
function initializeTestimonialsSlider() {
    // This function can be expanded when testimonials section is added
    console.log('Testimonials slider ready to be implemented');
}

// Show service details modal
function showServiceModal(title, price, cardElement) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="serviceModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-price">${price}</div>
                    <p>এই সার্ভিসটি অর্ডার করতে পেমেন্ট করুন নিচের নম্বরটিতে:</p>
                    <div class="payment-number-modal">
                        <div class="number">০১৩১২-১৮৫২৭৭</div>
                        <button class="btn btn-primary copy-btn">কপি করুন</button>
                    </div>
                    <p>পেমেন্ট করে ট্রানজেকশন আইডি নিচের ফর্মে জমা দিন:</p>
                    <form id="paymentForm">
                        <div class="form-group">
                            <label for="trxId">ট্রানজেকশন আইডি (TrxID)</label>
                            <input type="text" id="trxId" placeholder="উদাহরণ: 8A7BC9D2E1F" required>
                        </div>
                        <div class="form-group">
                            <label for="userPhone">আপনার মোবাইল নম্বর</label>
                            <input type="tel" id="userPhone" placeholder="০১৭XXXXXXXX" required>
                        </div>
                        <button type="submit" class="btn btn-primary">অর্ডার কনফার্ম করুন</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    addModalStyles();
    
    // Get modal elements
    const modal = document.getElementById('serviceModal');
    const closeBtn = modal.querySelector('.modal-close');
    const copyBtn = modal.querySelector('.copy-btn');
    const paymentForm = document.getElementById('paymentForm');
    
    // Close modal functionality
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Copy payment number
    copyBtn.addEventListener('click', () => {
        const number = modal.querySelector('.number').textContent.trim();
        navigator.clipboard.writeText(number).then(() => {
            copyBtn.textContent = 'কপি করা হয়েছে!';
            setTimeout(() => {
                copyBtn.textContent = 'কপি করুন';
            }, 2000);
        });
    });
    
    // Handle form submission
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const trxId = document.getElementById('trxId').value.trim();
        const userPhone = document.getElementById('userPhone').value.trim();
        
        if (!trxId || !userPhone) {
            showNotification('অনুগ্রহ করে সব তথ্য পূরণ করুন।', 'warning');
            return;
        }
        
        // Simulate order submission
        showNotification('আপনার অর্ডারটি গ্রহণ করা হয়েছে! শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।', 'success');
        
        // Close modal after 2 seconds
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 2000);
    });
}

// Show order modal
function showOrderModal(serviceTitle, servicePrice) {
    showServiceModal(serviceTitle, servicePrice);
}

// Show registration modal
function showRegistrationModal() {
    const modalHTML = `
        <div class="modal-overlay" id="registrationModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>BDeskGigs এ অ্যাকাউন্ট তৈরি করুন</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="registrationForm">
                        <div class="form-group">
                            <label for="regName">পূর্ণ নাম</label>
                            <input type="text" id="regName" placeholder="আপনার পূর্ণ নাম" required>
                        </div>
                        <div class="form-group">
                            <label for="regEmail">ইমেইল ঠিকানা</label>
                            <input type="email" id="regEmail" placeholder="example@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="regPhone">মোবাইল নম্বর</label>
                            <input type="tel" id="regPhone" placeholder="০১৭XXXXXXXX" required>
                        </div>
                        <div class="form-group">
                            <label for="regPassword">পাসওয়ার্ড</label>
                            <input type="password" id="regPassword" placeholder="অন্তত ৮ অক্ষর" required>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" required>
                                আমি <a href="#">Terms of Service</a> এবং <a href="#">Privacy Policy</a> এর শর্তাবলী মেনে চলতে সম্মত
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary">অ্যাকাউন্ট তৈরি করুন</button>
                    </form>
                    <p style="text-align: center; margin-top: 15px;">
                        ইতিমধ্যে অ্যাকাউন্ট আছে? <a href="#" class="switch-to-login">সাইন ইন করুন</a>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addModalStyles();
    
    const modal = document.getElementById('registrationModal');
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('registrationForm');
    const switchToLogin = modal.querySelector('.switch-to-login');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('আপনার অ্যাকাউন্ট তৈরি করা হয়েছে! যাচাইকরণের জন্য ইমেইল চেক করুন।', 'success');
        
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 2000);
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.removeChild(modal);
        showLoginModal();
    });
}

// Show login modal
function showLoginModal() {
    const modalHTML = `
        <div class="modal-overlay" id="loginModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>BDeskGigs এ সাইন ইন করুন</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">ইমেইল বা মোবাইল নম্বর</label>
                            <input type="text" id="loginEmail" placeholder="example@email.com বা ০১৭XXXXXXXX" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">পাসওয়ার্ড</label>
                            <input type="password" id="loginPassword" placeholder="আপনার পাসওয়ার্ড" required>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox">
                                আমাকে মনে রাখুন
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary">সাইন ইন করুন</button>
                    </form>
                    <p style="text-align: center; margin-top: 15px;">
                        অ্যাকাউন্ট নেই? <a href="#" class="switch-to-register">অ্যাকাউন্ট তৈরি করুন</a>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addModalStyles();
    
    const modal = document.getElementById('loginModal');
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('loginForm');
    const switchToRegister = modal.querySelector('.switch-to-register');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('সাইন ইন সফল! ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...', 'success');
        
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 2000);
    });
    
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.removeChild(modal);
        showRegistrationModal();
    });
}

// Initialize order modal functionality
function initializeOrderModal() {
    // This will be used by other functions
}

// Add modal styles to document
function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            padding: 20px;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 10px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid var(--border);
        }
        
        .modal-header h3 {
            margin: 0;
            color: var(--secondary);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: var(--gray);
            line-height: 1;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-price {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary);
            margin-bottom: 15px;
        }
        
        .payment-number-modal {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 15px 0;
            background-color: #f1fdf7;
            padding: 15px;
            border-radius: 8px;
        }
        
        .payment-number-modal .number {
            flex: 1;
            font-size: 20px;
            font-weight: bold;
            color: var(--primary);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark);
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--border);
            border-radius: 5px;
            font-size: 16px;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: var(--primary);
        }
    `;
    
    document.head.appendChild(style);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        document.body.removeChild(existingNotification);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    const styles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
            max-width: 350px;
        }
        
        .notification-success {
            background-color: var(--primary);
        }
        
        .notification-warning {
            background-color: #ff9800;
        }
        
        .notification-info {
            background-color: #2196f3;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'notification-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Initialize recent searches display (optional feature)
function initializeRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('bdeskgigs_recent_searches')) || [];
    
    if (searches.length > 0) {
        // This can be expanded to show recent searches in the UI
        console.log('Recent searches:', searches);
    }
}

// Add event listener for window load to initialize recent searches
window.addEventListener('load', initializeRecentSearches);