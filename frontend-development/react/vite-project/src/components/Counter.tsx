import { useState } from "react";

type CounterProps = {
    maxValue: number;
};

export function Counter({ maxValue }: CounterProps) {
    const [value, setValue] = useState(0);

    const inc = () => setValue((v) => Math.min(v + 1, maxValue));
    const reset = () => setValue(0);

    return (
        <div style={{ display: "grid", gap: 8 }}>
            <div>Value: {value}</div>
            <button onClick={inc} disabled={value >= maxValue}>
                +
            </button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
