<h1 align="center">📝 Task Management App</h1>

<p align="center">
  A modern and intuitive employee task management system built with React.
</p>

<p align="center">
  <img alt="GitHub Repo Size" src="https://img.shields.io/github/repo-size/Manish-Yadav77/Task-Management-App" />
  <img alt="GitHub Last Commit" src="https://img.shields.io/github/last-commit/Manish-Yadav77/Task-Management-App" />
  <img alt="License" src="https://img.shields.io/github/license/Manish-Yadav77/Task-Management-App" />
  <img alt="Stars" src="https://img.shields.io/github/stars/Manish-Yadav77/Task-Management-App?style=social" />
</p>

---

## 🚀 Live Demo

> _Coming soon..._  
> You can deploy via [Netlify](https://netlify.com) or [Vercel](https://vercel.com) and paste the link here.

---

## 📌 Features

- 🧑‍💼 Add, Edit, and Delete Employees
- 📋 Assign tasks with customer complaints, deadlines & diagnostics
- 🔍 Search and filter employee list
- 🗃 View employee details & assigned tasks
- 🎯 Track task status (Pending, In Progress, Done)
- 💾 LocalStorage persistence
- 🧠 Context API state management
- 🎨 Clean Bootstrap UI

---

## 🧠 Tech Stack

| Technology     | Purpose                        |
|----------------|--------------------------------|
| **React.js**   | Frontend UI                    |
| **Bootstrap**  | Responsive design              |
| **Context API**| Global state handling          |
| **LocalStorage**| Persistent data (no backend)  |
| **React Router** | Routing between pages        |
| **React Portal** | Dropdowns/Modals rendering   |

---

## 🏗️ Project Structure

```
Task-Management-App/
├── public/
├── src/
│   ├── Components/
│   │   ├── Employees.jsx
│   │   ├── AddEmployees.jsx
│   │   ├── EmployeesTasks.jsx
│   │   └── Modals/
│   ├── Context/
│   │   ├── EmployeeContext.jsx
│   │   └── CustomerContext.jsx
│   ├── Layout/
│   │   └── AppLayout.jsx
│   ├── Pages/
│   │   ├── CustomerProfile.jsx
│   │   └── CustomerComplaint.jsx
│   ├── App.jsx
│   └── index.js
```

---

## 📥 Getting Started

```bash
# Clone the repository
git clone https://github.com/Manish-Yadav77/Task-Management-App.git

# Move into the project directory
cd Task-Management-App

# Install dependencies
npm install

# Run the development server
npm start
```

> Your app will start at: `http://localhost:3000`

---

## 📚 How It Works

- **Add Employees** using a clean form interface
- **Assign Tasks** based on customer complaints
- **Task Form** includes fields like:
  - Project Name
  - Related Customer
  - Description (from complaints)
  - Last Update
- **Modals** show detailed employee + task data
- **Data Syncs** in real-time using `localStorage`

---

## 🛠️ Future Scope

- 🔐 Authentication (Login/Role-based Access)
- 🌐 Backend (Node, Express, MongoDB/Firebase)
- 📱 PWA Support for mobile
- 📊 Dashboard with charts
- ✉️ Email alerts for deadlines

---

## 🙌 Contribution

Contributions are welcome!

```bash
# Fork the repo
# Create a feature branch
# Commit your changes
# Push and create a Pull Request
```

---

## ❓ FAQs

**Q: Does it need a backend?**  
A: No, it runs 100% on the frontend using localStorage.

**Q: Can I link it to APIs later?**  
A: Yes, easily pluggable with REST/GraphQL or Firebase.

---

## 📄 License

This project is licensed under the **MIT License**.  
See [`LICENSE`](./LICENSE) for details.

---

## 👨‍💻 Author

**Manish Kumar Yadav**  
📎 [GitHub](https://github.com/Manish-Yadav77)  
📫 Open to collaboration!

---

> ⭐ Don’t forget to star this repo if you found it helpful!
