$(() => {
  // Select table containing the battleground
  const battleground = $('#battleground');
  var testArr = new Array;
  

  for(var i = 0; i<10; i++){
    testArr[i]=new Object();
    for(var j = 0; j<10; j++){
      testArr[i][j]= '0';
      console.log(testArr[i][j]);
    }
  }

  // Build 10 x 10 grid for battleground
  for (let row = 0; row < 10; row++) {
    // Create table row
    const tr = $('<tr>');
    for (let column = 0; column < 10; column++) {
      // Create table cell with CSS class `water`. Note that we use
      // HTML data attributes  to store the coordinates of each cell
      // (see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). 
      // That makes it much easier to find cells based on coordinates later.
      $('<td>').addClass('water').attr('data-r', row).attr('data-c', column).appendTo(tr);
    }

    // Add table row to battleground table
    tr.appendTo(battleground);
  }

  $('#generate').click(() => {
    refillCells();
    // Here you have to add your code for building a random battleground.
    

    placeDestroyer();
    placeSubmarineAndCruiser();
    placeSubmarineAndCruiser();
    placeBattleship();
    placeCarrier();
    

    /*// Tip: The next line of code demonstrates how you can select a table cell
    // using coordinates, remove CSS classes and add CSS classes. 
    $('td[data-r="1"][data-c="1"]').removeClass('water').addClass('ship');
    $('td[data-r="2"][data-c="1"]').removeClass('water').addClass('ship');
    $('td[data-r="3"][data-c="1"]').removeClass('water').addClass('ship');*/
  });


function getRandom(min, max) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function checkSourrounding(row, col, direction, length){
  if(direction==0){
    for(var i = 0; i <length+1; i++){
      if(col<=9){
        if(testArr[row][col+i]=='1'){
          return false;
        }
      }
      
    }
  }/*else{
    for(var j = 0; j <length+1; j++){
      if(row<=9){
        if(testArr[row+j][col] == '1'){
          return false;
        }
      }
    }
  }*/
  return true;
}
function refillCells(){
  for(var i = 0; i < 10; i++){
    for(var j = 0; j < 10; j++){
      $(`td[data-r=${i}][data-c=${j}]`).removeClass('ship').addClass('water');
    }
  }
}

function placeDestroyer(){
  do{
    var row = getRandom(0, 10);
    var col = getRandom(0, 10);
    //Direction 0 = horizontal
    //Direction 0> = vertical
    var direction = getRandom(0, 2);
  
    if(row == 9  && col == 9){
      
    }else if(row == 9  && direction == 1){
      direction = 0;
      break;
    }else if(col == 9 && direction == 0){
      direction = 1;
      break;
    }
  }while(1);
  

  if(direction == 0){ //Horizontal
    testArr[row][col] = '1';
    testArr[row][col+1] = '1';
    $(`td[data-r=${row}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row}][data-c=${col+1}]`).removeClass('water').addClass('ship');
  }else{//Vertical
    testArr[row][col] = '1';
    testArr[row+1][col] = '1';
    $(`td[data-r=${row}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row+1}][data-c=${col}]`).removeClass('water').addClass('ship');
  }
  
}

function placeSubmarineAndCruiser(){
  do{

  var row = getRandom(0, 10);
  var col = getRandom(0, 10);
  //Direction 0 = horizontal
  //Direction 0> = vertical
  var direction = getRandom(0, 2);

  if(row >= 8  && col == 8  ){
    
  }else if(row >= 8  && direction == 1){
    direction = 0;
    
  }else if(col >= 8 && direction == 0){
    direction = 1;
    
  }
  
  if(checkSourrounding(row, col, direction, 3)){break;}
  }while(1);

  if(direction == 0){ //Horizontal
    
    $(`td[data-r=${row}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row}][data-c=${col+1}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row}][data-c=${col+2}]`).removeClass('water').addClass('ship');
  }else{//Vertical
    
    $(`td[data-r=${row}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row+1}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row+2}][data-c=${col}]`).removeClass('water').addClass('ship');
  }
}

function placeBattleship(){
  do{
      var row = getRandom(0, 10);
      var col = getRandom(0, 10);
      //Direction 0 = horizontal
      //Direction 0> = vertical
      var direction = getRandom(0, 2);
    
      if(row >= 7  && col == 7  ){

      }else if(row >= 7  && direction == 1){
        direction = 0;
      }else if(col >= 7 && direction == 0){
        direction = 1;
      }
      
      if(checkSourrounding(row, col, direction, 4)){break;}
  }while(1);

      if(direction == 0){
        $(`td[data-r=${row}][data-c=${col}]`).removeClass('water').addClass('ship');
        $(`td[data-r=${row}][data-c=${col+1}]`).removeClass('water').addClass('ship');
        $(`td[data-r=${row}][data-c=${col+2}]`).removeClass('water').addClass('ship');
        $(`td[data-r=${row}][data-c=${col+3}]`).removeClass('water').addClass('ship');
      }else{
        $(`td[data-r=${row}][data-c=${col}]`).removeClass('water').addClass('ship');
        $(`td[data-r=${row+1}][data-c=${col}]`).removeClass('water').addClass('ship');
        $(`td[data-r=${row+2}][data-c=${col}]`).removeClass('water').addClass('ship');
        $(`td[data-r=${row+3}][data-c=${col}]`).removeClass('water').addClass('ship');
      }

}

function placeCarrier(){
  do{
    var row = getRandom(0, 10);
    var col = getRandom(0, 10);
    //Direction 0 = horizontal
    //Direction 0> = vertical
    var direction = getRandom(0, 2);
  
    if(row >= 6  && col == 6  ){

    }else if(row >= 6  && direction == 1){
      direction = 0;
    }else if(col >= 6 && direction == 0){
      direction = 1;
    }
    
    if(checkSourrounding(row, col, direction, 4)){break;}
  }while(1);

  if(direction == 0){
    $(`td[data-r=${row}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row}][data-c=${col+1}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row}][data-c=${col+2}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row}][data-c=${col+3}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row}][data-c=${col+4}]`).removeClass('water').addClass('ship');
  }else{
    $(`td[data-r=${row}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row+1}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row+2}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row+3}][data-c=${col}]`).removeClass('water').addClass('ship');
    $(`td[data-r=${row+4}][data-c=${col}]`).removeClass('water').addClass('ship');
  }
}
});