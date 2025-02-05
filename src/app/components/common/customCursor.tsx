import AnimatedCursor from "react-animated-cursor";

/**
 * A custom cursor component using react-animated-cursor.
 *
 * @returns {JSX.Element} The custom cursor component
 */
export default function CustomCursor() {
	return (
		<AnimatedCursor
			innerSize={0}
			outerSize={200}
			innerScale={0}
			outerScale={1}
			outerAlpha={1}
			outerStyle={{
				mixBlendMode: "exclusion",
				background: "radial-gradient(rgba(255, 255, 255, 0.1), transparent 70%)",
			}}
			trailingSpeed={1}
			showSystemCursor={true}
		/>
	);
}
