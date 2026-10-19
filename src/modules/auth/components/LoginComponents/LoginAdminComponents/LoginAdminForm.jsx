import "./LoginAdminFormStyle.css";
import { useState } from "react";
function LoginForm() {
const [email, setEmail] = useState("");
const [dni, setDni] = useState("");

    function handleSubmit(event) {
    event.preventDefault();
    console.log("Formato válido. Todavía no se llamó al backend.");
}

return (
    <form className="FormularioInicioSesion" onSubmit={handleSubmit}>
    <div>
        <label htmlFor="email">Email</label>
        <input
            id="email"
            type="email"
            placeholder="✉︎  Nombre@correo.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
        ></input>
    </div>
    <div>
        <label htmlFor="dni">DNI / Numero de identificación</label>
        <input
            id="password"
            type="password"
            inputMode="text"
            placeholder="🔒︎  Contraseña"
            required
            //pattern, consultar sobre politicas de contraseña
            title="Contraseña incorrecta."
            value={dni}
            onChange={(event) => setDni(event.target.value)}
        ></input>
    </div>

    <button className="BotonIngresar" type="submit">
        Ingresar
    </button>
    </form>
);
}
export default LoginForm;
