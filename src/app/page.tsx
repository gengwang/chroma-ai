import GenForm from "@/app/components/GenForm";

export default function Home() {
	return (
		<>
			<main className="flex h-screen justify-center items-center">
				<div className="w-full flex justify-center -mt-64">
					<GenForm />
				</div>
			</main>
		</>
	);
}
