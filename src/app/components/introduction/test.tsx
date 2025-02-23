import { roboto } from "@/app/components/common/fonts";

/**
 * The introduction component.
 *
 * @returns {JSX.Element} Introduction component
 */
export default function Introduction() {
	return (
		<>
			<div
				className={`${roboto.variable} mb-1 mt-8 font-rubik text-xl text-lime-500 md:text-3xl lg:text-4xl 2xl:text-5xl selection:text-slate-950`}
			>
				Welcome!
			</div>
			<div className="flex h-full w-full flex-col justify-center text-center lg:flex-row">
				<div className="flex w-full justify-center p-4 lg:w-1/2 lg:justify-end">
					<div className="mr-0 flex w-full flex-col md:w-3/4 lg:ml-8 lg:mr-4 lg:w-4/5 xl:ml-16 xl:mr-16 xl:w-3/4 2xl:w-2/3">
						<p className="text-md 3xl:text-3xl pb-4 pt-4 lg:text-lg 2xl:text-xl">Purpose and features of the site</p>
						<div className="mb-4 mt-4 flex w-full flex-col rounded border-2 border-slate-300 p-4 hover:border-lime-500">
							<div className="flex flex-col text-left">
								<p className="pl-0 pt-2">SSS</p>
								<p className="pl-0">SS</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-full justify-center p-4 lg:w-1/2 lg:justify-start">
					<div className="ml-0 flex w-full flex-col md:w-3/4 lg:ml-4 lg:mr-8 lg:w-4/5 xl:ml-16 xl:mr-16 xl:w-3/4 2xl:w-2/3">
						<p className="text-md 3xl:text-3xl pb-4 pt-4 lg:text-lg 2xl:text-xl">Note</p>
					</div>
				</div>
			</div>
		</>
	);
}
