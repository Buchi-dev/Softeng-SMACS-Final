# User Manual for SMACS
Smart Management and Attendance Control System

---

**Version:** 1.0  
**Prepared by:** YUZON, Trista Justine M.  
**Date:** May 2025

---

## Table of Contents
1. Introduction
2. System Overview
3. System Requirements
4. User Roles & Permissions
5. Getting Started
6. Functional Features
7. Attendance Tracking Workflow
8. Report Generation
9. Security Features
10. FAQs & Troubleshooting
11. Contact & Support
12. Glossary

---

## 1. �� Introduction
SMACS (Smart Management and Attendance Control System) is a comprehensive, web-based platform designed specifically for educational institutions to automate and streamline the process of attendance tracking. The system leverages RFID (Radio Frequency Identification) technology, allowing students and staff to check in at events and institutional programs by simply tapping their RFID-enabled ID cards on a reader. This eliminates manual attendance taking, reduces errors, and provides real-time data for administrators and organizers. SMACS is built to support a wide range of events, from daily classes to large seminars, and is scalable to accommodate institutions of varying sizes. The system also includes robust reporting, user management, and security features to ensure data integrity and privacy.

---

## 2. 🖥️ System Overview
The SMACS system is composed of both hardware and software components, working together to provide a seamless attendance tracking experience.

- **Hardware:**
  - RFID-enabled ID cards are issued to all students and staff. Each card contains a unique RFID tag that identifies the user.
  - RFID readers are installed at event venues or entry points. These readers can be connected via USB or serial ports to a computer running the SMACS client interface.
- **Software:**
  - The web-based dashboard is accessible to users with appropriate permissions (Admins and Organizers). It provides real-time monitoring, event management, and reporting tools.
  - The backend database is built on MongoDB, a NoSQL database that allows for flexible and scalable storage of user, event, and attendance data.
- **Database:**
  - MongoDB is chosen for its ability to handle large volumes of data and its flexibility in storing complex relationships between users, events, and attendance records.
- **Use Case:**
  - The primary use case is to log attendance for students and staff during events, seminars, and institutional programs. The system can also be adapted for regular class attendance, faculty meetings, and other scenarios where accurate attendance tracking is required.

---

## 3. ⚙️ System Requirements
To ensure optimal performance and compatibility, the following hardware and software requirements must be met:

### ✅ Hardware
- **RFID Card Reader:**
  - A device capable of reading RFID tags, typically connected via USB or serial port. The reader must be compatible with the RFID tags embedded in the institution's ID cards.
- **RFID Tags:**
  - Each student and staff member must have an ID card with an embedded RFID tag. These tags store a unique identifier that is linked to the user's profile in the SMACS database.
- **Laptop or Desktop:**
  - Used by administrators and organizers to access the SMACS dashboard, manage events, and monitor attendance. The computer must have the necessary drivers to interface with the RFID reader.

### ✅ Software
- **Browser:**
  - The SMACS dashboard is web-based and requires a modern browser such as Chrome, Firefox, or Edge (latest versions recommended for security and compatibility).
- **Internet Connection:**
  - While SMACS supports offline caching for temporary network outages, a stable internet connection is recommended for real-time updates and data synchronization.
- **Operating System:**
  - The system is compatible with Windows 10 or later, macOS, and most Linux distributions. Ensure that the operating system is up to date and supports the required browser and hardware drivers.

---

## 4. 👥 User Roles & Permissions
SMACS implements a role-based access control (RBAC) system to ensure that users only have access to the features and data relevant to their responsibilities. The main roles are:

| Role         | Access Level                                                      |
|-------------|-------------------------------------------------------------------|
| **Admin**       | Full control over the system. Admins can manage all users, create and edit events, generate and download reports, configure system settings, and assign roles to other users. They are responsible for maintaining the integrity and security of the system.       |
| **Organizer**   | Organizers are typically faculty or staff members responsible for managing specific events. They can create and monitor events, view attendance records, and download reports related to their events. Organizers do not have access to system-wide settings or user management outside their scope.       |
| **Student/Staff** | The primary function for students and staff is to check in to events using their RFID-enabled ID cards. In future versions, they may also be able to view their personal attendance history through a self-service portal. |

Role assignment is managed by Admins through the dashboard, ensuring that only authorized personnel can access sensitive features.

---

## 5. 🚀 Getting Started
This section guides new users through the initial steps required to access and use the SMACS system.

### 5.1 Login
1. **Navigate to the SMACS login page:** Open your preferred web browser and enter the URL provided by your institution to access the SMACS login portal.
2. **Enter your email and password:** Use the credentials assigned to you by the system administrator. If you are a new user, your initial password may be provided via email or by your admin.
3. **(Optional) Two-Factor Authentication (2FA):** If your institution has enabled 2FA, you will be prompted to enter a verification code sent to your registered email or mobile device. This adds an extra layer of security to your account.

### 5.2 Dashboard Overview
- **Admin Dashboard:**
  - Displays overview cards summarizing the number of users, events, and attendance logs.
  - Provides a live feed of recent check-ins and system activity.
  - Includes quick access to report generation and system settings.
- **Organizer Dashboard:**
  - Shows a list of upcoming events the organizer is responsible for.
  - Displays live attendance data and recent scans for ongoing events.
  - Allows organizers to quickly access event management and reporting tools.

The dashboard is designed for clarity and efficiency, ensuring that users can quickly find the information and tools they need.

---

## 6. 🔧 Functional Features
This section details the core features available in SMACS, including event creation, user registration, live attendance tracking, and role management.

### 6.1 Event Creation
1. **Access the Events section:** From the dashboard sidebar, click on "Events" to view the list of existing events.
2. **Create a new event:** Click the "Create Event" button to open the event creation form.
3. **Input event details:**
   - **Title:** Enter a descriptive name for the event (e.g., "Freshman Orientation").
   - **Date and Time:** Specify when the event will take place. You can set start and end times to define the attendance window.
   - **Venue:** Indicate the location where the event will be held.
   - **Organizer:** Assign an organizer from the list of registered users.
4. **Save the event:** Click "Save" to add the event to the system. The event will now appear in the events list and be available for attendance tracking.

### 6.2 User & RFID Registration
1. **Navigate to Users > Add User:** Go to the Users section and click "Add User" to open the registration form.
2. **Fill out user information:** Enter the required details, including ID number, full name, course, year level, and other relevant fields.
3. **Register RFID:** Click the "Register RFID" button. The system will prompt you to scan the user's RFID card using the connected reader.
4. **Scan and assign RFID tag:** Hold the RFID card near the reader. The system will capture the tag's unique identifier and link it to the user's profile.
5. **Complete registration:** Save the user profile. The user is now registered and can check in at events using their RFID card.

### 6.3 Live Attendance Tracking
- **Real-time check-in:** As users scan their RFID cards at the event venue, the system records their check-in instantly. The dashboard updates in real-time, showing who has arrived and their attendance status.
- **Attendance statuses:**
  - **✅ Present:** User checked in within the allowed time window.
  - **⌛ Late:** User checked in after the designated start time but before the cutoff.
  - **❌ Absent:** User did not check in before the cutoff time. Absences are automatically recorded after the event ends or after a set threshold.
- **Notifications:** Organizers and admins can receive alerts for late arrivals or unregistered scans.

### 6.4 Role Management
- **Access role settings:** Go to Settings > Roles in the dashboard.
- **Assign or change roles:** Admins can assign roles to users (Admin, Organizer, Viewer) based on their responsibilities. This controls what features and data each user can access.
- **Role changes take effect immediately:** Users will see their new permissions the next time they log in or refresh the dashboard.

---

## 7. 📍 Attendance Tracking Workflow
This section explains the step-by-step process of how attendance is tracked using SMACS, from the moment a user enters the venue to the final logging of attendance data.

1. **User enters venue:** The student or staff member arrives at the event location where an RFID reader is installed.
2. **Scans RFID card:** The user taps their RFID-enabled ID card on the reader. The reader captures the card's unique identifier.
3. **Signal sent to server:** The RFID reader, connected to a computer running the SMACS client, sends the scan data to the server via the web interface.
4. **Database logging:** The server receives the scan, verifies the user and event, and logs the check-in time, event ID, and user ID in the MongoDB database.
5. **Dashboard update:** The dashboard updates in real-time, reflecting the user's attendance status for the event.

**Offline Mode:** If the internet connection is lost, the SMACS client caches scan data locally. Once the connection is restored, cached data is automatically synced with the server, ensuring no attendance records are lost.

---

## 8. 📊 Report Generation
SMACS provides powerful reporting tools to help administrators and organizers analyze attendance data and generate official records.

1. **Access the Reports section:** Click on "Reports" in the dashboard sidebar.
2. **Apply filters:** Use the available filters to narrow down the data you want to include in the report. You can filter by:
   - **Event:** Select a specific event or view all events.
   - **Date range:** Specify the time period for the report.
   - **Role:** Filter by user role (e.g., students, staff, organizers).
   - **Course/Section:** Focus on particular groups or classes.
3. **Generate the report:** Click the "Generate Report" button. The system will compile the filtered data into a structured report.
4. **Export options:** Reports can be exported in multiple formats, such as PDF for printing or CSV for further analysis in spreadsheet software.

Reports are designed to be clear, comprehensive, and suitable for official documentation or compliance purposes.

---

## 9. 🔐 Security Features
Security is a top priority in SMACS. The system incorporates multiple layers of protection to safeguard user data and prevent unauthorized access.

- **Encrypted RFID tag validation:** Each RFID scan is validated against encrypted records to prevent spoofing or unauthorized use of tags.
- **Role-Based Access Control (RBAC):** Only users with the appropriate roles can access sensitive features and data. Permissions are strictly enforced at both the frontend and backend levels.
- **Hashed user passwords:** All user passwords are securely hashed before being stored in the database, protecting against data breaches.
- **Optional Two-Factor Authentication (2FA):** Institutions can enable 2FA for added account security, requiring users to verify their identity with a second factor (such as a code sent to their email or phone).
- **Offline mode with secure local caching:** When operating offline, attendance data is encrypted and stored locally until it can be safely synced with the server.

---

## 10. 🛠️ FAQs & Troubleshooting
This section provides solutions to common issues users may encounter while using SMACS.

| Issue                   | Solution                                                      |
|------------------------|---------------------------------------------------------------|
| **RFID scan not working**  | Ensure the RFID card is registered to the user. Try re-scanning the card or restarting the RFID reader. If the problem persists, check the reader's connection to the computer.              |
| **Attendance not showing** | Verify that the computer is connected to the internet. If using offline mode, wait for the system to sync once the connection is restored.            |
| **Duplicate scan alerts**  | Make sure that the time gap enforcement setting is enabled in the system settings. This prevents multiple scans from being recorded in quick succession.            |
| **Login problems**         | Use the "Forgot Password" feature to reset your password. If you continue to have issues, contact your system administrator for assistance.                        |
| **Report data missing**    | Double-check the filters applied in the Reports section. Ensure you have selected the correct event and date range.   |

For issues not listed here, consult your system administrator or contact the support team.

---

## 11. 📞 Contact & Support
If you need assistance or encounter issues that cannot be resolved through the FAQs, please contact the SMACS support team:

- **Support Team Email:** hed-tjyuzon@smu.edu.ph
- **Phone:** +63 968 767 2917
- **Hours:** Monday to Friday, 8:00 AM–5:00 PM
- **Documentation Site:** [TBA - Insert web app URL]

Support is available for technical issues, user account problems, and general inquiries about the SMACS system. Please provide as much detail as possible when describing your issue to help the support team assist you efficiently.

---

## 12. 📚 Glossary
This glossary explains key terms and acronyms used throughout the SMACS manual.

| Term   | Definition                                                        |
|--------|-------------------------------------------------------------------|
| **RFID**   | Radio Frequency Identification – a wireless technology that uses electromagnetic fields to automatically identify and track tags attached to objects. In SMACS, RFID tags are embedded in ID cards to log user attendance.   |
| **Admin**  | A user with full permissions to manage the SMACS system, including user and event management, reporting, and system configuration.                                       |
| **Organizer** | A user responsible for managing specific events and viewing attendance logs. Organizers have limited permissions compared to Admins.                        |
| **UAT**    | User Acceptance Testing – a process where end users test the system to ensure it meets their requirements before official deployment.                                          |
| **CRUD**   | Create, Read, Update, Delete – the four basic operations for managing data in a database or application.                          |
