import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import satori from 'satori'
import sharp from 'sharp'

const fonts = Promise.all([
	readFile(resolve(process.cwd(), 'src', 'assets', 'fonts', 'Alice-Regular.ttf')),
	readFile(resolve(process.cwd(), 'src', 'assets', 'fonts', 'Nunito-Regular.ttf'))
]).then(([alice, nunito]) => [
	{ name: 'Alice', data: alice, weight: 400 as const },
	{ name: 'Nunito', data: nunito, weight: 400 as const }
])

const templatePath = resolve(
	process.cwd(),
	'public',
	'gen',
	'cover-template.jpg'
)
const background = readFile(templatePath).then((input) =>
	sharp(input).resize(1200, 750, { fit: 'fill' }).png().toBuffer()
)
const titleSizeTiers = [
	[24, 82],
	[38, 68],
	[52, 60]
] as const

export async function renderOgImage(title: string, description: string) {
	const loadedFonts = await fonts
	const titleFontSize =
		titleSizeTiers.find(([maxLength]) => title.length <= maxLength)?.[1] ??
		52
	const svg = await satori(
		<div
			style={{
				display: 'flex',
				width: '100%',
				height: '100%'
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					position: 'absolute',
					left: 56,
					bottom: 40,
					width: 680,
					color: '#fff'
				}}
			>
				<div
					style={{
						display: 'block',
						fontFamily: 'Alice',
						fontSize: titleFontSize,
						lineHeight: 1.02,
						lineClamp: 2,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						textShadow: '0 3px 12px rgba(8, 18, 29, 0.72)'
					}}
				>
					{title}
				</div>
				{description && (
					<div
						style={{
							display: 'block',
							fontFamily: 'Nunito',
							fontSize: 29,
							lineHeight: 1.28,
							lineClamp: 3,
							marginTop: 18,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							textShadow: '0 2px 9px rgba(8, 18, 29, 0.78)'
						}}
					>
						{description}
					</div>
				)}
			</div>
		</div>,
		{ width: 1200, height: 630, fonts: loadedFonts }
	)
	return sharp(await background)
		.extract({ left: 0, top: 0, width: 1200, height: 630 })
		.composite([{ input: Buffer.from(svg), left: 0, top: 0 }])
		.jpeg({
			quality: 88,
			progressive: true,
			chromaSubsampling: '4:2:0'
		})
		.toBuffer()
}
