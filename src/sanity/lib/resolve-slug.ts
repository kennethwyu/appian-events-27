export default function resolveSlug({
	internal,
	params,
	external,
}: {
	// internal
	_type?: string
	internal?: string
	params?: string
	// external
	external?: string
}) {
	if (external) return external

	if (internal) {
		const path = internal === 'index' ? null : internal

		return ['/', path, params].filter(Boolean).join('')
	}

	return undefined
}
