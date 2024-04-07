const possibleColours = [
    new Vec3(  0, 0.5,   1),  
    new Vec3(  0,   1, 0.5),
    new Vec3(  1, 0.5,   0),
    new Vec3(  1,   0,   0),
    new Vec3(0.5,   0,   1),
];
let nextColour = Math.floor(Math.random()*possibleColours.length);
function ColourToCSS(c) {
    function Hex(n) {
        return Math.round(255 * n).toString();
    }
    return "rgb(" + Hex(c.x) + "," + Hex(c.y) + "," + Hex(c.z) + ")";
}

function GetNextIconCol() {
    let r =  {
        str: ColourToCSS(possibleColours[nextColour]),
        r: possibleColours[nextColour].x.toString(),
        g: possibleColours[nextColour].y.toString(),
        b: possibleColours[nextColour].z.toString()
    };
    nextColour++;
    nextColour = nextColour % possibleColours.length; // loop back round to start of list
    return r;
}