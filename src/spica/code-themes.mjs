// Shiki needs concrete colors. These are the sRGB anchors in tokens/colors.css;
// use the deeper primary/secondary inks so small code text stays readable.
// Light strings/numbers deepen the blue/periwinkle anchors for 4.5:1 on the iris wash.
const theme = (name, type, foreground, background, keyword, method, string, number, comment) => ({
	name,
	type,
	colors: { 'editor.foreground': foreground, 'editor.background': background },
	tokenColors: [
		{ scope: ['keyword', 'storage'], settings: { foreground: keyword } },
		{ scope: ['entity.name.function', 'support.function'], settings: { foreground: method } },
		{ scope: ['string'], settings: { foreground: string } },
		{ scope: ['constant.numeric', 'constant.language'], settings: { foreground: number } },
		{ scope: ['entity.name.type', 'support.type', 'support.class'], settings: { foreground: method } },
		{ scope: ['comment'], settings: { foreground: comment } },
	],
});

export const spicaLight = theme('spica-light', 'light', '#2A2630', '#FFFFFF', '#7E5BA8', '#904061', '#45688B', '#5360AA', '#585563');
export const spicaDark = theme('spica-dark', 'dark', '#EDEAFB', '#171723', '#CFB4E8', '#F6BCD6', '#A8CDF0', '#C9D2F2', '#A7AEDC');
