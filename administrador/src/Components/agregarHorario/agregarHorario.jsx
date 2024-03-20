import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import "../agregarHorario/css/agregarHorario.css";
import Navigation from "../NavigationComponent/Navigation";

function Horario() {
    const [nombreEmpleado, setNombreEmpleado] = useState('');
const [nombreAdmin, setNombreAdmin] = useState('');
const [apellidoPaterno, setApellidoPaterno] = useState('');
const [apellidoMaterno, setApellidoMaterno] = useState('');

const [contrato, setContrato] = useState('');
const [turno, setTurno] = useState('');
const [estadoSolicitud, setEstadoSolicitud] = useState('');
const [correo, setCorreo] = useState('');
const [razon, setRazon] = useState('');
    const [historial, setHistorial] = useState([]);
    const [administradores, setAdministradores] = useState([]);
    const [showFormulario, setShowFormulario] = useState(false);
    const [historialIndex, setHistorialIndex] = useState(null);
    const [busquedaNombre, setBusquedaNombre] = useState('');
    const [busquedaApellidoPaterno, setBusquedaApellidoPaterno] = useState('');
    const [busquedaApellidoMaterno, setBusquedaApellidoMaterno] = useState('');
    const [showEliminarModal, setShowEliminarModal] = useState(false);
    const [solicitudEliminarIndex, setSolicitudEliminarIndex] = useState(null);
    const [showAgregarModal, setShowAgregarModal] = useState(false);
    const [correoValido, setCorreoValido] = useState(true);
    const [correoEnUso, setCorreoEnUso] = useState(false);

    useEffect(() => {
        const storedHistorial = JSON.parse(localStorage.getItem('historialSolicitudes'));
        if (storedHistorial) {
            setHistorial(storedHistorial);
        }
    }, []);
    

    const guardarSolicitud = (event) => {
        event.preventDefault();
    
        // Verificar si el correo electrónico ya está en uso
        if (
            historial.some(
                (solicitud, idx) =>
                    solicitud.correo === correo && idx !== historialIndex
            )
        ) {
            setCorreoEnUso(true); // Establecer el estado correoEnUso en true si el correo está en uso
            return; // Salir de la función si el correo está en uso
        } else {
            setCorreoEnUso(false); // Establecer el estado correoEnUso en false si el correo no está en uso
        }
    
    
        const nuevaSolicitud = {
            nombreEmpleado: `${nombreEmpleado} ${apellidoPaterno} ${apellidoMaterno}`,
            nombreAdmin: nombreAdmin,
            contrato: contrato,
            turno: turno,
            estadoSolicitud: estadoSolicitud,
            correo: correo,
            razon: razon,
            fecha: new Date(),
            hora: obtenerHoraActual()
        };
    
        if (historialIndex !== null) {
            const updatedHistorial = [...historial];
            updatedHistorial[historialIndex] = nuevaSolicitud;
            setHistorial(updatedHistorial);
            localStorage.setItem('historialSolicitudes', JSON.stringify(updatedHistorial));
        } else {
            const updatedHistorial = [...historial, nuevaSolicitud];
            setHistorial(updatedHistorial);
            localStorage.setItem('historialSolicitudes', JSON.stringify(updatedHistorial));
        }
    
        axios.post('http://localhost:3002/horario', nuevaSolicitud)
            .then(response => {
                console.log('Datos del horario enviados correctamente:', response.data);
            })
            .catch(error => {
                console.error('Error al enviar los datos del horario:', error);
            });
    
        axios.get('http://localhost:3002/horario')
            .then(response => {
                console.log('Horarios obtenidos correctamente:', response.data);
            })
            .catch(error => {
                console.error('Error al obtener los horarios:', error);
            });
    
        alert(historialIndex !== null ? "Solicitud actualizada correctamente." : "Solicitud guardada correctamente.");
        resetForm(); // Aquí se llama a resetForm
        setShowFormulario(false);
        setShowAgregarModal(false);
    };
    
    const resetForm = () => {
        setNombreEmpleado('');
        setApellidoPaterno('');
        setApellidoMaterno('');
        setNombreAdmin('');
        setContrato('');
        setTurno('');
        setEstadoSolicitud('');
        setCorreo('');
        setRazon('');
    };
    

    

    const obtenerHoraActual = () => {
        const hora = new Date();
        const horaStr = hora.getHours();
        const minutosStr = hora.getMinutes();
        const segundosStr = hora.getSeconds();
        return `${horaStr}:${minutosStr}:${segundosStr}`;
    };

    const toggleFormulario = () => {
        setShowFormulario(!showFormulario);
    };

    const toggleAgregarModal = () => {
        setShowAgregarModal(!showAgregarModal);
    };

    const actualizarSolicitud = (index) => {
    const solicitud = historial[index];
    const idDelHorario = solicitud._id; // Aquí se obtiene el ID del horario
    setNombreEmpleado(solicitud.nombreEmpleado);
    setNombreAdmin(solicitud.nombreAdmin);
    setContrato(solicitud.contrato);
    setTurno(solicitud.turno);
    setEstadoSolicitud(solicitud.estadoSolicitud);
    setCorreo(solicitud.correo);
    setRazon(solicitud.razon);
    setHistorialIndex(index);
    setShowFormulario(true);
    setShowAgregarModal(true);
};

    const eliminarSolicitud = (index) => {
        if (index === null || index === undefined) {
            console.error("No se ha seleccionado ninguna solicitud para eliminar.");
            return;
        }
    
        const idSolicitudEliminar = historial[index]._id;
        if (!idSolicitudEliminar) {
            console.error("No se pudo encontrar el ID de la solicitud a eliminar.");
            return;
        }
    
        axios.delete(`http://localhost:3002/horario/${idSolicitudEliminar}`)
            .then(response => {
                console.log('Solicitud eliminada correctamente del servidor:', response.data);
                const updatedHistorial = historial.filter((solicitud, idx) => idx !== index);
                setHistorial(updatedHistorial);
                localStorage.setItem('historialSolicitudes', JSON.stringify(updatedHistorial));
                setShowEliminarModal(false);
            })
            .catch(error => {
                console.error('Error al eliminar la solicitud:', error);
            });
    };
    

    const abrirModalEliminar = (index) => {
        setSolicitudEliminarIndex(index);
        setShowEliminarModal(true);
    };
    


    const cerrarModalEliminar = () => {
        setShowEliminarModal(false);
    };

    const filtrarPorNombre = (e) => {
        setBusquedaNombre(e.target.value);
    };

    const filtrarPorApellidoPaterno = (e) => {
        setBusquedaApellidoPaterno(e.target.value);
    };

    const filtrarPorApellidoMaterno = (e) => {
        setBusquedaApellidoMaterno(e.target.value);
    };

    const historialFiltrado = historial.filter((solicitud) => {
        if (solicitud.nombreEmpleado && solicitud.nombreAdmin) {
            const nombreEmpleado = solicitud.nombreEmpleado.toLowerCase();
            const nombreAdmin = (typeof solicitud.nombreAdmin === 'string') ? solicitud.nombreAdmin.toLowerCase() : ''; 
            return nombreEmpleado.includes(busquedaNombre.toLowerCase()) &&
                nombreAdmin.includes(busquedaApellidoPaterno.toLowerCase()) &&
                solicitud.contrato.toLowerCase().includes(busquedaApellidoMaterno.toLowerCase());
        }
        return false;
    });
    

    return (
        <div>
            <Navigation />
            <div className="container">
                <div className="historial-container">
                    <h2>Historial de Horario</h2>
                    <button className="btn-agregar-horario" onClick={toggleAgregarModal}>
                        {showFormulario ? "Ocultar Formulario" : "Agregar Horario"}
                    </button>
                    <div className="filtros-container">
                        <div className="filtro-item">
                            <label htmlFor="busqueda-nombre">Filtrar por Nombre:</label>
                            <input
                                type="text"
                                id="busqueda-nombre"
                                value={busquedaNombre}
                                onChange={filtrarPorNombre}
                            />
                        </div>
                        <div className="filtro-item">
                            <label htmlFor="busqueda-apellido-paterno">Filtrar por Nombre del Administrador:</label>
                            <input
                                type="text"
                                id="busqueda-apellido-paterno"
                                value={busquedaApellidoPaterno}
                                onChange={filtrarPorApellidoPaterno}
                            />
                        </div>
                        <div className="filtro-item">
                            <label htmlFor="busqueda-apellido-materno">Filtrar por Contrato:</label>
                            <input
                                type="text"
                                id="busqueda-apellido-materno"
                                value={busquedaApellidoMaterno}
                                onChange={filtrarPorApellidoMaterno}
                            />
                        </div>
                    </div>
                    <div className="historial-table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nombre del Empleado</th>
                                    <th>Nombre del Administrador</th>
                                    <th>Contrato</th>
                                    <th>Turno</th>
                                    <th>Estado de la Solicitud</th>
                                    <th>Correo Electrónico</th>
                                    <th>Razón de la Solicitud</th>
                                    <th>Fecha de Solicitud</th>
                                    <th>Hora de Solicitud</th>
                                    <th>Actualizar</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historialFiltrado.map((solicitud, index) => (
                                    <tr key={index}>
                                        <td>{solicitud.nombreEmpleado}</td>
                                        <td>{administradores.find(admin => admin._id === solicitud.nombreAdmin)?.nombre}</td>
                                        <td>{solicitud.contrato}</td>
                                        <td>{solicitud.turno}</td>
                                        <td>{solicitud.estadoSolicitud}</td>
                                        <td>{solicitud.correo}</td>
                                        <td>{solicitud.razon}</td>
                                        <td>{solicitud.fecha instanceof Date ? solicitud.fecha.toLocaleDateString() : solicitud.fecha}</td>
                                        <td>{solicitud.hora instanceof Date ? solicitud.hora.toLocaleTimeString() : solicitud.hora}</td>
                                        <td>
                                            <button className="btn-actualizar" onClick={() => actualizarSolicitud(index)}>Actualizar</button>
                                        </td>
                                        <td>
                                        <button className="btn-eliminar" onClick={() => abrirModalEliminar(index)}>Eliminar</button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Modal show={showAgregarModal} onHide={toggleAgregarModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{historialIndex !== null ? "Actualizar Horario" : "Agregar Horario"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={guardarSolicitud} id="horarioForm">
                            <div className="form-group">
                                <label htmlFor="nombre-empleado">Nombre del Empleado</label>
                                <input
    type="text"
    id="nombre-empleado"
    value={nombreEmpleado}
    onChange={(e) => setNombreEmpleado(e.target.value)}
    required
/>

                            </div>
                            <div className="form-group">
                                <label htmlFor="nombre-admin">Nombre del Administrador</label>
                                <input
                                    type="text"
                                    id="nombre-admin"
                                    value={nombreAdmin}
                                    onChange={(e) => setNombreAdmin(e.target.value)}
                                    required
/>

                            </div>
                            <div className="form-group">
                                <label htmlFor="contrato">Contrato</label>
                                <select
                                    id="contrato"
                                    value={contrato}
                                    onChange={(e) => setContrato(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Aprobado">Aprobado</option>
                                    <option value="Rechazado">Rechazado</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="turno">Turno</label>
                                <select
                                    id="turno"
                                    value={turno}
                                    onChange={(e) => setTurno(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Dia">Día</option>
                                    <option value="Tarde">Tarde</option>
                                    <option value="Noche">Noche</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="estado-solicitud">Estado de la Solicitud</label>
                                <input
                                    type="text"
                                    id="estado-solicitud"
                                    value={estadoSolicitud}
                                    onChange={(e) => setEstadoSolicitud(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="correo">Correo Electrónico</label>
                                <input
                                    type="email"
                                    id="correo"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    required
                                />
                                {!correoValido && <p className="error-message">El correo ya existe en el historial de solicitudes.</p>}
                                {correoEnUso && <p className="error-message">El correo electrónico ya está en uso.</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="razon">Razón de la Solicitud</label>
                                <textarea
                                    id="razon"
                                    value={razon}
                                    onChange={(e) => setRazon(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={toggleAgregarModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" form="horarioForm">
                            Enviar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showEliminarModal} onHide={cerrarModalEliminar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar Solicitud</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ¿Está seguro de que desea eliminar esta solicitud?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cerrarModalEliminar}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={() => eliminarSolicitud(solicitudEliminarIndex)}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Horario;