import { Counter } from "../components/Counter.tsx";

export function HomePage() {
    return (
        <div style={{ padding: 24, display: "flex" , flexDirection: "column" ,alignItems: "center" ,
            justifyContent: "center", width: "100vw", margin: "0 auto",height: '100vh' }}>
            <h1>This is my counter</h1>
            <div style={{width: '200px'}}>
            <Counter maxValue={10} />
            </div>
        </div>
    );
}
