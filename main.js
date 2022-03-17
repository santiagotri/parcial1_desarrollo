let datos = [];
let url = "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";
let platos = ["Burguers","Tacos","Salads","Desserts","Drinks and Sides"]
let atributosPlatos = ["image","name","description", "price"]
let carrito = []
let titulos_tabla=["Item","Qty.", "Description","Unit price","Amount","Modify"]


getData((value)=>{
    datos =value;
    console.log("datos", datos);
    console.log("datos1", datos[0]);
    inicializar();
    actualizar_menu(platos[0]);
  });

function getData (callback)
{
  fetch(url).then(res=>res.json()).then(res=>
  {
    callback(res);
  });
}

function inicializar(){
    document.getElementById(platos[0]).addEventListener("click", function(){actualizar_menu(platos[0])})
    document.getElementById(platos[1]).addEventListener("click", function(){actualizar_menu(platos[1])})
    document.getElementById(platos[2]).addEventListener("click", function(){actualizar_menu(platos[2])})
    document.getElementById(platos[3]).addEventListener("click", function(){actualizar_menu(platos[3])})
    document.getElementById(platos[4]).addEventListener("click", function(){actualizar_menu(platos[4])})
    document.getElementById(platos[0]+"_movil").addEventListener("click", function(){actualizar_menu(platos[0])})
    document.getElementById(platos[1]+"_movil").addEventListener("click", function(){actualizar_menu(platos[1])})
    document.getElementById(platos[2]+"_movil").addEventListener("click", function(){actualizar_menu(platos[2])})
    document.getElementById(platos[3]+"_movil").addEventListener("click", function(){actualizar_menu(platos[3])})
    document.getElementById(platos[4]+"_movil").addEventListener("click", function(){actualizar_menu(platos[4])})
    document.getElementById("nav-bar-mobile-1").addEventListener("click", desplegarMenuMovil, false);
    document.getElementById("nav-bar-mobile-2").addEventListener("click", desplegarMenuMovil, false);

    document.getElementById("carrito-de-compra").addEventListener("click", desplegarCheckOut, false);
}

function desplegarCheckOut(){
    document.getElementById("boton-confirmacion-cancelar-orden").addEventListener("click", confirmacionCancelarPedido,false)
    document.getElementById("boton-rojo-cancelar-orden").addEventListener("click", ocultarCuadroConfirmaciónOrden, false)

    for (i of platos) document.getElementById(i).setAttribute("class","elemento-navbar nav-item nav-link");
    document.getElementById("nav-bar-mobile-principal").innerHTML = "ORDER DETAIL";
    document.getElementById("titulo-menu-actual").innerHTML = "ORDER DETAIL";

    let rowContenidoPrincipal = document.getElementById("contenido-principal");
    eliminarTodosLosHijos(rowContenidoPrincipal);
    
    let table = document.createElement("table");
    table.setAttribute("class","table table-striped");
    
    let thead = document.createElement("thead");
    var th=[]
    let tr = document.createElement("tr");
    for(let i=titulos_tabla.length-1;i>=0;i--){
        th[i] = document.createElement("th");
        th[i].setAttribute("scope","col");
        th[i].innerHTML = titulos_tabla[i];
    }
    for(let j of th){
        tr.appendChild(j);
    }

    let tbody = document.createElement("tbody");
    tbody.setAttribute("id", "body_tabla");
    table.appendChild(thead);
    thead.appendChild(tr);
    table.appendChild(tbody);
    rowContenidoPrincipal.appendChild(table);

    var llaves = Object.keys(carrito)
    //console.log("tamano llavess" , llaves.length)
    var total_pagar = 0;
    for(let i =0; i< llaves.length;i++){
        producto = carrito[llaves[i]][0];
        //console.log("añadiendo", producto[atributosPlatos[1]])
        cantidadProducto =  carrito[llaves[i]][1];
        total_pagar += producto[atributosPlatos[3]]*cantidadProducto;
        crearElementoEnTabla(i+1,cantidadProducto, producto[atributosPlatos[1]], producto[atributosPlatos[3]],producto[atributosPlatos[3]]*cantidadProducto, producto)
    }

    let row2 = document.createElement("div");
    row2.setAttribute("class","row");

    let col1 = document.createElement("div")
    col1.setAttribute("class","col-6")
    col1.setAttribute("style", "text-align:left;")

    let col2 = document.createElement("div")
    col2.setAttribute("class","col-6")
    col2.setAttribute("style", "text-align:right;")

    let cancel = document.createElement("button");
    cancel.setAttribute("class","boton-rojo");
    cancel.innerHTML="Cancel"
    cancel.addEventListener("click", mostrarCuadroConfirmaciónOrden, false);
    col2.appendChild(cancel);

    let confirmOrder = document.createElement("button");
    confirmOrder.setAttribute("class","boton-verde");
    confirmOrder.innerHTML="Confirm Order"
    confirmOrder.addEventListener("click", confirmacionOrden, false);
    col2.appendChild(confirmOrder);

    let total_pagar_boton = document.createElement("p")
    total_pagar_boton.innerHTML = "Total: $" + total_pagar;
    total_pagar_boton.setAttribute("class","total-pagar");
    col1.appendChild(total_pagar_boton);
    row2.appendChild(col1);
    row2.appendChild(col2)

    rowContenidoPrincipal.appendChild(row2)
}

function confirmacionOrden(){
    console.log("Order confirmed", carrito);
    carrito = [];
    actualizarIndicadorItemsCarro();
    actualizar_menu(platos[0]);
}

function confirmacionCancelarPedido(){
    ocultarCuadroConfirmaciónOrden();
    carrito = [];
    actualizarIndicadorItemsCarro();
    desplegarCheckOut();
}

function crearElementoEnTabla(Item,Qty, Description,Unit_price,Amount,producto){

    const bodytabla = document.getElementById('body_tabla');
    let tr = document.createElement("tr");

    let td=[];

    for (let i = 0;i<6;i++){
        td[i] = document.createElement("td");
    }

    let row = document.createElement("div")
    row.setAttribute("class","row");

    let col1 = document.createElement("div");
    col1.setAttribute("class","col-6")

    let botonAumentar = document.createElement("button");
    botonAumentar.innerHTML = "+";
    botonAumentar.setAttribute("class","boton-amarillo")
    botonAumentar.addEventListener("click", function(){anadirPlatoACarro(producto);desplegarCheckOut();},false)

    let col2 = document.createElement("div");
    col2.setAttribute("class","col-6")

    let botonDisminuir = document.createElement("button");
    botonDisminuir.innerHTML = "-";
    botonDisminuir.setAttribute("class","boton-amarillo")
    
    botonDisminuir.addEventListener("click", function(){eliminarPlatoDeCarro(Description);desplegarCheckOut();},false)
    row.appendChild(col1);
    row.appendChild(col2);
    col1.appendChild(botonAumentar);
    col2.appendChild(botonDisminuir);
    td[0].appendChild(document.createTextNode(Item));
    td[1].appendChild(document.createTextNode(Qty));
    td[2].appendChild(document.createTextNode(Description));
    td[3].appendChild(document.createTextNode(Unit_price));
    td[4].appendChild(document.createTextNode(Amount));
    td[5].appendChild(row);

    for(let j of td){
        tr.appendChild(j);
    }
    bodytabla.appendChild(tr);

}

function desplegarMenuMovil(){

}

function actualizar_menu(plato){
    for (i of platos) document.getElementById(i).setAttribute("class","elemento-navbar nav-item nav-link");
    document.getElementById(plato).setAttribute("class","elemento-navbar nav-item nav-link active");
    document.getElementById("nav-bar-mobile-principal").innerHTML = plato;
    document.getElementById("titulo-menu-actual").innerHTML = plato;

    let rowContenidoPrincipal = document.getElementById("contenido-principal");
    eliminarTodosLosHijos(rowContenidoPrincipal);
    for(let i =0; i< datos.length;i++){
       if(datos[i]["name"]==plato){
            for(j of datos[i]["products"]){
                desplegar_plato(j);
            }
        }
    }
}

function desplegar_plato(plato){
    let rowContenidoPrincipal = document.getElementById("contenido-principal");
    rowContenidoPrincipal.setAttribute("class","row")
    let col = document.createElement("div")
    col.setAttribute("class","col-lg-3 col-12");

    let cuadroProducto = document.createElement("div");
    cuadroProducto.setAttribute("class", "cuadro-producto");
    cuadroProducto.setAttribute("style", "box-sizing:border-box; text-align:center; margin: 1px;border: 1px solid rgba(0, 0, 0, 0.11);");

    let imagenProducto = document.createElement("div");
    cuadroProducto.setAttribute("class", "imagen-producto");

    let img = document.createElement("img");
    img.setAttribute("class","img-fluid");
    img.setAttribute("src", plato[atributosPlatos[0]]);

    let textoProducto = document.createElement("div");
    textoProducto.setAttribute("class", "texto-producto");

    let h3 = document.createElement("h3");
    h3.innerHTML = plato[atributosPlatos[1]];

    let pDescripcion = document.createElement("p");
    pDescripcion.innerHTML = plato[atributosPlatos[2]];

    let pPrecio = document.createElement("p");
    pPrecio.setAttribute("class", "precio-producto");
    pPrecio.innerHTML = plato[atributosPlatos[3]];

    let divBoton = document.createElement("div");
    divBoton.setAttribute("class","div-boton-añadir-carrito")

    let boton = document.createElement("button");
    boton.setAttribute("class","boton-añadir-carrito");
    boton.innerHTML = "Add to cart";
    boton.addEventListener("click", function(){anadirPlatoACarro(plato)})


    rowContenidoPrincipal.appendChild(col);
    col.appendChild(cuadroProducto);
    cuadroProducto.appendChild(imagenProducto);
    imagenProducto.appendChild(img);
    cuadroProducto.appendChild(textoProducto);
    textoProducto.appendChild(h3);
    textoProducto.appendChild(pDescripcion);
    textoProducto.appendChild(pPrecio);
    cuadroProducto.appendChild(divBoton);
    divBoton.appendChild(boton);
}

function anadirPlatoACarro(plato){
    if(carrito[plato[atributosPlatos[1]]]){
        carrito[plato[atributosPlatos[1]]][1]++;
    }else{
        carrito[plato[atributosPlatos[1]]] = [plato, 1]
    }
    console.log("carro actualizado", carrito)
    actualizarIndicadorItemsCarro()
}

function actualizarIndicadorItemsCarro(){
    var llaves = Object.keys(carrito)
   var p = document.getElementById("cantidad-de-productos")
    if(llaves.length==0){
        p.setAttribute("style","display:none;")
    }else{
        p.removeAttribute("style")
        var articulos = 0;
        for(let i =0; i< llaves.length;i++){
            articulos += carrito[llaves[i]][1];
        }
        if(articulos!=1)p.innerHTML = articulos + " items";
        else {
            p.innerHTML = articulos + " item"
        }

    }
}

function eliminarPlatoDeCarro(nombrePlato){
    if(carrito[nombrePlato][1]>1){
        carrito[nombrePlato][1]--;
    }else{
        delete carrito[nombrePlato];
    }
    console.log("carro actualizado", carrito)
    actualizarIndicadorItemsCarro()
}

function eliminarTodosLosHijos(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function ocultarCuadroConfirmaciónOrden(){
    cuadro = document.getElementById("cuadro-confirmacion-orden")
    cuadro.setAttribute("style","display:none;")
}
function mostrarCuadroConfirmaciónOrden(){document.getElementById("cuadro-confirmacion-orden").setAttribute("style","")}