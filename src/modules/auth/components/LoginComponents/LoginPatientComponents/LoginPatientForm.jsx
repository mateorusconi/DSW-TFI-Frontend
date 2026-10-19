import "./LoginPatientFormStyle.css";
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
            type="text"
            inputMode="numeric"
            placeholder="🛈︎  Numero de documento"
            required
            pattern="[1-9][0-9]{6,7}"
            title="Ingrese un DNI de 7 u 8 digitos, sin puntos ni espacios."
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
