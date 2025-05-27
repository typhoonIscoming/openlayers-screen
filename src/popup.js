export default (map) => {
	// Select  interaction
	var select = new ol.interaction.Select({
		hitTolerance: 5,
		multi: true,
		condition: ol.events.condition.singleClick
	})
	map.addInteraction(select)

	// Select control
	var popup = new ol.Overlay.PopupFeature({
		popupClass: 'default anim',
		select: select,
		canFix: true,
		template: {
			title: function (f) {
				console.log('====', f.get('name'))
				return f.get('name') + ' (' + f.get('level') + ')'
			},
			attributes: {
				region: { title: 'Région' },
				arrond: { title: 'Arrondissement' },
				cantons: { title: 'Cantons' },
				communes: { title: 'Communes' },
				// with prefix and suffix
				pop: {
					title: 'Population', // attribute's title
					before: '', // something to add before
					format: ol.Overlay.PopupFeature.localString(), // format as local string
					after: ' hab.' // something to add after
				},
				// calculated attribute
				pop2: {
					title: 'Population (kHab.)', // attribute's title
					format: function (val, f) {
						return (
							Math.round(
								parseInt(f.get('pop')) / 100
							).toLocaleString() + ' kHab.'
						)
					}
				}
			}
		}
	})

	map.addOverlay(popup)
}
