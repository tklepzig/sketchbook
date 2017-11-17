import * as React from "react";
import Canvas from "./Canvas";
import Splash from "./Splash";

export default class Start extends React.Component {
    public render() {
        return ([<Splash key="splash" />, <Canvas key="canvas" />]);
    }
}
