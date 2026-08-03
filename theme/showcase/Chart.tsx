import './chart.css'

export type ChartItem = {
    label: string
    detail?: string
    value: number
    display?: string
    secondaryValue?: number
    secondaryDisplay?: string
    highlight?: boolean
}

type ChartProps = {
    items: ChartItem[]
    unit?: string
    secondaryUnit?: string
    series?: [string, string]
}

function formatValue(value: number, unit?: string) {
    return `${value.toLocaleString()}${unit ? ` ${unit}` : ''}`
}

export function Chart({
    items,
    unit,
    secondaryUnit,
    series
}: ChartProps) {
    const maximum = Math.max(
        1,
        ...items.flatMap(({ value, secondaryValue }) =>
            secondaryUnit ? [value] : [value, secondaryValue ?? 0]
        )
    )
    const secondaryMaximum = secondaryUnit
        ? Math.max(1, ...items.map(({ secondaryValue }) => secondaryValue ?? 0))
        : maximum

    return (
        <>
            {series && (
                <div className="showcase-chart-legend">
                    <span><i />{series[0]}</span>
                    <span><i className="is-secondary" />{series[1]}</span>
                </div>
            )}
            <ol className="showcase-chart">
                {items.map((item) => (
                    <li key={`${item.label}-${item.detail ?? ''}`}>
                        <span className={item.highlight ? 'is-highlighted' : undefined}>
                            {item.label}
                            {item.detail && <sup>{item.detail}</sup>}
                        </span>
                        <div className="showcase-chart-bars" aria-hidden="true">
                            <div className="showcase-chart-bar">
                                <i
                                    className={item.highlight ? 'is-highlighted' : undefined}
                                    style={{ width: `${(item.value / maximum) * 100}%` }}
                                />
                            </div>
                            {item.secondaryValue !== undefined && (
                                <div className="showcase-chart-bar">
                                    <i
                                        className={`is-secondary${item.highlight ? ' is-highlighted' : ''}`}
                                        style={{ width: `${(item.secondaryValue / secondaryMaximum) * 100}%` }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="showcase-chart-values">
                            <strong>{item.display ?? formatValue(item.value, unit)}</strong>
                            {item.secondaryValue !== undefined && (
                                <strong>
                                    {item.secondaryDisplay ?? formatValue(
                                        item.secondaryValue,
                                        secondaryUnit ?? unit
                                    )}
                                </strong>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </>
    )
}
