import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterContext } from '../store/RegisterContext';

export const Signup = () => {
    const { register } = useContext(RegisterContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");


    // Estado para el modal de éxito
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handelDocumentType = (e) => {
        setDocumentType(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const success = await register(name, lastName, documentType, documentNumber, address, email, password, phone);
        if (success) {
            setShowSuccessModal(true);  // Muestra el modal de éxito
            setTimeout(() => {
                navigate("/login");  // Redirige al login después de 3 segundos
            }, 3000);
        } else {
            alert("Error en el registro, por favor inténtalo de nuevo.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '100vh', background: '#f4f7f6' }}>
            <div className="bg-white p-5 rounded shadow" style={{ maxWidth: '600px', width: '100%' }}>
                <h1 className="mb-4 text-center" style={{ fontSize: '28px', fontWeight: '600', color: '#333' }}>Registro</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Tipo de documento</label>
                        <select className="form-select" onChange={handelDocumentType}>
                            <option value="DNI">DNI</option>
                            <option value="NIE">NIE</option>
                            <option value="NIF">NIF</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Número de documento</label>
                        <input
                            type="text"
                            className="form-control"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Rol</label>
                        <input
                            type="text"
                            className="form-control"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Especialidad</label>
                        <input
                            type="text"
                            className="form-control"
                            value={speciality}
                            onChange={(e) => setSpeciality(e.target.value)}
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Confirmar Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="number"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" style={{ fontSize: '16px', padding: '10px' }}>Registrarse</button>
                </form>
            </div>
            {/* Modal de éxito */}
            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="me-auto">¡Registro Exitoso!</strong>
                        </div>
                        <div className="toast-body">
                            <p>Serás redirigido al login en breve...</p>
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

export default Signup;