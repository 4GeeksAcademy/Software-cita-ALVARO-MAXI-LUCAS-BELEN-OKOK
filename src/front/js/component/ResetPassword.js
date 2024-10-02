import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Obtener el token de los parámetros de la URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Contraseña restablecida con éxito. Redirigiendo a la página de inicio de sesión...");
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setMessage(data.error || "Error al restablecer la contraseña.");
            }
        } catch (error) {
            setMessage("Error al restablecer la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-reset-password d-flex justify-content-center align-items-center m-4">
            <div className="bg-white p-4 rounded-4 shadow-lg" style={{ maxWidth: '500px' }}>
                <h2 className="text-center mb-4">Restablecer Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirmar nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Restableciendo..." : "Restablecer Contraseña"}
                    </button>
                </form>
                {message && <div className="mt-3 text-center" style={{ color: "#074173" }}>{message}</div>}
            </div>
        </div>
    );
};

export default ResetPassword;
