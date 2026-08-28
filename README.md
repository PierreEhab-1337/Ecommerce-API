# Local Development Setup & Git Workflow

## 1. Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/PierreEhab-1337/Ecommerce-API.git
```

Navigate to the project directory:

```bash
cd Ecommerce-API
```

---

## 2. Install Dependencies

Install all required project packages:

```bash
npm install
```

This will install the dependencies defined in `package.json`.

---

## 3. Start the Development Server

Run the development server:

```bash
npm run dev
```

---

# Git Workflow

Before starting any development work, **create your own feature branch**.

## 1. Create a Feature Branch

```bash
git checkout -b feature/your-assigned-task
```

Replace `your-assigned-task` with a short description of your task.

For example:

```bash
git checkout -b feature/user-authentication
```

---

## 2. Make Your Changes

Complete your assigned task and test your changes locally.

---

## 3. Commit Your Changes

Stage your changes:

```bash
git add .
```

Create a commit:

```bash
git commit -m "feat: explain what you completed in your task"
```

Keep commit messages short and descriptive.

Example:

```bash
git commit -m "feat: add user authentication middleware"
```

---

## 4. Push Your Branch

Push your feature branch to GitHub:

```bash
git push origin feature/your-assigned-task
```

Example:

```bash
git push origin feature/user-authentication
```

---

## 5. Create a Pull Request

After pushing your branch to GitHub, go to the repository page.

GitHub will usually display a **“Compare & pull request”** button for your recently pushed branch.

* Click **“Compare & pull request”** if it appears.
* If it does not appear, go to the **Pull Requests** tab and click **“New Pull Request”**.
* Select your feature branch as the source branch.
* Select `main` as the target branch.
* Add a clear description of your changes.
* Create the Pull Request.

The **team lead will review the Pull Request** and merge it into `main` once the changes are approved.

---

> **Important:** Do not work directly on the `main` branch. Always create a feature branch for your assigned task.
