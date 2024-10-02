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
        <div className="container d-flex justify-content-center align-items-center my-4 " >
            <div className="bg-white p-5 rounded-4 shadow-lg d-flex flex-column justify-content-center" style={{ maxWidth: '600px', width: '100%' }}>
                <h1 className="mb-4 text-center" style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#074173',
                    textShadow: '1px 1px 2px #1679AB'
                }}>Registro de Usuario</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#074173' }}>Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#074173' }}>Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#074173' }}>Tipo de documento</label>
                        <select className="form-select" onChange={handelDocumentType}>
                            <option value="">Seleccione...</option>
                            <option value="DNI">DNI</option>
                            <option value="NIE">NIE</option>
                            <option value="NIF">NIF</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#074173' }}>Número de documento</label>
                        <input
                            type="text"
                            className="form-control"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#074173' }}>Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#074173' }}>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#074173' }}>Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#074173' }}>Confirmar Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#074173' }}>Teléfono</label>
                        <input
                            type="number"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn w-100 mt-3"
                        style={{
                            fontSize: '16px',
                            padding: '10px',
                            borderRadius: '30px',
                            background: 'linear-gradient(135deg, #074173 0%, #1679AB 100%)',
                            color: 'white',
                            border: 'none',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #1679AB 0%, #074173 100%)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #074173 0%, #1679AB 100%)'}
                    >Registrarse</button>
                </form>
            </div>

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" style={{ backgroundColor: '#C5FF95' }}>
                        <div className="toast-header" style={{ backgroundColor: '#5DEBD7', color: '#074173' }}>
                            <strong className="me-auto">¡Registro Exitoso!</strong>
                        </div>
                        <div className="toast-body" style={{ color: '#074173' }}>
                            <p>Serás redirigido al login en breve...</p>
                            <div className="progress mt-2" style={{ height: '5px' }}>
                                <div
                                    className="progress-bar progress-bar-striped"
                                    role="progressbar"
                                    style={{ backgroundColor: '#1679AB', width: '100%', transition: 'width 3s linear' }}>
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
