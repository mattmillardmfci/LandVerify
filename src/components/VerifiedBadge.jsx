import React from "react";

/**
 * VerifiedBadge - Green checkmark badge to indicate verified data
 */
const VerifiedBadge = () => {
	return (
		<div className="flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-full px-3 py-1">
			<svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
					clipRule="evenodd"
				/>
			</svg>
			<span className="text-green-400 text-sm font-semibold">Verified</span>
		</div>
	);
};

export default VerifiedBadge;
