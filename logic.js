//challenge 1 wiill be how to get the user input because they are going randomly into any of the 9 boxes
//my thought is like make an array and add the modified id of the box to an array and then make pop the first added element if 4th element comes and update the array
const bigbox = document.getElementById('bigbox');
const state = {
    x: [],
    o: []
  };
  let move = false;
  let move_interval;
function moves() {
    // Remove the infinite loop - this would freeze the browser
   

   move_interval = setInterval(()=>{
        if (move) {
            clearInterval(b);
            return;
            
        }
        state.x.length = 0;
state.o.length = 0;

        for (let i = 1; i <= 9; i++) {
            const img = bigbox.querySelector(`#box${i}`).querySelector("img");
            
            // console.log(img);
        
            if (img && img.src.includes("x.png")) {
                if (state.x.length>3) {
                    state.x.pop()
                }
                    
                state.x.unshift(i)
            }
            else if (img && img.src.includes("o.png")) {
                if (state.o.length>3) {
                    state.o.pop()
                }
                state.o.unshift(i)
            }
            checkWinner();
        }
        
    },500)
   
}
// function currentPlayer() {
  
//     setInterval(()=>{
//         let Player = 'x';
//         Player = Player === 'x' ? 'o' : 'x';
//     },2000)
// }
 // toggle between x and o

// currentPlayer()

const winmap = [
    [1,4,7],[2,5,8],[3,6,9], // columns
    [1,2,3],[4,5,6],[7,8,9], // rows
    [1,5,9],[3,5,7]          // diagonals
  ];
  
  function checkWinner() {
    for (const combo of winmap) {
      if (combo.every(i => state.x.includes(i))) {
        popup_message('Player - X wins ! refresh the page to play again');
        stopgame();
        return;
      }
      if (combo.every(i => state.o.includes(i))) {
        popup_message('Player - O wins ! refresh the page to play again');
        stopgame();
        return;
      }
    }
  }
  

  function stopgame() {
move = true;
game = true;
remove = true;
    
  }
  function reset() {
move = false;
game = false;
remove = false;
clearInterval(remove_img_interval)
clearInterval(intervalId_o)
clearInterval(intervalId_x)
clearInterval(move_interval)
  clearTimeout(popup_timeout)  
  }
  function newgame() {
    moves();
    gameLoop(); 
    
  }






