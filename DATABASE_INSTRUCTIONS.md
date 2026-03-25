# B.A.S.I.S. Database Management Guide

This guide explains how to manage the user and inventory databases in the B.A.S.I.S. (Balintawak Automated Storage and Inventory System).

## 📁 Database Storage

All data is stored in your browser's **localStorage**. This means:
- ✅ Data persists between sessions (survives page refreshes)
- ✅ No internet connection required
- ✅ Fast access and updates
- ⚠️ Data is specific to this browser on this device
- ⚠️ Clearing browser data will delete all records

## 👥 User Database

### Predefined Users (10 Total)

The system has exactly **10 authorized users**:

1. **Barangay Captain** (1 user)
   - Username: `captain`
   - Password: `captain2024`
   - Access: View-only across all committees

2. **Secretary** (1 user)
   - Username: `secretary`
   - Password: `secretary2024`
   - Access: Full access to all committees + exclusive print/export rights

3. **Committee Heads** (8 users)
   - `health_head` / `health2024` - Health Committee
   - `education_head` / `education2024` - Education Committee
   - `justice_head` / `justice2024` - Justice Committee
   - `appropriation_head` / `appropriation2024` - Appropriation Committee
   - `peace_head` / `peace2024` - Peace and Order Committee
   - `sports_head` / `sports2024` - Sports Committee
   - `agriculture_head` / `agriculture2024` - Agriculture Committee
   - `infrastructure_head` / `infrastructure2024` - Infrastructure Committee

### Exporting Users to Excel

#### Method 1: Export to CSV (Recommended)

1. Log in as **Secretary**
2. Navigate to **User Management** (in sidebar)
3. Click **"Export CSV"** button
4. Open the downloaded `.csv` file in Microsoft Excel
5. Edit user information as needed (keep column structure intact)
6. Save the file

#### Method 2: Export to JSON

1. Log in as **Secretary**
2. Navigate to **User Management**
3. Click **"Export JSON"** button
4. Save the `.json` file for backup

### Importing Users from Excel

Since the system accepts only JSON format, you need to convert Excel data:

#### Step-by-Step Process:

1. **Export Current Data**
   - Click "Export CSV" to get the current structure
   - Open in Excel to see the format

2. **Edit in Excel**
   - Modify user details (Full Name, Email, Contact Number, etc.)
   - **DO NOT** change the number of users (must stay at 10)
   - **DO NOT** remove required columns (ID, Username, Password, etc.)

3. **Save as CSV**
   - File → Save As
   - Choose "CSV (Comma delimited) (*.csv)"
   - Save the file

4. **Convert CSV to JSON**
   - Use an online converter like:
     - https://www.convertcsv.com/csv-to-json.htm
     - https://csvjson.com/csv2json
   - Upload your CSV file
   - Download the resulting JSON file

5. **Import to B.A.S.I.S.**
   - Log in as **Secretary**
   - Navigate to **User Management**
   - Click **"Import JSON"** button
   - Select your converted JSON file
   - Confirm the import

### User Data Structure

Each user record contains:

```json
{
  "id": "user_001",
  "username": "captain",
  "password": "captain2024",
  "fullName": "Juan Dela Cruz",
  "role": "Barangay Captain",
  "department": null,
  "email": "captain@balintawak.gov.ph",
  "contactNumber": "+63 912 345 6789",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "lastLogin": "2026-03-23T10:30:00.000Z"
}
```

**Required Fields:**
- `id`: Unique identifier
- `username`: Login username
- `password`: Login password (plain text for now)
- `fullName`: Complete name
- `role`: Must be "Barangay Captain", "Secretary", or "Committee Head"
- `email`: Contact email
- `contactNumber`: Phone number
- `createdAt`: Account creation timestamp

**Optional Fields:**
- `department`: Required for Committee Heads only
- `lastLogin`: Automatically updated on login

---

## 📦 Inventory Database

### Stock Transactions

The inventory system tracks two types of transactions:

1. **Stock-In**: Items added to inventory
2. **Stock-Out**: Items removed from inventory

### Transaction Data Structure

Each transaction contains:

```json
{
  "id": "1234567890_abc123",
  "type": "stock-in",
  "itemName": "First Aid kits",
  "quantity": 20,
  "date": "2026-03-23",
  "department": "Health",
  "addedBy": "secretary",
  "createdAt": "2026-03-23T10:30:00.000Z"
}
```

### Departments

All transactions must belong to one of these 8 departments:
- Health
- Education
- Justice
- Appropriation
- Peace and Order
- Sports
- Agriculture
- Infrastructure

### Current Stock Calculation

Current stock is calculated automatically:
```
Current Stock = Total Stock-In - Total Stock-Out
```

For example:
- First Aid kits: 20 units IN - 5 units OUT = 15 units current stock

### Exporting Inventory Data

Currently, inventory export is available through the **Print Summary** feature (Secretary only):

1. Log in as **Secretary**
2. Go to **Dashboard**
3. Click **"Print Summary"** button
4. This generates a report with:
   - Total items
   - Total stock
   - Low stock alerts
   - Recent transactions

### Manual Backup Options

#### Option 1: Browser Developer Tools

1. Press `F12` to open Developer Tools
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage**
4. Find keys:
   - `basis_users` - User database
   - `basis_transactions` - Inventory transactions
5. Copy the JSON values for backup

#### Option 2: Console Export

1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Run these commands:

```javascript
// Export users
console.log(JSON.stringify(JSON.parse(localStorage.getItem('basis_users')), null, 2));

// Export transactions
console.log(JSON.stringify(JSON.parse(localStorage.getItem('basis_transactions')), null, 2));
```

4. Copy the output and save as `.json` files

### Manual Import (Advanced)

To manually import data via Developer Tools:

1. Prepare your JSON data
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Run:

```javascript
// Import users (MUST be array of 10 users)
localStorage.setItem('basis_users', JSON.stringify(YOUR_USERS_ARRAY));

// Import transactions
localStorage.setItem('basis_transactions', JSON.stringify(YOUR_TRANSACTIONS_ARRAY));
```

5. Refresh the page

---

## 🔒 Security Notes

### Important Security Considerations:

1. **Passwords are stored in plain text** in localStorage
   - This is acceptable for a local/internal system
   - NOT suitable for internet-facing applications
   - Consider this when setting passwords

2. **No PII (Personally Identifiable Information)**
   - B.A.S.I.S. is designed for inventory management
   - Do not store sensitive personal data
   - Keep data limited to official committee business

3. **Access Control**
   - Only 10 predefined users can access the system
   - No signup functionality
   - Each user has specific permissions:
     - **Captain**: View-only (cannot add/edit)
     - **Secretary**: Full access + print/export
     - **Committee Heads**: Can add transactions for their committee only

---

## 🔄 Backup Best Practices

### Recommended Backup Schedule:

1. **Daily** (if actively used)
   - Export users to CSV/JSON
   - Save to a secure folder

2. **Weekly**
   - Export full database (users + transactions)
   - Store on USB drive for offline backup
   - Keep at least 2 backup copies

3. **Monthly**
   - Archive old backups
   - Verify backup integrity by test-importing

### USB Backup Export

To create a USB backup:

1. Log in as **Secretary**
2. Export Users: User Management → Export CSV/JSON
3. Export Inventory: Dashboard → Print Summary (or manual export via Console)
4. Copy all exported files to USB drive
5. Label USB drive with date: "BASIS_Backup_2026-03-23"

---

## ❗ Troubleshooting

### "Failed to import users" Error

**Possible causes:**
- File is not valid JSON
- Missing required fields
- Incorrect number of users (must be exactly 10)
- Invalid role names

**Solution:**
1. Validate your JSON at https://jsonlint.com/
2. Ensure exactly 10 user objects
3. Check all required fields are present
4. Verify role names match exactly

### Data Disappeared

**Possible causes:**
- Browser cache/data cleared
- Using different browser/device
- Incognito/Private browsing mode

**Solution:**
- Restore from latest backup
- Click "Reset to Default" to restore predefined users
- Always maintain regular backups

### Cannot Access User Management

**Cause:** Only the Secretary can access User Management

**Solution:** Log in with secretary credentials:
- Username: `secretary`
- Password: `secretary2024`

---

## 📞 Support

For assistance with database management:
- Contact your system administrator
- Refer to this documentation
- Check the B.A.S.I.S. user manual

---

**Last Updated:** March 23, 2026  
**System Version:** B.A.S.I.S. v1.0  
**Barangay Balintawak Inventory Management System**
