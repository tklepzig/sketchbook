import * as React from "react";
import Canvas, { DrawMode } from "./Canvas";
import Splash from "./Splash";

export default class Start extends React.Component {
    public render() {
        return ([<Splash key="splash" />,
        <Canvas drawMode={DrawMode.Above} color="red" lineWidth={4} key="canvas" />]);
    }
}
