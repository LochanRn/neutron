var compass = function(dir) {
	// console.log(dir);
	dir -= 30;
	var compassDisc = document.getElementById("Needle");
	compassDisc.style.webkitTransform = "rotate("+ (dir) +"deg)";
	compassDisc.style.transform = "rotate("+ (dir) +"deg)";
}

module.exports.compass = compass;
