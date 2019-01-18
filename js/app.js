var min=2; //variable de los minutos de juego
var seg=0; //variable de los segundos de juego
var tiempo=0; //variable del intervalo de tiempo
var titulo=0; //variable del intervalo de cambio de color en el título
var color=0; //indicador de cambio de color del titulo
var fila=0; //contador de filas cargadas en el tablero
var cargarTablero=0; //Intervalo para cargar el tablero
var matcher=0;  //Intervalo para controlar el juego
var completarDulces=0; //Intervalo para el setInterval de rellenar el tablero
var contador=0;
var dulcesFaltantes=0; //variable para determinar los dulces faltantes en el tablero
var dulcesActivos=0; //variable que cuenta cuantos dulces tiene el tablero
var bnewd=0; //indicador de que se ingresaron nuevos elementos al tablero
var movimientos=0; //variable que llevar el contador de movimientos de dulces en el tablero
var puntaje=0; //variable que lleva el puntaje del juego
var mf=0; //indicador de que hubo match de dulces en la fila
var mc=0;  //indicador de que hubo match de dulces en la columna
var reinicio=0;

$(".btn-reinicio").click(function(){
  if (reinicio==1){
    $('.titulo-over').hide();
    $(".panel-score").css("width","25%");
    $(".panel-tablero").show();
    $(".time").show();
    $(this).html("Reiniciar");

    limpiarTablero();
    movimientos=0;
    puntaje=0;
    $("#score-text").html(puntaje);
    $("#movimientos-text").html(movimientos);
  }else reinicio=1;
  clearInterval(tiempo);
  clearInterval(titulo);
  clearInterval(cargarTablero);
  clearInterval(completarDulces);
  min=2;  //2
  seg=0;  //0
  cargarTablero=setInterval(function(){cargarDulces()},400);
  titulo=setInterval(function(){cambiaColor()},800);
  tiempo=setInterval(function(){cronometro()},1000);
})
//Funcion para limpiar el tablero cuando se da botón reiniciar
function limpiarTablero()
{
  for(var j=1;j<8;j++)
  {
    $(".col-"+j).children("img").detach();
  }
}
//Función que carga el tablero de dulces
function cargarDulces()
{
  fila=fila+1
  var numero=0;
  var imagen=0;
//  $(".elemento").draggable({ disabled: true });

  if(fila<8)
  {
    for(var j=1;j<8;j++)
    {
      if($(".col-"+j).children("img:nth-child("+fila+")").html()==null)
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
      }
    }
  }
  if(fila==8)
  {
    clearInterval(cargarTablero);   //desactivar funcion cargaDulces()
    clearInterval(matcher);
    matcher=setInterval(function(){borrarDulces()},150)  //activar funcion de eliminar dulces
  }
}

//Función que repone los dulces borrados
function reponerDulces()
{
  var dulcesRepuestos=0;
//  $(".elemento").draggable({ disabled: true });
  $("div[class^='col']").css("justify-content","flex-start");
  clearInterval(matcher);
  for(var j=1;j<8;j++)
  {
    dulcesFaltantes = 7 - ($(".col-"+j).children().length);
    if (dulcesFaltantes!=0)
    {
      puntaje=puntaje+(dulcesFaltantes*25);
      $('#score-text').html(puntaje);
      for (var i=0; i < dulcesFaltantes; i++){
        index = Math.floor(Math.random() * 4) + 1;
      $('.col-'+j).prepend( "<img src='image/"+index+".png' class='elemento'/>" );

      }
      dulcesRepuestos=1;
    }
  }
  if (dulcesRepuestos==1)
  {
    mf=0;
    mc=0;
    clearInterval(completarDulces);
    clearInterval(matcher);
    matcher=setInterval(function(){borrarDulces()},150)
  }
}

//Función para borrar dulces que hacen match
function borrarDulces(){
  mf=0;
  mf=matchFila();
  mc=matchColumna();
  dulcesActivos=0;

  if (mf==1 || mc==1){
    bnewd=1;
//    $(".elemento").draggable({ disabled: true });
    $("div[class^='col']").css("justify-content","flex-end");
    $(".borrar-item").hide("pulsate",500,function(){
      $(".borrar-item").remove("img")
    })
  }
  for(var j=1;j<8;j++)
  {
    dulcesActivos=dulcesActivos+$(".col-"+j).children().length;
  }
  dulcesFaltantes=49-dulcesActivos;
  if (dulcesActivos!=49){
    clearInterval(matcher);
    clearInterval(completarDulces);
    completarDulces=setInterval(function(){reponerDulces()},150)
    bnewd=0;
  }

  $( ".elemento" ).draggable({
    revert: true,
    revertDuration: 0,
    disabled: false,
    containment: ".panel-tablero",
    snap: ".elemento",
    snapTolerance: 40,
    snapMode: "inner",
    start: function(event, ui){
      movimientos=movimientos+1;
      $('#movimientos-text').html(movimientos)
    }
  });

  $(".elemento").droppable({
    drop: function (event, ui) {
      var dropped = ui.draggable;
      var droppedOn = this;
      espera=0;
      do{
        espera=dropped.swap($(droppedOn));
      }while(espera==0)
      mf=matchFila()  //funcion busqueda dulces horizontal
      mc=matchColumna()    //funcion buscar dulces vertical
      if(mf==0 && mc==0)
      {
        dropped.swap($(droppedOn));
      }
      if(mf==1 || mf==1)
      {
        clearInterval(completarDulces);
        clearInterval(matcher);   //desactivar funcion desplazamiento()
        matcher=setInterval(function(){borrarDulces()},150)  //activar funcion eliminarhorver
      }
    },
  });
}
//Funcion para intercambiar los dulces
jQuery.fn.swap = function(b)
{
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};

//FUNCIÓN	PARA VALIDAR MATCH POR FILA
function matchFila(){
  var indfila=0;
  for (var j=1;j<6;j++){
      for (var i=0; i < 8; i++){
        var dulce1=$(".col-"+j).children("img:nth-last-child("+i+")").attr("src");
        var dulce2=$(".col-"+(j+1)).children("img:nth-last-child("+i+")").attr("src");
        var dulce3=$(".col-"+(j+2)).children("img:nth-last-child("+i+")").attr("src");
        if ((dulce1==dulce2)&&(dulce2==dulce3)){
          // Aqui se cambia el nombre de la clase para identificar los dulces a borrar
          $(".col-"+j).children("img:nth-last-child("+(i)+")").attr("class","elemento borrar-item");
          $(".col-"+(j+1)).children("img:nth-last-child("+(i)+")").attr("class","elemento borrar-item");
          $(".col-"+(j+2)).children("img:nth-last-child("+(i)+")").attr("class","elemento borrar-item");
          indfila=1;
        }
      }; //Fin ciclo i
  } //Fin ciclo j
  return indfila;
}
//FUNCIÓN PARA VALIDAR MATCH POR COLUMNA
function matchColumna(){
  var indcol=0;
  for (var j=1; j < 8; j++){
    for (var i=0; i < 6; i++){
      var dulce1=$(".col-"+j).children("img:nth-child("+i+")").attr("src")
      var dulce2=$(".col-"+j).children("img:nth-child("+(i+1)+")").attr("src")
      var dulce3=$(".col-"+j).children("img:nth-child("+(i+2)+")").attr("src")

      if ((dulce1==dulce2)&&(dulce2==dulce3)){
        // Aqui se cambia el nombre de la clase para identificar los dulces a borrar
        $(".col-"+j).children("img:nth-child("+(i)+")").attr("class","elemento borrar-item");
        $(".col-"+j).children("img:nth-child("+(i+1)+")").attr("class","elemento borrar-item");
        $(".col-"+j).children("img:nth-child("+(i+2)+")").attr("class","elemento borrar-item");
        indcol=1;
      }
    } //Fin ciclo i
  }
  return indcol;
}
//Función que permite realizar el cambio de color del titulo cada cierto tiempo
  function cambiaColor() {
    if (color==0){
      $('.main-container .main-titulo').css("color","#FFFFFF");
      color=1;
    }else {
      $('.main-container .main-titulo').css("color","#DCFF0E");
      color=0;
    }
  }
//Función que controla el tiempo de juego --------------------------------------
function cronometro(){
  if (seg!=0){
    seg--;
  }
  if (seg==0){
    if (min==0){
      clearInterval(cronometro);
      $(".panel-tablero").hide("drop","slow",terminar);
      $(".time").hide();
    }
    seg=59;
    min--;
  }
  $("#timer").html('0'+min+':'+seg);
}
//Función terminar JUEGO
function terminar(){
  $(".panel-score").animate({
    width: '100%'},
    2000
  );
  $('.panel-score').prepend("<h1 class=titulo-over >Juego terminado</h1>" );
}
