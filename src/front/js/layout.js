import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import injectContext from "./store/appContext";

import {CustomNavbar} from "./component/navbar"; // Cambia aquí
import { Footer } from "./component/footer";
import { Services } from "../js/pages/services";
import { ServiceDetail } from "../js/pages/servicedetail";
import { AppointmentForm } from "../js/pages/appointmentform";
import { Testimonials } from "../js/pages/testimonial";
import { ContactForm } from "../js/pages/contactform";
import { adminpanel } from "../js/pages/adminpanel";
import {AuthProvider} from "./store/AuthContext";
import {AppointmentProvider} from "./store/AppointmentContext";
import {TestimonialProvider} from "./store/TestimonialContext";
import {protectroute} from "../js/pages/protectroute";
import { Login } from "../js/pages/login";
import { Signup } from "../js/pages/signup";
import { RegisterProvider } from "./store/RegisterContext";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <RegisterProvider>
            <TestimonialProvider>
            <AppointmentProvider>
            <AuthProvider>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <CustomNavbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Services />} path="/services" />
                        <Route element={<ServiceDetail />} path="/services/:id" />
                        <Route element={<AppointmentForm />} path="/appointment" />
                        <Route element={<Testimonials />} path="/testimonials" />
                        <Route element={<ContactForm />} path="/contact" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Signup />} path="/register" />
                        <Route element={<protectroute><adminpanel/></protectroute>} path="/admin" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
            </AuthProvider>
            </AppointmentProvider>
            </TestimonialProvider>
            </RegisterProvider>
        </div>
    );
};

export default injectContext(Layout);
