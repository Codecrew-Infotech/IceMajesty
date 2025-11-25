window.onload = function() {
    var temp = document.getElementById("snow");

    if (!temp) {
        return;
    }

    document.body.prepend(temp);
    var flakes = [];
    var types = ["❄", "❅", "❆"];
    for (var i = 0, len = 80; i < len; i++) {
        flakes.push("<i>" + types[i % types.length] + "</i>");
    }
    temp.innerHTML = flakes.join("");
};