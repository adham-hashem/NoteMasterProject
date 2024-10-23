import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Catalog from "../../features/catalog/Catalog";
import SubjectNotes from "../../features/catalog/SubjectNotes";
import Login from "../../features/login/LoginPage";
import HomePage from "../../features/home/HomePage";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import Logout from "../../features/logout/Logout";
import RegisterPage from "../../features/register/RegisterPage";
import SettingsPage from "../../features/settings/SettingsPage";
import ForgotPassword from "../../features/ForgotPassword/forgotPassword";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <HomePage /> },
            { path: '/subjects', element: <Catalog /> },
            { path: '/subjects/:id/notes', element: <SubjectNotes /> },
            { path: '/about', element: <AboutPage /> },
            { path: '/contact', element: <ContactPage /> },
            { path: '/login', element: <Login /> },
            { path: '/logout', element: <Logout /> },
            { path: '/register', element: <RegisterPage /> },
            { path: '/settings', element: <SettingsPage /> },
            { path: '/forgot-password', element: <ForgotPassword /> },
        ]
    }
])