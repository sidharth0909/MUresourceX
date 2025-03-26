# MUresourceX

## 📌 Project Overview
**MUresourceX** is a web application designed for **Mumbai University engineering students** to access educational resources based on their **branch, semester, and subjects**. The platform also provides an **admin dashboard** where administrators can:

- View **analytics** on uploaded resources.
- **Upload, edit, delete, and manage** resources.
- Track subject-wise resource availability.

The frontend is built using **React** with **tsparticles** for interactive UI effects, and the backend is powered by **Node.js**.

---

## 🚀 Features
### 🎓 **Student Section**
✅ Browse and download resources for:
- Your **engineering branch** (Computer, Mechanical, Civil, etc.).
- Your **semester** (1st to 8th).
- Specific **subjects** within the selected semester.

### 🔧 **Admin Dashboard**
✅ **Metrics & Analytics:** View statistics on uploaded resources.
✅ **CRUD Operations:**
- **Upload** new study materials.
- **Edit & update** existing resources.
- **Delete** outdated or incorrect files.
✅ **User-friendly interface** for managing resources efficiently.

---

## 🛠️ Tech Stack
### **Frontend (Client-side)**
- **React.js** – UI development
- **Styled Components** – Styling
- **tsparticles** – Animated background effects

### **Backend (Server-side)**
- **Node.js** – Backend runtime
- **Express.js** – API handling
- **Multer** – File uploads
- **MongoDB** – Database for storing metadata

---

## 📂 Project Structure
```
MUresourceX/
│── client/                  # Frontend (React.js)
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main React app
│   │   ├── index.js         # Entry point
│   ├── public/              # Static assets
│── server/                  # Backend (Node.js)
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── app.js               # Main server file
│── uploads/                 # Resource storage
│── README.md                # Project documentation
│── package.json             # Dependencies
```

---

## ⚙️ Installation & Setup
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/sidharth0909/MUresourceX.git
cd MUresourceX
```

### **2️⃣ Install Dependencies**
#### **For Frontend**
```sh
cd client
npm install
```
#### **For Backend**
```sh
cd server
npm install
```

### **3️⃣ Start the Application**
#### **Run Backend Server**
```sh
cd server
node app.js
```
#### **Run Frontend React App**
```sh
cd client
npm start
```
The app will be accessible at **`http://localhost:3000`**

---

## 🔗 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/resources/:branch/:semester/:subject` | Fetch resources |
| `POST` | `/api/upload` | Upload new resource |
| `PUT` | `/api/edit/:id` | Edit resource details |
| `DELETE` | `/api/delete/:id` | Delete resource |

---

## 🎥 Project Demo
<video width="800" controls>
  <source src="public/Overview.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>


## 📌 Future Enhancements
- ✅ Implement **user authentication** for role-based access.
- ✅ Add **search & filter functionality**.
- ✅ Improve **real-time analytics** for admin dashboard.
- ✅ Enable **comments & ratings** on resources.

---

## 🤝 Contributing
Contributions are welcome! Feel free to **fork the repository**, create a **new branch**, and submit a **pull request**.

---

## 📜 License
This project is licensed under the **MIT License**.