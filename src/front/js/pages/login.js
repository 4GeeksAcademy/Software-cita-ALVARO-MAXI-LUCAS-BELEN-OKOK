import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estado para el modal de éxito
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            setShowSuccessModal(true);  // Muestra el modal de éxito
            setTimeout(() => {
                navigate("/");  // Redirige al login después de 3 segundos
            }, 3000);
            // Redirige al home después del login exitoso
        } else {
            alert("Error en el login, por favor verifica tus credenciales.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '100vh', background: '#f4f7f6' }}>
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="mb-4 text-center" style={{ fontSize: '28px', fontWeight: '600', color: '#333' }}>Iniciar Sesión</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-3" style={{ fontSize: '16px', padding: '10px' }}>Login</button>
                </form>
            </div>
            {showSuccessModal && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="me-auto">¡Bienvenido a Oftalmologia Ventilador!</strong>
                        </div>
                        <div className="toast-body">
                            <p>Serás redirigido al Home en breve...</p>
                            <div className="progress mt-2" style={{ height: '5px' }}>
                                <div
                                    className="progress-bar progress-bar-striped bg-success"
                                    role="progressbar"
                                    style={{ width: '100%', transition: 'width 3s linear' }}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
