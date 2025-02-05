/**
 * Up arrow SVG icon.
 *
 * @returns {JSX.Element} The up arrow icon component
 */
export default function UpArrow() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="50"
			height="50"
			stroke="currentColor"
			transform="matrix(-1,1.2246467991473532e-16,-1.2246467991473532e-16,-1,0,0)"
		>
			<path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z"></path>
			<path d="M12 12.586 8.707 9.293l-1.414 1.414L12 15.414l4.707-4.707-1.414-1.414L12 12.586z"></path>
		</svg>
	);
}
