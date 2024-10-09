import GenForm from "@/app/components/GenForm";

export default function Home() {
	return (
		<>
			<main className="flex h-screen justify-center items-center bg-white dark:bg-gray-900">
				<div className="w-full flex justify-center -mt-64">
					<GenForm />
				</div>
			</main>
		</>
	);
}
