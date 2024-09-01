import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import login from "./login";



export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Bienvenido a Nuestra Clinica</h1>
			<nav>
				<Link to="/login"><span>LOGEATE</span> </Link>
			</nav>
			
			<p>
				<img src={rigoImageUrl} />
				Ofrecemos los mejores servicios medicos para el cuidado de tus ojos
			</p>
			<div className="alert alert-info">
				
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p>
		</div>
	);
};
