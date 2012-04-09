var texture = "stehagskyrka";

var camera, scene, mesh, renderer;
var btn1, btn2, btn3, btn4, btn5, btn6, btn7;

var fov = 70,
texture_placeholder,
isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;

alert(hasWebGLSupport());

if (hasWebGLSupport()){
	registerButtons();
	initPanorama();	
} else
{
	alert('No support');
}

//Feature test WebGL
function hasWebGLSupport() {
	try{
		return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
	} catch( e ){
		return false;
	}
  };

function registerButtons(){

	btn1 = document.getElementById( 'btn1' );
	btn2 = document.getElementById( 'btn2' );
	btn3 = document.getElementById( 'btn3' );
	btn4 = document.getElementById( 'btn4' );
	btn5 = document.getElementById( 'btn5' );
	btn6 = document.getElementById( 'btn6' );
	btn7 = document.getElementById( 'btn7' );

	btn1.onclick = onBtnClick;
	btn2.onclick = onBtnClick;
	btn3.onclick = onBtnClick;
	btn4.onclick = onBtnClick;
	btn5.onclick = onBtnClick;
	btn6.onclick = onBtnClick;
	btn7.onclick = onBtnClick;
}

function initPanorama()
{
	var container = document.getElementById( 'container' );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1100 );
	camera.target = new THREE.Vector3( 0, 0, 0 );
	scene.add( camera );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);	

}

function applyTexture(texture) {

	if (mesh != null){
		scene.remove(mesh);
	}

	if(renderer != null)
	{
		container.removeChild(renderer.domElement);
	}

	mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 40 ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/' + texture + '.jpg' ) } ) );
	mesh.scale.x = -1;
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

}

function onBtnClick(event){

	var roomTexture;
	switch(event.currentTarget)
	{
		case btn1:
			roomTexture = texture + 1;
			break;
		case btn2:
			roomTexture = texture + 3;
			break;
		case btn3:
			roomTexture = texture + 4;
			break;
		case btn4:
			roomTexture = texture + 8;
			break;
		case btn5:
			roomTexture = texture + 6;
			break;
		case btn6:
			roomTexture = texture + 7;
			break;
		case btn7:
			roomTexture = texture + 2;
			break;

	}
		applyTexture(roomTexture);
		animate();

}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;

}

function onDocumentMouseMove( event ) {

	if ( isUserInteracting ) {

		lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

	}
}

function onDocumentMouseUp( event ) {

	isUserInteracting = false;

}

function onDocumentMouseWheel( event ) {

	// WebKit

	if ( event.wheelDeltaY ) {

		fov -= event.wheelDeltaY * 0.05;

	// Opera / Explorer 9

	} else if ( event.wheelDelta ) {

		fov -= event.wheelDelta * 0.05;

	// Firefox

	} else if ( event.detail ) {

		fov += event.detail * 1.0;

	}

	camera.projectionMatrix = THREE.Matrix4.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
	render();

}

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = ( 90 - lat ) * Math.PI / 180;
	theta = lon * Math.PI / 180;

	camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
	camera.target.y = 500 * Math.cos( phi );
	camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

	camera.lookAt( camera.target );

	/*
	// distortion
	camera.position.x = - camera.target.x;
	camera.position.y = - camera.target.y;
	camera.position.z = - camera.target.z;
	*/

	renderer.render( scene, camera );

}