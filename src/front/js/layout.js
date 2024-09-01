import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Services } from "../js/pages/services";
import { ServiceDetail } from "../js/pages/servicedetail";
import { appointmentform } from "../js/pages/appointmentform";
import { testimonials } from "../js/pages/testimonial";
import { contactform } from "../js/pages/contactform";
import { adminpanel } from "../js/pages/adminpanel";
import {AuthProvider} from "./store/AuthContext";
import {AppointmentProvider} from "./store/AppointmentContext";
import {TestimonialProvider} from "./store/TestimonialContext";
import {protectroute} from "../js/pages/protectroute";
import { login } from "../js/pages/login";
import { signup } from "../js/pages/signup";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <TestimonialProvider>
            <AppointmentProvider>
            <AuthProvider>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<services />} path="/services" />
                        <Route element={<servicedetail />} path="/services/:id" />
                        <Route element={<appointmentform />} path="/appointment" />
                        <Route element={<testimonials />} path="/testimonials" />
                        <Route element={<contactform />} path="/contact" />
                        <Route element={<login />} path="/login" />
                        <Route element={<signup />} path="/register" />
                        <Route element={<protectroute><adminpanel/></protectroute>} path="/admin" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
            </AuthProvider>
            </AppointmentProvider>
            </TestimonialProvider>
        </div>
    );
};

export default injectContext(Layout);
