import GenForm from "@/app/components/GenForm";
import React, { Suspense } from "react";
import Loading from "@/app/loading";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="m-12">
			<GenForm />
			<Suspense fallback={<Loading />}>
				{children} {/* This will render the page content */}
			</Suspense>
		</div>
	);
}
