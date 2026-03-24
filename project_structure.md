# CRM System Structure

## Directory Structure

- crm_saas_aicoding_demo/
    - backend/
        - config/
            - db.js
            - server.js
        - controllers/
            - userController.js
            - authController.js
        - models/
            - User.js
            - Product.js
        - routes/
            - userRoutes.js
            - authRoutes.js
        - middleware/
            - authMiddleware.js
        - .env
        - package.json
        - package-lock.json
    - frontend/
        - public/
            - index.html
            - favicon.ico
        - src/
            - components/
                - App.js
                - Header.js
                - Footer.js
                - UserForm.js
            - pages/
                - Home.js
                - Login.js
                - Dashboard.js
            - App.css
            - index.js
            - package.json
    - database/
        - schemas/
            - userSchema.js
            - productSchema.js
    - .gitignore
    - README.md

## Description
This structure provides a clear separation of concerns between the backend and frontend, enabling easy development and maintenance of the CRM system project.