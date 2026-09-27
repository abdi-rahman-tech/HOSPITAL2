document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Logic ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = navLinks.style.display === 'none' || getComputedStyle(navLinks).display === 'none';

            if (isHidden || navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.padding = '1.5rem';
                navLinks.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                navLinks.style.zIndex = '1000';
            } else {
                navLinks.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !navLinks.contains(e.target) && window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'row';
                navLinks.style.position = 'static';
                navLinks.style.padding = '0';
                navLinks.style.boxShadow = 'none';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }

    // --- Dynamic Active Navbar Link Highlighting ---
    const currentFileName = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-links .nav-link');
    if (allNavLinks.length > 0) {
        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const linkFileName = href.split('/').pop().toLowerCase();
                if (linkFileName === currentFileName || (currentFileName === '' && linkFileName === 'index.html')) {
                    allNavLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // --- 2. Doctor Filter & Search Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const doctorCards = document.querySelectorAll('.doctor-card');
    const searchInput = document.querySelector('.search-bar');

    if (doctorCards.length > 0) {

        // Filter Buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Active State
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.innerText.trim(); // e.g. "Cardiology"

                filterDoctors(category, searchInput ? searchInput.value : '');
            });
        });

        // Search Input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeBtn = document.querySelector('.filter-btn.active');
                const category = activeBtn ? activeBtn.innerText.trim() : 'All Departments';
                filterDoctors(category, e.target.value);
            });
        }
    }

    function filterDoctors(category, searchText) {
        const query = searchText.toLowerCase();

        doctorCards.forEach(card => {
            const name = card.querySelector('.doctor-name').innerText.trim();
            const specialty = card.querySelector('.doctor-specialty').innerText.trim(); // e.g. "Senior Cardiologist"

            // Map Categories to Keywords
            let categoryMatch = false;
            if (category === 'All Departments') {
                categoryMatch = true;
            } else if (category === 'Cardiology' && specialty.includes('Cardiologist')) {
                categoryMatch = true;
            } else if (category === 'Neurology' && specialty.includes('Neurologist')) {
                categoryMatch = true;
            } else if (category === 'Pediatrics' && specialty.includes('Pediatrician')) {
                categoryMatch = true;
            } else if (category === 'Surgery' && specialty.includes('Surgeon')) {
                categoryMatch = true;
            }
            // Fallback for general matching if exact map fails (e.g. if we add Orthopedics later)
            else if (specialty.toLowerCase().includes(category.toLowerCase())) {
                categoryMatch = true;
            }

            // Search Match
            const nameMatch = name.toLowerCase().includes(query);
            const specialtyMatch = specialty.toLowerCase().includes(query);
            const isSearchMatch = nameMatch || specialtyMatch;

            // Final Result
            if (categoryMatch && isSearchMatch) {
                card.style.display = 'block';
                // Animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        });
    }

    // --- 3. Doctor Details Modal Logic ---
    const modal = document.getElementById('doctor-modal');
    if (modal) {
        const closeBtn = modal.querySelector('.close-modal');
        const modalOverlay = modal; // The id points to the overlay div

        // Open Modal
        document.body.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.btn-outline');
            // Check if it's the "View Profile" button inside a doctor card
            if (viewBtn && viewBtn.innerText.includes('View Profile')) {
                e.preventDefault();

                const card = viewBtn.closest('.doctor-card');
                if (card) {
                    const name = card.querySelector('.doctor-name').innerText;
                    const specialty = card.querySelector('.doctor-specialty').innerText;
                    const img = card.querySelector('.doctor-avatar').src;

                    // Populate Modal
                    modal.querySelector('.modal-name').innerText = name;
                    modal.querySelector('.modal-specialty').innerText = specialty;
                    modal.querySelector('.modal-avatar').src = img;

                    // Update Bio Name
                    const bioNameElements = modal.querySelectorAll('.bio-name');
                    bioNameElements.forEach(el => el.innerText = name.split(' ').pop()); // Last name

                    // Show
                    modal.style.display = 'flex';
                }
            }
        });

        // Close Modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close on Click Outside
        window.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modal.style.display = 'none';
            }
        });
    }

    // --- 4. Service Details Modal Logic ---
    const serviceModal = document.getElementById('service-modal');
    if (serviceModal) {
        const closeButtons = serviceModal.querySelectorAll('.close-service-modal');
        const serviceOverlay = serviceModal;

        // Service Descriptions Data & Benefits
        const serviceDetails = {
            'Outpatient (OPD)': {
                desc: "Our Outpatient Department (OPD) ensures you get expert consultation without the need for hospital admission. We cover all major specialties under one roof for your convenience with minimal waiting times.",
                benefits: ["Walk-in Appointments", "Specialist Consultations", "Minor Procedures & Dressings", "Follow-up Care coordination"],
                img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800"
            },
            'Emergency & Trauma': {
                desc: "Our Level 1 Trauma Center is ready 24/7 to handle critical emergencies. We have dedicated trauma bays, advanced life support, and immediate access to operating theaters for life-saving procedures.",
                benefits: ["24/7 Trauma Team Support", "Advanced Cardiac Life Support", "Rapid Stroke Management", "Dedicated Emergency Ambulance"],
                img: "https://images.unsplash.com/photo-1516574187841-69301976e495?q=80&w=800"
            },
            'Advanced Diagnostics': {
                desc: "Our NABL accredited lab offers a wide spectrum of diagnostic tests with quick turnaround times. We use automated molecular analyzers to ensure the highest accuracy in your pathological results.",
                benefits: ["Molecular Diagnostics & DNA testing", "Comprehensive Histopathology", "Advanced Microbiology", "Home Sample Collection Services"],
                img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800"
            },
            'Surgical Excellence': {
                desc: "We have state-of-the-art modular operation theaters with laminar flow and HEPA filtration to minimize infection risks. Our surgeons are pioneers in minimally invasive and robotic-assisted procedures.",
                benefits: ["Laparoscopic (Keyhole) Surgery", "Robot-Assisted Surgery", "Complex Neuro & Cardiac Surgery", "Day Care Surgical Wing"],
                img: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800"
            },
            'Clinical Pharmacy': {
                desc: "Our pharmacy is open 24/7, providing genuine medicines, specialized surgical supplies, and premium wellness products. We maintain strict cold chain storage for sensitive vaccines.",
                benefits: ["24/7 Clinical Pharmacist Support", "Express Home Delivery", "Personalized Medication Counseling", "Certified Genuine Medicines Only"],
                img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800"
            },
            'Imaging & Radiology': {
                desc: "We offer high-resolution imaging services for precise diagnosis. Our radiologists use advanced AI-enhanced tools to interpret scans accurately and coordinate with your treating doctor.",
                benefits: ["High-Tesla MRI & Multi-slice CT", "4D Color Ultrasound", "Digital Mammography", "Interventional Radiology"],
                img: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=800"
            },
            'Dental Clinic': {
                desc: "Our dental clinic provides world-class oral healthcare, from preventative cleanings to complex restorative surgery. We use digital imaging and painless anesthesia techniques for your comfort.",
                benefits: ["Cosmetic Dentistry & Whitening", "Orthodontics (Invisalign)", "Dental Implants & Surgery", "Painless Root Canal Treatment"],
                img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800"
            },
            'Maternity & Neonatal': {
                desc: "Experience the joy of motherhood in our luxury birthing suites. We provide comprehensive prenatal, delivery, and postnatal care with an advanced level-III NICU for specialized newborn support.",
                benefits: ["Luxury Birthing Suites", "Painless Labor (Epidural)", "Expert OB/GYN Care 24/7", "Neonatal Intensive Care Unit"],
                img: "https://images.unsplash.com/photo-1505151528628-918076594ed7?q=80&w=800"
            },
            'Physiotherapy': {
                desc: "Our rehabilitation center helps you regain mobility and strength after injury or surgery. We use a combination of manual therapy, electrotherapy, and customized exercise programs.",
                benefits: ["Sports Injury Rehabilitation", "Post-Surgical Recovery", "Chronic Pain Management", "Geriatric Mobility Programs"],
                img: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=800"
            },
            'Mental Wellness': {
                desc: "Your mental health is just as important as your physical health. Our confidential counseling services provide a safe space to discuss stress, anxiety, depression, and personal growth with board-certified psychologists.",
                benefits: ["One-on-One Counseling", "Cognitive Behavioral Therapy (CBT)", "Corporate Stress Management", "Adolescent & Child Psychology"],
                img: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?q=80&w=800"
            },
            // --- Index Page Services ---
            'General Consultation': {
                desc: "Comprehensive preventative care, health screenings, and same-day appointments for your daily health needs. Our GPs are available 24/7 for all your general medical concerns.",
                benefits: ["Same-day Appointments", "Annual Health Screenings", "Chronic Disease Management", "Vaccinations & Immunizations"],
                img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800"
            },
            'Cardiology': {
                desc: "State-of-the-art cardiovascular care including non-invasive diagnostics, rehabilitation, and preventative heart health. We specialize in treating complex heart conditions.",
                benefits: ["ECG & Echocardiogram", "Cardiac Catheterization", "Heart Failure Management", "Cardiac Rehabilitation"],
                img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=800"
            },
            'Pediatrics': {
                desc: "Compassionate care for infants, children, and adolescents, focusing on physical, mental, and social health. We create a child-friendly environment to reduce anxiety.",
                benefits: ["Newborn Screening", "Child Development Assessment", "Pediatric Vaccinations", "Adolescent Medicine"],
                img: "https://images.unsplash.com/photo-1612776572997-76cc42e058c3?q=80&w=800"
            },
            'Orthopedics': {
                desc: "Advanced treatment for bone, joint, and muscle conditions, helping you recover mobility and live pain-free. Our team includes expert surgeons and physiotherapists.",
                benefits: ["Joint Replacement Surgery", "Sports Medicine", "Arthroscopic Surgery", "Fracture Care"],
                img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800"
            }
        };

        // Open Modal (Delegate to body)
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('.dept-link, .dept-card, .service-link, .service-card');
            if (link) {
                const card = e.target.closest('.dept-card, .service-card');
                if (!card) return;

                let title = '';
                const titleEl = card.querySelector('.dept-title, .service-title');
                if (titleEl) title = titleEl.innerText.trim();

                const data = serviceDetails[title];

                if (data) {
                    e.preventDefault();
                    serviceModal.querySelector('.modal-service-title').innerText = title;
                    serviceModal.querySelector('.modal-service-img').src = data.img;
                    serviceModal.querySelector('.modal-service-desc').innerText = data.desc;

                    const benefitsList = serviceModal.querySelector('.modal-service-benefits');
                    // Check if benefits list exists (Index page might miss the class, so we use fallback or simply don't break)
                    if (benefitsList) {
                        benefitsList.innerHTML = '';
                        data.benefits.forEach(benefit => {
                            const li = document.createElement('li');
                            li.style.display = 'flex';
                            li.style.alignItems = 'center';

                            li.style.gap = '10px';
                            li.style.marginBottom = '12px';
                            li.style.color = '#475569';
                            li.innerHTML = `<i class="fas fa-check-circle" style="color: #4338ca;"></i> ${benefit}`;
                            benefitsList.appendChild(li);
                        });

                        serviceModal.style.display = 'flex';
                    }
                }
            }
        });

        // Close Buttons
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                serviceModal.style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target === serviceOverlay) {
                serviceModal.style.display = 'none';
            }
        });
    }

    // --- 4. Contact Form Submission (Existing) ---
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showToast("Message Sent Successfully!", "success");
                contactForm.reset();
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent';
                submitBtn.style.backgroundColor = '#10B981';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
            }, 1500);
        });
    }

    // --- 5. Global Button Feedback (Simplified) ---
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');

        // Skip if inside filtering, modal, or form
        if (!target || target.closest('.filters') || target.closest('.modal-container') || target.closest('form')) return;

        // Skip real links
        const href = target.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript')) return;

        e.preventDefault();

        // Special Case: Book Appointment
        if (target.innerText.trim().includes('Book Appointment')) {
            window.location.href = 'contact.html';
            return;
        }

        const text = target.innerText.trim() || 'Action';
        showToast(`You clicked: ${text}`);
    });
});

function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '9999';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.gap = '10px';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.style.background = type === 'success' ? '#10B981' : '#1E40AF';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    toast.style.fontFamily = "'Inter', sans-serif";
    toast.style.fontSize = '0.95rem';
    toast.style.minWidth = '250px';
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease';
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> &nbsp; ${message}`;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- 5. Nova AI Health Assistant (Symptom Checker & Triage) ---
(function initAIHealthAssistant() {
    // Only inject on pages that have document body and don't already have the widget
    if (document.getElementById('ai-health-widget-container')) return;

    const widgetHTML = `
    <div id="ai-health-widget-container">
        <!-- Floating Button -->
        <button id="aiWidgetToggle" class="ai-widget-button" title="Nova AI Health Assistant">
            <i class="fas fa-robot ai-widget-icon"></i>
            <span>Nova AI Assistant</span>
            <span class="ai-widget-badge">AI</span>
        </button>

        <!-- Chat Window Modal -->
        <div id="aiChatWindow" class="ai-chat-window">
            <div class="ai-chat-header">
                <div class="ai-chat-title-group">
                    <div class="ai-avatar">
                        <i class="fas fa-user-md"></i>
                    </div>
                    <div>
                        <h4 class="ai-title"><i class="fas fa-sparkles" style="color: #38bdf8; font-size: 0.8rem;"></i> Nova AI Assistant</h4>
                        <div class="ai-status">
                            <span class="ai-status-dot"></span> Online • Medical Symptom Triage
                        </div>
                    </div>
                </div>
                <button id="aiCloseBtn" class="ai-close-btn" title="Close Chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div id="aiChatBody" class="ai-chat-body">
                <div class="ai-msg ai-msg-bot">
                    <strong>Ask Nova AI Health Assistant:</strong><br>
                    Welcome to Nova Health Center! 👋 How can I help you today? Please choose a symptom below or type your health question.
                </div>

                <div class="ai-pills-container">
                    <div class="ai-pills-title">Quick Symptom & Service Check:</div>
                    <div class="ai-pills">
                        <button class="ai-pill-btn" data-query="chest pain"><i class="fas fa-heartbeat"></i> Chest Pain / Heart</button>
                        <button class="ai-pill-btn" data-query="headache"><i class="fas fa-brain"></i> Severe Headache</button>
                        <button class="ai-pill-btn" data-query="fever child"><i class="fas fa-baby"></i> Child Fever & Cough</button>
                        <button class="ai-pill-btn" data-query="maternity"><i class="fas fa-female"></i> Pregnancy & Maternity</button>
                        <button class="ai-pill-btn" data-query="pharmacy"><i class="fas fa-pills"></i> Medicine & Refills</button>
                        <button class="ai-pill-btn" data-query="dental"><i class="fas fa-tooth"></i> Dental Care</button>
                        <button class="ai-pill-btn open-health-calc" data-query="bmi"><i class="fas fa-calculator"></i> BMI & Health Calculator</button>
                        <button class="ai-pill-btn" data-query="appointment"><i class="fas fa-calendar-alt"></i> Book Appointment</button>
                    </div>
                </div>
            </div>

            <div class="ai-chat-footer">
                <input type="text" id="aiInput" class="ai-input" placeholder="Describe symptoms or ask a question..." autocomplete="off">
                <button id="aiSendBtn" class="ai-send-btn" title="Send Message">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    const toggleBtn = document.getElementById('aiWidgetToggle');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiCloseBtn');
    const chatBody = document.getElementById('aiChatBody');
    const input = document.getElementById('aiInput');
    const sendBtn = document.getElementById('aiSendBtn');

    if (!toggleBtn || !chatWindow) return;

    // Toggle Chat Window
    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            input.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Pill buttons handler
    document.addEventListener('click', (e) => {
        const pill = e.target.closest('.ai-pill-btn');
        if (pill) {
            const query = pill.getAttribute('data-query');
            const label = pill.innerText.trim();
            handleUserMessage(label, query);
        }
    });

    // Send button & enter key
    sendBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (text) {
            handleUserMessage(text, text);
            input.value = '';
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = input.value.trim();
            if (text) {
                handleUserMessage(text, text);
                input.value = '';
            }
        }
    });

    function appendUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'ai-msg ai-msg-user';
        msgDiv.innerText = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendBotMessage(htmlContent) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'ai-msg ai-msg-bot';
        msgDiv.innerHTML = htmlContent;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleUserMessage(userText, queryText) {
        appendUserMessage(userText);

        // Show typing indicator simulation
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-msg ai-msg-bot';
        typingDiv.innerHTML = '<em>Nova AI is evaluating medical guidelines... <i class="fas fa-circle-notch fa-spin"></i></em>';
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(() => {
            typingDiv.remove();
            const botResponse = generateAIResponse(queryText.toLowerCase());
            appendBotMessage(botResponse);
        }, 700);
    }

    function generateAIResponse(q) {
        // Triage engine
        if (q.includes('chest') || q.includes('heart') || q.includes('xabad') || q.includes('cardio') || q.includes('pressure')) {
            return `
                <strong>⚠️ Emergency Assessment: Cardiology Triage</strong><br>
                Chest pain or severe tightness can indicate a cardiovascular condition.<br><br>
                <strong>Recommended Department:</strong> Advanced Cardiology & Emergency Wing.<br>
                <strong>Action Required:</strong> If you feel acute tightness, shortness of breath, or arm pain, seek emergency care immediately.<br>
                <a href="contact.html" class="ai-action-btn"><i class="fas fa-user-md"></i> Book Cardiologist</a>
                <a href="tel:911" class="ai-action-btn emergency"><i class="fas fa-phone-alt"></i> Call Emergency 911</a>
            `;
        } else if (q.includes('head') || q.includes('migraine') || q.includes('madax') || q.includes('brain') || q.includes('dizzy')) {
            return `
                <strong>🧠 Neurological Triage Guidance</strong><br>
                Severe headaches, migraine, or dizziness are treated by our Senior Neurologists.<br><br>
                <strong>Recommended Specialist:</strong> Dr. Sarah Jenkins (Senior Neurologist).<br>
                <strong>Advice:</strong> Stay hydrated, avoid bright light, and schedule a neurological assessment.<br>
                <a href="doctors.html" class="ai-action-btn"><i class="fas fa-calendar-check"></i> View Neurologists</a>
            `;
        } else if (q.includes('fever') || q.includes('child') || q.includes('pediatric') || q.includes('baby') || q.includes('cough') || q.includes('cunug') || q.includes('caruur')) {
            return `
                <strong>👶 Pediatric & Child Care Triage</strong><br>
                High fever, cough, or flu in children requires prompt pediatric evaluation.<br><br>
                <strong>Recommended Department:</strong> Pediatrics & Children's Clinic.<br>
                <strong>Advice:</strong> Monitor temperature regularly and ensure adequate fluid intake.<br>
                <a href="contact.html" class="ai-action-btn"><i class="fas fa-user-md"></i> Book Pediatrician</a>
            `;
        } else if (q.includes('maternity') || q.includes('pregnant') || q.includes('urur') || q.includes('baby') || q.includes('pregnancy') || q.includes('ultrasound')) {
            return `
                <strong>🤰 Maternity & Women's Health Clinic</strong><br>
                We offer 4D Ultrasound, Prenatal Care, and Labor Suites with 24/7 OB-GYN coverage.<br><br>
                <strong>Recommended Department:</strong> Women's Health & Maternity.<br>
                <a href="services.html" class="ai-action-btn"><i class="fas fa-female"></i> Explore Maternity Wing</a>
            `;
        } else if (q.includes('pharma') || q.includes('medicine') || q.includes('pill') || q.includes('dawo') || q.includes('refill') || q.includes('prescription')) {
            return `
                <strong>💊 Pharmacy & Prescription Refill</strong><br>
                You can order authentic prescription medicines or upload your prescription online with 24/7 delivery.<br><br>
                <a href="pharmacy.html" class="ai-action-btn"><i class="fas fa-pills"></i> Visit Online Pharmacy</a>
            `;
        } else if (q.includes('dental') || q.includes('tooth') || q.includes('teeth') || q.includes('ilko') || q.includes('gum')) {
            return `
                <strong>🦷 Dental & Maxillofacial Center</strong><br>
                For toothache, cavity fillings, root canals, or cosmetic dentistry, our dental specialists are ready to help.<br><br>
                <a href="contact.html" class="ai-action-btn"><i class="fas fa-tooth"></i> Book Dental Consult</a>
            `;
        } else if (q.includes('appointment') || q.includes('balan') || q.includes('book') || q.includes('doctor') || q.includes('visit')) {
            return `
                <strong>📅 Easy Online Appointment Booking</strong><br>
                Choose your preferred doctor, department, date, and time instantly.<br><br>
                <a href="contact.html" class="ai-action-btn"><i class="fas fa-calendar-check"></i> Go to Booking Form</a>
            `;
        } else {
            return `
                <strong>🩺 General Health Assistance</strong><br>
                Thank you for contacting Nova Health Center. Based on your input, our Family Medicine department can provide a complete diagnosis.<br><br>
                <strong>Options:</strong> You can book a consultation or visit our Patient Portal to view records.<br>
                <a href="contact.html" class="ai-action-btn"><i class="fas fa-calendar-alt"></i> Book Consultation</a>
                <a href="portal.html" class="ai-action-btn"><i class="fas fa-user"></i> Patient Portal</a>
            `;
        }
    }
})();

// --- 6. Universal Interactive Emergency SOS Modal & Dispatch System ---
(function initEmergencySOSSystem() {
    if (document.getElementById('nova-sos-overlay')) return;

    // Inject SOS Floating Button if missing on current page
    if (!document.querySelector('.sos-btn')) {
        const floatBtn = document.createElement('a');
        floatBtn.className = 'sos-btn';
        floatBtn.title = 'Emergency SOS Triage';
        floatBtn.innerHTML = '<i class="fas fa-phone-alt"></i>';
        document.body.appendChild(floatBtn);
    }

    // Inject SOS Modal Overlay HTML
    const modalHTML = `
    <div id="nova-sos-overlay" class="nova-sos-overlay">
        <div class="nova-sos-card">
            <div class="nova-sos-header">
                <h3><i class="fas fa-ambulance" style="font-size: 1.3rem;"></i> Emergency SOS Dispatch</h3>
                <button id="novaSosClose" class="ai-close-btn"><i class="fas fa-times"></i></button>
            </div>

            <div class="nova-sos-body">
                <div id="sosCountdownRing" class="sos-countdown-ring">5</div>
                
                <h3 id="sosStatusText" style="margin: 0 0 8px 0; font-size: 1.3rem; font-weight: 700; color: #f8fafc;">
                    Connecting to Nova ER Command Center...
                </h3>

                <div class="sos-gps-badge">
                    <i class="fas fa-location-dot"></i> GPS Signal Locked • Dispatch Ready
                </div>

                <div class="sos-actions-grid">
                    <button id="sosDispatchNowBtn" class="sos-btn-dispatch">
                        <i class="fas fa-truck-medical"></i> Dispatch Ambulance
                    </button>
                    <a href="tel:911" class="sos-btn-call">
                        <i class="fas fa-phone"></i> Call ER (911)
                    </a>
                </div>

                <div class="sos-firstaid-box">
                    <div class="sos-firstaid-title">
                        <i class="fas fa-kit-medical" style="color: #ef4444;"></i> Instant First Aid Guidance:
                    </div>
                    <div class="sos-firstaid-tabs">
                        <button class="sos-tab-btn active" data-tab="cpr">🫀 CPR / Cardiac</button>
                        <button class="sos-tab-btn" data-tab="bleeding">🩸 Bleeding</button>
                        <button class="sos-tab-btn" data-tab="breathing">🫁 Breathing</button>
                        <button class="sos-tab-btn" data-tab="stroke">🧠 Stroke (FAST)</button>
                    </div>
                    <div id="sosTabContent" class="sos-tab-content">
                        <strong>CPR Protocol:</strong> Push hard & fast in center of chest (100-120 bpm). Give 30 compressions followed by 2 rescue breaths.
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('nova-sos-overlay');
    const closeBtn = document.getElementById('novaSosClose');
    const countdownRing = document.getElementById('sosCountdownRing');
    const statusText = document.getElementById('sosStatusText');
    const dispatchBtn = document.getElementById('sosDispatchNowBtn');

    let timer = null;
    let secondsLeft = 5;

    // Attach trigger event listeners to all SOS buttons on the page
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.sos-btn, [onclick*="openEmergencySOS"], [href="tel:911"]');
        if (target) {
            e.preventDefault();
            openSOSModal();
        }
    });

    // Make openEmergencySOS globally available
    window.openEmergencySOS = openSOSModal;
    window.cancelSOS = closeSOSModal;

    function openSOSModal() {
        overlay.classList.add('active');
        secondsLeft = 5;
        countdownRing.innerText = '5';
        countdownRing.style.borderColor = '#ef4444';
        countdownRing.style.color = '#ef4444';
        statusText.innerText = 'Connecting to Nova ER Command Center...';

        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            secondsLeft--;
            if (secondsLeft > 0) {
                countdownRing.innerText = secondsLeft;
            } else {
                clearInterval(timer);
                triggerAmbulanceDispatch();
            }
        }, 1000);
    }

    function closeSOSModal() {
        if (timer) clearInterval(timer);
        overlay.classList.remove('active');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeSOSModal);

    if (dispatchBtn) {
        dispatchBtn.addEventListener('click', () => {
            if (timer) clearInterval(timer);
            triggerAmbulanceDispatch();
        });
    }

    function triggerAmbulanceDispatch() {
        countdownRing.innerText = '✓';
        countdownRing.style.borderColor = '#22c55e';
        countdownRing.style.color = '#22c55e';
        statusText.innerHTML = '<span style="color: #4ade80;">🚑 Ambulance Dispatched!</span><br><small style="font-size: 0.85rem; font-weight: 400; color: #cbd5e1;">Unit #AMB-911 en route. ETA: 6 mins. Paramedic Lead: Dr. Farhan</small>';
    }

    // First Aid Tab handling
    const firstAidGuides = {
        cpr: '<strong>CPR Protocol:</strong> Push hard & fast in center of chest (100-120 bpm). Give 30 compressions followed by 2 rescue breaths.',
        bleeding: '<strong>Bleeding Control:</strong> Apply firm, continuous pressure directly over wound using clean cloth. Elevate injured area above heart if possible.',
        breathing: '<strong>Breathing Difficulty:</strong> Keep patient seated upright in comfortable position. Loosen tight collar/belts. Ensure fresh air circulation.',
        stroke: '<strong>Stroke FAST Check:</strong> F-Face drooping, A-Arm weakness, S-Speech difficulty, T-Time to call ER immediately.'
    };

    document.addEventListener('click', (e) => {
        const tab = e.target.closest('.sos-tab-btn');
        if (tab) {
            document.querySelectorAll('.sos-tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const key = tab.getAttribute('data-tab');
            const content = document.getElementById('sosTabContent');
            if (content && firstAidGuides[key]) {
                content.innerHTML = firstAidGuides[key];
            }
        }
    });
})();

// --- 7. Universal Interactive Health & BMI Calculator Widget ---
(function initHealthBMICalculator() {
    if (document.getElementById('nova-health-calc-overlay')) return;

    const modalHTML = `
    <div id="nova-health-calc-overlay" class="nova-health-calc-overlay">
        <div class="nova-health-calc-card">
            <div class="calc-header">
                <h3><i class="fas fa-calculator"></i> Nova Interactive Health Calculator</h3>
                <button id="calcCloseBtn" class="ai-close-btn"><i class="fas fa-times"></i></button>
            </div>

            <div class="calc-body">
                <div class="calc-tabs">
                    <button class="calc-tab-btn active" data-mode="bmi"><i class="fas fa-weight-scale"></i> BMI Score</button>
                    <button class="calc-tab-btn" data-mode="water"><i class="fas fa-droplet"></i> Daily Water</button>
                    <button class="calc-tab-btn" data-mode="heart"><i class="fas fa-heart-pulse"></i> Target Heart Rate</button>
                </div>

                <div id="calcPanelBMI">
                    <div class="calc-form-grid">
                        <div class="calc-input-group">
                            <label><i class="fas fa-arrows-up-down"></i> Height (cm):</label>
                            <input type="number" id="calcHeight" class="calc-input" value="175" placeholder="e.g. 175">
                        </div>
                        <div class="calc-input-group">
                            <label><i class="fas fa-weight-scale"></i> Weight (kg):</label>
                            <input type="number" id="calcWeight" class="calc-input" value="70" placeholder="e.g. 70">
                        </div>
                    </div>

                    <div class="calc-result-card">
                        <div id="calcBMIScore" class="calc-score-display">22.9</div>
                        <div id="calcBMIBadge" class="calc-category-badge badge-normal">Normal Weight</div>
                        
                        <div class="calc-meter-bar">
                            <div id="calcMeterFill" class="calc-meter-fill" style="width: 57%;"></div>
                        </div>

                        <div id="calcAdvice" class="calc-advice-text">
                            Great job! Your BMI is in the healthy range. Maintain a balanced diet and regular exercise.
                        </div>

                        <a href="doctors.html" class="ai-action-btn" style="margin-top: 14px;">
                            <i class="fas fa-user-md"></i> Consult a Nutritionist
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('nova-health-calc-overlay');
    const closeBtn = document.getElementById('calcCloseBtn');
    const heightInput = document.getElementById('calcHeight');
    const weightInput = document.getElementById('calcWeight');
    const scoreDisplay = document.getElementById('calcBMIScore');
    const badgeDisplay = document.getElementById('calcBMIBadge');
    const meterFill = document.getElementById('calcMeterFill');
    const adviceDisplay = document.getElementById('calcAdvice');

    window.openBMICalculator = openCalcModal;

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[onclick*="openBMICalculator"], .open-health-calc');
        if (trigger) {
            e.preventDefault();
            openCalcModal();
        }
    });

    function openCalcModal() {
        overlay.classList.add('active');
        recalculateBMI();
    }

    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

    if (heightInput && weightInput) {
        heightInput.addEventListener('input', recalculateBMI);
        weightInput.addEventListener('input', recalculateBMI);
    }

    function recalculateBMI() {
        const h = parseFloat(heightInput.value) / 100;
        const w = parseFloat(weightInput.value);

        if (!h || !w || h <= 0 || w <= 0) return;

        const bmi = (w / (h * h)).toFixed(1);
        scoreDisplay.innerText = bmi;

        // Calculate fill percentage (mapped roughly between 15 and 35 BMI)
        let fill = Math.min(100, Math.max(10, ((bmi - 15) / 20) * 100));
        meterFill.style.width = fill + '%';

        if (bmi < 18.5) {
            badgeDisplay.className = 'calc-category-badge badge-underweight';
            badgeDisplay.innerText = 'Underweight';
            adviceDisplay.innerText = 'Your BMI is below the healthy range. Consider consulting a clinical dietitian for a nutrition plan.';
        } else if (bmi <= 24.9) {
            badgeDisplay.className = 'calc-category-badge badge-normal';
            badgeDisplay.innerText = 'Normal Weight';
            adviceDisplay.innerText = 'Excellent! Your weight is in the ideal healthy range. Keep up your active lifestyle.';
        } else if (bmi <= 29.9) {
            badgeDisplay.className = 'calc-category-badge badge-overweight';
            badgeDisplay.innerText = 'Overweight';
            adviceDisplay.innerText = 'Your BMI indicates slight overweight. Regular cardio exercise and portion control are recommended.';
        } else {
            badgeDisplay.className = 'calc-category-badge badge-obese';
            badgeDisplay.innerText = 'Obesity Risk';
            adviceDisplay.innerText = 'Your BMI is in the obesity category. We recommend scheduling a health checkup with our Senior Physician.';
        }
    }

    // Tab switching for Water & Heart Rate
    const tabs = document.querySelectorAll('.calc-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const mode = tab.getAttribute('data-mode');

            if (mode === 'water') {
                const w = parseFloat(weightInput.value) || 70;
                const waterL = (w * 0.035).toFixed(1);
                const glasses = Math.round((w * 0.035 * 1000) / 250);
                scoreDisplay.innerText = waterL + ' L';
                badgeDisplay.className = 'calc-category-badge badge-normal';
                badgeDisplay.innerText = 'Daily Water Goal';
                meterFill.style.width = '75%';
                adviceDisplay.innerHTML = `Based on your body weight (${w} kg), you should drink approximately <strong>${waterL} Liters</strong> (${glasses} glasses) of water daily.`;
            } else if (mode === 'heart') {
                scoreDisplay.innerText = '120-150';
                badgeDisplay.className = 'calc-category-badge badge-normal';
                badgeDisplay.innerText = 'Target Cardio Zone (BPM)';
                meterFill.style.width = '65%';
                adviceDisplay.innerHTML = `Your recommended fat-burn heart rate zone during aerobic exercise is <strong>115 to 155 BPM</strong> for optimal cardiovascular health.`;
            } else {
                recalculateBMI();
            }
        });
    });
})();

// --- 8. Universal Language Switcher (Somali / English Toggle) ---
(function initLanguageSwitcher() {
    // Check if toggle already exists
    if (document.getElementById('langToggleBtn')) return;

    // Target container for button placement
    const navCta = document.querySelector('.nav-cta');
    const navContainer = document.querySelector('.nav-container');

    const toggleBtnHTML = `
        <button id="langToggleBtn" class="lang-toggle-btn" title="Badal Luqadda / Switch Language">
            <i class="fas fa-globe"></i> <span id="langText">🇸🇴 SO</span>
        </button>
    `;

    if (navCta) {
        navCta.insertAdjacentHTML('beforeend', toggleBtnHTML);
    } else if (navContainer) {
        navContainer.insertAdjacentHTML('beforeend', toggleBtnHTML);
    }

    const langBtn = document.getElementById('langToggleBtn');
    const langText = document.getElementById('langText');

    if (!langBtn) return;

    // Translation Dictionary (English <-> Somali)
    const dictionary = {
        "Home": "Hooy",
        "About Us": "Naga Saabsan",
        "Services": "Adeegyada",
        "Doctors": "Dhakhaatiirta",
        "Pharmacy": "Farmashiyaha",
        "Patient Portal": "Portal-ka Bukaanka",
        "Admin Portal": "Portal-ka Maamulka",
        "Contact": "Xiriirka",
        "Book Appointment": "Balan Qabso",
        "Emergency Call": "Wac Gurmadka",
        "Nova Health Center": "Nova Health Center",
        "Our Vision for Modern Healthcare": "Hiigsigeenna Daryeelka Caafimaad ee Modern-ka ah",
        "All Departments": "Dhamaan Waaxyaha",
        "Cardiology": "Wadnaha (Cardiology)",
        "Neurology": "Maskaxda (Neurology)",
        "Pediatrics": "Caruurta (Pediatrics)",
        "Surgery": "Qalliinka (Surgery)"
    };

    // Reverse dictionary for Somali -> English
    const reverseDict = {};
    Object.keys(dictionary).forEach(key => {
        reverseDict[dictionary[key]] = key;
    });

    let currentLang = localStorage.getItem('nova_lang') || 'en';

    // Apply saved language on load
    if (currentLang === 'so') {
        applyLanguage('so', false);
    }

    langBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'so' : 'en';
        applyLanguage(nextLang, true);
    });

    function applyLanguage(lang, showNotification) {
        currentLang = lang;
        localStorage.setItem('nova_lang', lang);

        if (langText) {
            langText.innerText = lang === 'so' ? '🇬🇧 EN' : '🇸🇴 SO';
        }

        // Translate navbar links & CTA buttons
        const navLinks = document.querySelectorAll('.nav-links .nav-link, .nav-cta .btn, .btn-primary, .btn-outline');
        navLinks.forEach(el => {
            const rawText = el.innerText.trim();
            if (lang === 'so' && dictionary[rawText]) {
                el.innerText = dictionary[rawText];
            } else if (lang === 'en' && reverseDict[rawText]) {
                el.innerText = reverseDict[rawText];
            }
        });

        // Translate filter buttons if present
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            const rawText = btn.innerText.trim();
            if (lang === 'so' && dictionary[rawText]) {
                btn.innerText = dictionary[rawText];
            } else if (lang === 'en' && reverseDict[rawText]) {
                btn.innerText = reverseDict[rawText];
            }
        });

        if (showNotification && typeof showToast === 'function') {
            showToast(
                lang === 'so' ? 'Luqada waxaa loo badalay Af-Somali 🇸🇴' : 'Language switched to English 🇬🇧',
                'success'
            );
        }
    }
})();

// --- 9. Universal Appointment Confirmation Modal & Calendar Export (.ics / Google Calendar) ---
(function initAppointmentConfirmationSystem() {
    if (document.getElementById('nova-booking-overlay')) return;

    const modalHTML = `
    <div id="nova-booking-overlay" class="nova-booking-overlay">
        <div class="nova-booking-ticket">
            <div class="booking-header">
                <h3><i class="fas fa-circle-check"></i> Appointment Confirmed!</h3>
                <button id="bookingCloseBtn" class="ai-close-btn"><i class="fas fa-times"></i></button>
            </div>

            <div class="booking-body">
                <div id="bookingRefBadge" class="booking-ref-badge">REF: #NOV-84920</div>
                
                <h4 style="margin: 0 0 16px 0; font-size: 1.2rem; color: #f8fafc;">
                    Your Medical Consultation is Scheduled
                </h4>

                <div class="booking-details-list">
                    <div class="booking-detail-item">
                        <i class="fas fa-user-md"></i>
                        <div>
                            <strong style="display: block; color: #94a3b8; font-size: 0.75rem;">DOCTOR & SPECIALTY</strong>
                            <span id="bookingDocName" style="font-weight: 700; color: white;">Dr. Sarah Jenkins (Senior Cardiologist)</span>
                        </div>
                    </div>

                    <div class="booking-detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <div>
                            <strong style="display: block; color: #94a3b8; font-size: 0.75rem;">DATE & TIME</strong>
                            <span id="bookingDateTime" style="font-weight: 700; color: #38bdf8;">Tomorrow at 10:30 AM</span>
                        </div>
                    </div>

                    <div class="booking-detail-item">
                        <i class="fas fa-location-dot"></i>
                        <div>
                            <strong style="display: block; color: #94a3b8; font-size: 0.75rem;">CLINICAL LOCATION</strong>
                            <span id="bookingLocation" style="font-weight: 600;">Nova Health Main Hospital • Wing B, 3rd Floor</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 12px; font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">
                    Add to Calendar & Mobile Reminders:
                </div>

                <div class="booking-calendar-actions">
                    <a id="btnGoogleCal" href="#" target="_blank" class="btn-cal-google">
                        <i class="fab fa-google"></i> Google Calendar
                    </a>
                    <button id="btniCalExport" class="btn-cal-ical">
                        <i class="fas fa-calendar-plus"></i> iCal (.ics Export)
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('nova-booking-overlay');
    const closeBtn = document.getElementById('bookingCloseBtn');
    const refBadge = document.getElementById('bookingRefBadge');
    const docName = document.getElementById('bookingDocName');
    const dateTime = document.getElementById('bookingDateTime');
    const googleBtn = document.getElementById('btnGoogleCal');
    const icalBtn = document.getElementById('btniCalExport');

    let currentBooking = {
        refCode: '#NOV-84920',
        doctorName: 'Dr. Sarah Jenkins',
        department: 'Cardiology',
        date: 'Tomorrow, 10:30 AM',
        location: 'Nova Health Main Hospital • Wing B'
    };

    window.showAppointmentConfirmationModal = function(data) {
        if (data) {
            currentBooking = { ...currentBooking, ...data };
        }
        refBadge.innerText = 'REF: ' + currentBooking.refCode;
        docName.innerText = currentBooking.doctorName;
        dateTime.innerText = currentBooking.date;

        // Set Google Calendar Link
        const gTitle = encodeURIComponent(`Medical Appointment: ${currentBooking.doctorName}`);
        const gDetails = encodeURIComponent(`Ref: ${currentBooking.refCode} - Nova Health Center Medical Consultation.`);
        const gLoc = encodeURIComponent(currentBooking.location);
        googleBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gTitle}&details=${gDetails}&location=${gLoc}`;

        overlay.classList.add('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

    if (icalBtn) {
        icalBtn.addEventListener('click', () => {
            downloadICSFile(currentBooking);
        });
    }

    function downloadICSFile(b) {
        const icsData = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Nova Health Center//Medical Appointment//EN',
            'BEGIN:VEVENT',
            `SUMMARY:Medical Appointment - ${b.doctorName}`,
            `DESCRIPTION:Booking Reference: ${b.refCode}. Department: ${b.department}`,
            `LOCATION:${b.location}`,
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `Nova_Appointment_${b.refCode.replace('#','')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (typeof showToast === 'function') {
            showToast('iCal (.ics) Calendar file downloaded successfully! 📅', 'success');
        }
    }

    // Intercept form submissions for booking
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form.id === 'appointmentForm' || form.classList.contains('booking-form')) {
            e.preventDefault();
            const docInput = form.querySelector('[name="doctor"], select');
            const docVal = docInput ? docInput.value || 'Dr. Sarah Jenkins' : 'Dr. Sarah Jenkins';
            const randomRef = '#NOV-' + Math.floor(10000 + Math.random() * 90000);
            
            window.showAppointmentConfirmationModal({
                refCode: randomRef,
                doctorName: docVal,
                date: 'Tomorrow, 10:30 AM'
            });
        }
    });
})();





