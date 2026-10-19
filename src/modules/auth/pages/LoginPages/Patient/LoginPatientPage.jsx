import LoginForm from '../../../components/LoginComponents/LoginPatientComponents/LoginPatientForm.jsx'
import './LoginPatientPageStyle.css'

function LoginPage() {
return (
    <main className="PaginaInicioSesion">
    <section className="TarjetaInicioSesion">
    <h1 className="TituloConsultorio">MedPortal</h1>
    <h2 className="TituloInicioSesion">Acceso al paciente</h2>
    <p className="TextoAyuda">Ingrese sus datos en los campos correspondientes para continuar</p>
    <LoginForm />   
    <div className='SoporteAcceso'>
        <p className='TextoSoporte'>¿No tiene una cuenta o tiene problemas para acceder?</p>
        <a className='LinkSoporte'href='LinkSoporte'>Contactar con soporte técnico</a>
    </div>
    </section>

    </main>
)
}

export default LoginPage