import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Carousel, Container, Row, Col, Card, Button } from "react-bootstrap";
import appointmentImg from "../../img/agenda.jpeg";
import carouselImg1 from "../../img/imagen1.jpeg";
import carouselImg2 from "../../img/imagen2.jpeg";
import carouselImg3 from "../../img/imagen3.jpeg";
import Testimonials from "./testimonial";


export const Home = () => {
	const { store } = useContext(Context);

	return (
		<div className="home-container">
			{/* Encabezado */}
			<div className="text-center mt-5">
				<h1>Bienvenido a Nuestra Clínica Oftalmológica</h1>
				<Link to="/login" className="btn btn-primary mt-3">Iniciar Sesión</Link>
			</div>

			{/* Carrusel de imágenes */}
			<Carousel className="mt-4">
				<Carousel.Item>
					<img className="d-block w-100" src={carouselImg1} alt="Primera imagen" />
					<Carousel.Caption>
						<h3>Cuida tu salud visual</h3>
						<p>Los mejores tratamientos oftalmológicos a tu alcance.</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<img className="d-block w-100" src={carouselImg2} alt="Segunda imagen" />
					<Carousel.Caption>
						<h3>Clínica con tecnología avanzada</h3>
						<p>Contamos con equipos de última generación para tu diagnóstico.</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<img className="d-block w-100" src={carouselImg3} alt="Tercera imagen" />
					<Carousel.Caption>
						<h3>Experiencia y profesionalismo</h3>
						<p>Nuestros especialistas están listos para atenderte.</p>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>

			{/* Sección de Noticias */}
			<Container className="mt-5">
				<h2 className="text-center">Noticias de la Clínica</h2>
				<Row className="mt-4">
					<Col md={4}>
						<Card className="mb-3">
							<Card.Img variant="top" src={appointmentImg} />
							<Card.Body>
								<Card.Title>Nuevo equipo de diagnóstico</Card.Title>
								<Card.Text>Hemos adquirido un equipo de diagnóstico ocular de última generación.</Card.Text>
								<Button variant="primary">Leer más</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4}>
						<Card className="mb-3">
							<Card.Img variant="top" src={carouselImg2} />
							<Card.Body>
								<Card.Title>Campaña de prevención</Card.Title>
								<Card.Text>Participa en nuestra campaña de prevención de enfermedades oculares.</Card.Text>
								<Button variant="primary">Leer más</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4}>
						<Card className="mb-3">
							<Card.Img variant="top" src={carouselImg3} />
							<Card.Body>
								<Card.Title>Charlas informativas</Card.Title>
								<Card.Text>Acompáñanos en nuestras charlas sobre el cuidado visual.</Card.Text>
								<Button variant="primary">Leer más</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
			<div className="text-center mt-5">
				{/* Otras secciones como el carrusel o noticias */}
				<Testimonials /> {/* Mostrar testimonios */}
			</div>
			{/* Sección de Testimonios */}

		</div>
	);
};
