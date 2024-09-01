import React, { useState, useContext } from "react"; // Asegúrate de importar useContext
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { store, actions } = useContext(Context); // Aquí usamos el useContext para acceder al contexto
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const success = await actions.signup(email, password);
        if (success) {
            navigate("/login");  // Redirige al login después del registro exitoso
        } else {
            alert("Error en el registro, por favor inténtalo de nuevo.");
        }
    };

    return (
        <div className="container mt-5">
            <h1>Registro</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Confirmar Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Registrarse</button>
            </form>
        </div>
    );
};
