import { useEffect, useRef } from 'react';

interface Snowflake {
	id: number;
	x: number;
	y: number;
	speed: number;
	size: number;
	opacity: number;
	wobble: number;
	wobbleSpeed: number;
}

export default function SnowFlake() {
	const containerRef = useRef<HTMLDivElement>(null);
	const animationFrameRef = useRef<number | undefined>(undefined);
	const snowflakesRef = useRef<Snowflake[]>([]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Crear múltiples copos de nieve
		const createSnowflakes = () => {
			const count = 50; // Número de copos de nieve
			snowflakesRef.current = Array.from({ length: count }, (_, i) => ({
				id: i,
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight - window.innerHeight, // Empezar arriba
				speed: Math.random() * 2 + 0.5,
				size: Math.random() * 4 + 2,
				opacity: Math.random() * 0.7 + 0.3,
				wobble: Math.random() * Math.PI * 2,
				wobbleSpeed: Math.random() * 0.02 + 0.01,
			}));
		};

		createSnowflakes();

		const animate = () => {
			if (!container) return;

			snowflakesRef.current.forEach((snowflake) => {
				// Mover hacia abajo
				snowflake.y += snowflake.speed;

				// Efecto de balanceo (wobble)
				snowflake.wobble += snowflake.wobbleSpeed;
				snowflake.x += Math.sin(snowflake.wobble) * 0.5;

				// Reiniciar cuando sale de la pantalla
				if (snowflake.y > window.innerHeight) {
					snowflake.y = -10;
					snowflake.x = Math.random() * window.innerWidth;
				}

				// Mantener dentro de los límites horizontales
				if (snowflake.x < 0) {
					snowflake.x = window.innerWidth;
				} else if (snowflake.x > window.innerWidth) {
					snowflake.x = 0;
				}
			});

			// Actualizar el DOM
			container.innerHTML = snowflakesRef.current
				.map(
					(snowflake) => `
					<div
						class="snowflake"
						style="
							left: ${snowflake.x}px;
							top: ${snowflake.y}px;
							width: ${snowflake.size}px;
							height: ${snowflake.size}px;
							opacity: ${snowflake.opacity};
							transform: translate(-50%, -50%);
						"
					></div>
				`
				)
				.join('');

			animationFrameRef.current = requestAnimationFrame(animate);
		};

		animationFrameRef.current = requestAnimationFrame(animate);

		// Limpiar al desmontar
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
			aria-hidden="true"
		/>
	);
}
