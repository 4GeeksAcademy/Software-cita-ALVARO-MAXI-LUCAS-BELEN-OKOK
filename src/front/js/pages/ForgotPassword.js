import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Se ha enviado un enlace de recuperación a tu correo electrónico.");
            } else {
                setMessage(data.error || "Error al enviar el correo de recuperación.");
            }
        } catch (error) {
            setMessage("Error al enviar el correo de recuperación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-forgot-password d-flex justify-content-center align-items-center m-4">
            <div className="bg-white p-4 rounded-4 shadow-lg" style={{ maxWidth: '500px' }}>
                <h2 className="text-center mb-4" style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#074173',
                    textShadow: '1px 1px 2px #1679AB'
                }}>Recuperar Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#074173', color: 'white' }}>
                            <FaEnvelope />
                        </span>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                borderRadius: '0 5px 5px 0',
                                border: '1px solid #1679AB',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn w-100 mt-3"
                        style={{
                            fontSize: '16px',
                            padding: '10px',
                            borderRadius: '30px',
                            background: 'linear-gradient(135deg, #074173 0%, #1679AB 100%)',
                            color: 'white',
                            border: 'none',
                        }}
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
                    </button>
                </form>
                {message && <div className="mt-3 text-center" style={{ color: "#074173" }}>{message}</div>}
            </div>
        </div>
    );
};

export default ForgotPassword;
