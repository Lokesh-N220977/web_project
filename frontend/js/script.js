document.addEventListener('DOMContentLoaded', () => {
    // Determine the current page to set active menu and sidebar items
    const path = window.location.pathname;
    const page = path.split("/").pop();

    console.log("Current page:", page);

    // Sidebar menu items based on dashboard type
    const patientMenu = [
        { name: 'Dashboard', icon: 'fas fa-home', link: 'patient_dashboard.html' },
        { name: 'Book Appointment', icon: 'fas fa-calendar-plus', link: 'appointment.html' },
        { name: 'My Appointments', icon: 'fas fa-calendar-check', link: 'my_appointments.html' },
        { name: 'Visit History', icon: 'fas fa-history', link: 'visit_history.html' },
        { name: 'Profile', icon: 'fas fa-user', link: 'profile.html' },
    ];

    const adminMenu = [
        { name: 'Dashboard', icon: 'fas fa-chart-line', link: 'admin_dashboard.html' },
        { name: 'Manage Patients', icon: 'fas fa-users', link: '#' },
        { name: 'Manage Doctors', icon: 'fas fa-user-md', link: '#' },
        { name: 'Appointments', icon: 'fas fa-calendar-alt', link: '#' },
        { name: 'Analytics', icon: 'fas fa-poll', link: 'analytics.html' },
        { name: 'Settings', icon: 'fas fa-cog', link: '#' },
    ];

    const menuContainer = document.getElementById('sidebar-menu');

    if (menuContainer) {
        let menuItems = [];
        if (page.includes('admin') || page.includes('analytics')) {
            menuItems = adminMenu;
        } else {
            menuItems = patientMenu;
        }

        menuItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.link;
            if (page === item.link) a.classList.add('active');

            a.innerHTML = `<i class="${item.icon}"></i> <span>${item.name}</span>`;
            li.appendChild(a);
            menuContainer.appendChild(li);
        });
    }

    // Handle Login Simulation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('role').value;
            if (role === 'admin') {
                window.location.href = 'admin_dashboard.html';
            } else {
                window.location.href = 'patient_dashboard.html';
            }
        });
    }
    // --- Appointment Booking Logic ---
    if (page === 'appointment.html' || path.includes('appointment.html')) {
        const timeSlots = document.querySelectorAll('.time-slot');
        const selectedTimeInput = document.getElementById('selectedTime');
        const appointmentForm = document.getElementById('appointmentForm');
        const dateInput = document.getElementById('date');

        if (dateInput) {
            // Set dynamic min and max dates for exactly 3 months (90 days)
            const today = new Date();
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + 90); // 3 months professional limit

            // Format YYYY-MM-DD
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            dateInput.min = formatDate(today);
            dateInput.max = formatDate(maxDate);
        }

        if (timeSlots.length > 0 && selectedTimeInput) {
            // Handle time slot selection
            timeSlots.forEach(slot => {
                slot.addEventListener('click', function () {
                    // Remove selected class from all
                    timeSlots.forEach(s => s.classList.remove('selected'));
                    // Add selected class to clicked slot
                    this.classList.add('selected');
                    // Update hidden input
                    selectedTimeInput.value = this.dataset.time || this.textContent.trim();
                });
            });
        }

        if (appointmentForm) {
            // Handle form submission
            appointmentForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const formData = new FormData(this);
                const appointmentData = {
                    department: formData.get('department'),
                    doctor: formData.get('doctor'),
                    date: formData.get('date'),
                    time: formData.get('time')
                };

                console.log('Prepared Data:', appointmentData);

                // Send POST request
                fetch('/api/appointments/book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(appointmentData)
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(data => {
                        console.log('Success:', data);
                        alert('Appointment booked successfully!');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Failed to book appointment.');
                    });
            });
        }
    }

    // --- My Appointments Logic ---
    if (page === 'my_appointments.html' || path.includes('my_appointments.html')) {
        const appointmentsList = document.getElementById('appointmentsList');

        if (appointmentsList) {
            const renderAppointments = (appointments) => {
                if (!appointments || appointments.length === 0) {
                    appointmentsList.innerHTML = '<tr><td colspan="5" style="text-align:center;">No appointments found.</td></tr>';
                    return;
                }

                appointmentsList.innerHTML = '';
                appointments.forEach(app => {
                    const statusClass = app.status === 'Confirmed' ? 'status-confirmed' :
                        app.status === 'Pending' ? 'status-pending' : 'status-cancelled';

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${app.doctor}</strong></td>
                        <td>${app.department}</td>
                        <td>${app.date}</td>
                        <td>${app.time}</td>
                        <td><span class="status-badge ${statusClass}">${app.status}</span></td>
                    `;
                    appointmentsList.appendChild(row);
                });
            };

            const fetchAppointments = () => {
                fetch('/api/appointments/user')
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(data => renderAppointments(data))
                    .catch(error => {
                        console.error('Error fetching appointments:', error);
                        appointmentsList.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Failed to load appointments</td></tr>';
                    });
            };

            fetchAppointments();
        }
    }

    // --- Visit History Logic ---
    if (page === 'visit_history.html' || path.includes('visit_history.html')) {
        const historyList = document.getElementById('historyList');

        if (historyList) {
            const renderHistory = (history) => {
                if (!history || history.length === 0) {
                    historyList.innerHTML = '<tr><td colspan="5" style="text-align:center;">No visit history found.</td></tr>';
                    return;
                }

                historyList.innerHTML = '';
                history.forEach(visit => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${visit.doctor}</strong></td>
                        <td>${visit.department}</td>
                        <td>${visit.date}</td>
                        <td>${visit.time}</td>
                        <td><span class="status-badge status-confirmed">Completed</span></td>
                    `;
                    historyList.appendChild(row);
                });
            };

            const fetchHistory = () => {
                // Commented out the true fetch call to mock the API similarly to appointments list
                /*
                fetch('/api/appointments/history')
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.json();
                    })
                    .then(data => renderHistory(data))
                    .catch(error => {
                        console.error('Error fetching history:', error);
                        historyList.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Failed to load visit history</td></tr>';
                    });
                */

                // Simulated API response for verification
                setTimeout(() => {
                    const mockData = [
                        { doctor: 'Dr. Smith (General Physician)', department: 'General Medicine', date: '2024-01-15', time: '10:00 AM' },
                        { doctor: 'Dr. Rao (Cardiologist)', department: 'Cardiology', date: '2023-12-02', time: '11:30 AM' },
                        { doctor: 'Dr. Adams (Orthopedics)', department: 'Orthopedics', date: '2023-10-10', time: '09:15 AM' }
                    ];
                    renderHistory(mockData);
                }, 800);
            };

            fetchHistory();
        }
    }

    // --- Profile Logic ---
    if (page === 'profile.html' || path.includes('profile.html')) {
        const profileForm = document.getElementById('profileForm');
        const profileNotification = document.getElementById('profileNotification');

        // Sidebar/Nav elements to update dynamically
        const sidebarName = document.getElementById('sidebarName');
        const sidebarId = document.getElementById('sidebarId');
        const navUserName = document.getElementById('navUserName');

        const formInputs = profileForm ? profileForm.querySelectorAll('input, select, textarea') : [];
        const editBtn = document.getElementById('editProfileBtn');
        const cancelBtn = document.getElementById('cancelEditBtn');
        const saveBtn = document.getElementById('saveProfileBtn');

        let originalProfileData = {};

        const disableInputs = () => {
            formInputs.forEach(input => input.disabled = true);
            if (editBtn) editBtn.style.display = 'inline-block';
            if (cancelBtn) cancelBtn.style.display = 'none';
            if (saveBtn) saveBtn.style.display = 'none';
        };

        const enableInputs = () => {
            formInputs.forEach(input => input.disabled = false);
            if (editBtn) editBtn.style.display = 'none';
            if (cancelBtn) cancelBtn.style.display = 'inline-block';
            if (saveBtn) saveBtn.style.display = 'inline-block';
        };

        // Function to populate form fields
        const populateForm = (data) => {
            if (!data) return;

            // Populate form
            document.getElementById('fullName').value = data.fullName || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('dob').value = data.dob || '';
            document.getElementById('gender').value = data.gender || '';
            document.getElementById('bloodGroup').value = data.bloodGroup || '';
            document.getElementById('emergencyContact').value = data.emergencyContact || '';
            document.getElementById('address').value = data.address || '';

            // Update display elements
            if (sidebarName) sidebarName.textContent = data.fullName || 'User';
            if (navUserName) navUserName.textContent = data.fullName || 'User';
            if (sidebarId && data.id) sidebarId.textContent = `ID: ${data.id}`;
        };

        // Fetch User Data
        const fetchProfile = () => {
            /* 
            // Real fetch request
            fetch('/api/user/profile')
                .then(response => {
                    if (!response.ok) throw new Error('Failed to load profile');
                    return response.json();
                })
                .then(data => populateForm(data))
                .catch(error => console.error('Error fetching profile:', error));
            */

            // Dummy API Response for verification
            setTimeout(() => {
                const dummyProfile = {
                    id: 'PT-89420',
                    fullName: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+1 415 555 2671',
                    dob: '1985-06-15',
                    gender: 'Male',
                    bloodGroup: 'O+',
                    emergencyContact: 'Jane Doe (+1 415 555 9812)',
                    address: '123 Health Ave, Wellness City, CA 94102'
                };
                originalProfileData = dummyProfile;
                populateForm(dummyProfile);
                disableInputs(); // Default to View Mode
            }, 500);
        };

        fetchProfile();

        if (editBtn && cancelBtn) {
            editBtn.addEventListener('click', enableInputs);
            cancelBtn.addEventListener('click', () => {
                populateForm(originalProfileData);
                disableInputs();
                profileNotification.className = 'notification';
                profileNotification.textContent = '';
            });
        }

        // Handle Profile Update Submission
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Hide any existing notifications
                profileNotification.className = 'notification';
                profileNotification.textContent = '';

                // Gather form data
                const formData = new FormData(profileForm);
                const updatedData = Object.fromEntries(formData.entries());

                console.log('Sending Updated Profile Data:', updatedData);

                // Update UI visually right away
                if (sidebarName) sidebarName.textContent = updatedData.fullName;
                if (navUserName) navUserName.textContent = updatedData.fullName;

                /*
                // Real PUT Request
                fetch('/api/user/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Update failed');
                    return response.json();
                })
                .then(data => {
                    profileNotification.textContent = 'Profile updated successfully.';
                    profileNotification.className = 'notification success';
                    setTimeout(() => { profileNotification.className = 'notification'; }, 4000);
                })
                .catch(error => {
                    profileNotification.textContent = 'Failed to update profile. Please try again.';
                    profileNotification.className = 'notification error';
                    setTimeout(() => { profileNotification.className = 'notification'; }, 4000);
                });
                */

                // Simulated API Response
                setTimeout(() => {
                    profileNotification.textContent = 'Profile updated successfully.';
                    profileNotification.className = 'notification success';

                    originalProfileData = updatedData;
                    disableInputs(); // Return to view mode automatically

                    // Auto hide notification after 4 seconds
                    setTimeout(() => {
                        profileNotification.className = 'notification';
                    }, 4000);
                }, 800);
            });
        }
    }
});
