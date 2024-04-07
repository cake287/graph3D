function hideElement(e) {
    let icon = e.target;
    let row = icon.parentNode.parentNode.parentNode;
    // console.log(row);

    function changeAlpha(newAlpha) {
        let bg = window.getComputedStyle(icon).backgroundColor.toString();
        bg = bg.substring(0, bg.length - 1); // remove bracket 

        // if alpha is 1, getComputingStyle().backgroundColor will return "rgb(.., .., ..)"
        // if bg contains an "a", it has returned "rgba(.., .., .., ..)"
        // in this case, remove everything after the last comma
        if (bg.includes("a")) 
            bg = bg.substring(0, bg.lastIndexOf(",") + 1);
        else 
            bg += ","

        bg += newAlpha.toString() + ")";
        icon.style.backgroundColor = bg;
    }

    if (row.getAttribute("data-visible") == "true") {
        changeAlpha(0);
        row.setAttribute("data-visible", "false");
    }
    else {
        changeAlpha(1);
        row.setAttribute("data-visible", "true");
    }
}