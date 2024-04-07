function panRotButtonListeners() {
    let panButton = document.getElementById("vpPan");
    let rotButton = document.getElementById("vpRot");

    function setOnStyle(button) {
        console.log(button.style);
        button.style.borderColor = "hsl(0, 0%, 65%)" 
        //button.style.backgroundColor = null; // reset to stylesheet defined style
        //button.style.color = null;
    }

    function setOffStyle(button) {
        //button.style.color = "hsl(0, 0%, 50%)";
        //button.style.backgroundColor = "hsl(0, 0%, 90%)";
    }

    function setRotMain() {
        rotMainMove = true;
        setOnStyle(rotButton);
        setOffStyle(panButton);
    }

    function setPanMain() {
        rotMainMove = true;
        setOnStyle(panButton);
        setOffStyle(rotButton);
    }

    rotButton.addEventListener("click", function() { setRotMain(); });
    panButton.addEventListener("click", function() { setPanMain(); });

    setRotMain();
}