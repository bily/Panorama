var texture = "stehagskyrka";
var camera, scene, mesh, renderer;
var btn1,btn2, btn3, btn4, btn5, btn6, btn7;
var btns = [btn1, btn2, btn3, btn4, btn5, btn6, btn7];
var btnIds = ['btn1','btn2','btn3','btn4','btn5','btn6','btn7'];

var fov = 70,
texture_placeholder,
isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;

if (hasWebGLSupport()){
	registerUI();
	initPanorama();	
} else
{
	alert('No WebGL support');
}

function registerUI(){

	$.each(btnIds, function(i, value) { 

		// registering mouse click handlers
		btns[i] = document.getElementById(value);
		btns[i].onclick = onBtnClick;

		// registering popup info
		$(document).ready(function() {
		    $("a[rel=popover"+(i+1)+"]")
		        .popover({
		            offset: 10,
		            placement:'bottom'
		    })
		        .click(function(e) {
		            e.preventDefault()
		        })
		});
	});

}

function initPanorama()
{
	var container = document.getElementById( 'panorama' );

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

function applyTexture(textureName) {

	removeOldPanoramaObjects();

	var texturePath = 'textures/' + textureName + '.jpg';
	var sphere = new THREE.SphereGeometry( 500, 60, 40 );
	var material =  new THREE.MeshBasicMaterial( { map: ThreeUtils.loadTexture( texturePath, null, null, onTextureProgress ) } )

	mesh = new THREE.Mesh( sphere, material);
	mesh.scale.x = -1;
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );
}

function removeOldPanoramaObjects(){

	if (mesh != null){
		scene.remove(mesh);
	}

	if(renderer != null)
	{
		container.removeChild(renderer.domElement);
	}
}


function onTextureProgress(value){

}

function onBtnClick(event){

	removeMap();
	event.preventDefault();
	var roomTexture;

	$.each(btns, function(i, value) { 
		if (event.currentTarget == value){
			roomTexture = texture + (i+1);
		}
	});

	applyTexture(roomTexture);
	animate();

	var btnId = event.currentTarget.getAttribute('id');
	setActiveButton(btnId);
}

function setActiveButton(buttonId)
{
	$.each(btnIds, function(i, value) { 
		$('#' + value).parent().get(0).className = "nothing";
	});

	var parent = $('#' + buttonId).parent().get(0);
    parent.className = "active";
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