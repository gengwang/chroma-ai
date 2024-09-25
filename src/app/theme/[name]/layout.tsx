import GenForm from "@/app/components/GenForm";
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="m-12">
			<GenForm />
			<Suspense fallback={<div>Loading...</div>}>
				{children} {/* This will render the page content */}
			</Suspense>
		</div>
	);
}
