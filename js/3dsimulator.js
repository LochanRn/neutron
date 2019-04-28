var renderer;
// var container;
var camera;
var counter=0;
var callRenderer = function(anglex, angley, anglez){
	webGLRenderer(anglex, angley, anglez);
}

function webGLRenderer(anglx, angly, anglz){
//instantiate webgl once by using a counter variable and it enters the if condition only if counter is 0
if(!counter){
	counter=1;
	//var container = document.getElementById('3dsimulate');
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(300, 250);
	renderer.setClearColor (0xffffff, 1);
	$('#3dsimulate').append(renderer.domElement);
	//container.appendChild( renderer.domElement);
}

//creates geometry and material for cube and passes them as parameters
var geometry = new THREE.BoxGeometry(900, 200, 800, 0, 0, 0);
var material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe:true });
var cube     = new THREE.Mesh(geometry, material);

//creates a scene and camera view
var scene = new THREE.Scene();
camera    = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight, 1,10000);

scene.add(cube);
camera.position.z = 1000;

//this function is called to render the animation and scene and camera is passed as parameters
//cube rotation takes change in angle of x, y and z axes and rotates the cube
function render() {
    requestAnimationFrame(render);
		cube.rotation.x = anglx;
		cube.rotation.y = angly;
		cube.rotation.z = anglz;
    renderer.render(scene, camera);
  }
render();
}

module.exports.callRenderer = callRenderer;

