export default `
varying vec3 fragCoord;

void main() {
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);

    fragCoord = position;
    gl_Position = projectionMatrix * modelViewPosition; 
}
`