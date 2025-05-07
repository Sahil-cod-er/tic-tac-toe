const time_x = document.getElementById("timer-x");
const time_o = document.getElementById("timer-o");
let intervalId_x;
let intervalId_o;
let game = false;
let remove = false;
var popup = document.getElementById("popup-background");
const X_user = {
//   pieces: () => {
//     const pieces_remaining = document.getElementById("pieces-x");
//     if (!pieces_remaining) {
//       popup("X-You are out of moves now !");
//     }
//   },
//   pieces: () => {
//     const pieces_remaining = document.getElementById("pieces-o");
//     if (!pieces_remaining) {
//       popup("O-You are out of moves now !");
//     }
//   },
  timer: function Timer() {
    let counter = 2;
    return new Promise((resolve, reject) => {
        if (game==true) {
            resolve(1);
            return
        }
        intervalId_x = setInterval(() => {
        const time = time_x.firstChild;
        const input_x = document.getElementById("pieces-x");
        is_dragabble(input_x);
        if (!time) return;

        time.innerText = counter;

        counter--;

        if (counter < 0) {
          non_draggable(input_x);
          clearInterval(intervalId_x);
          resolve();
        }
      }, 1000);
    });
  },
};

const O_user = {
  
  timer: function Timer() {
    let counter = 2;
    return new Promise((resolve, reject) => {
        if (game==true) {
            resolve(1);
            return
        }
        intervalId_o = setInterval(() => {
        const time = time_o.firstChild;
        const input_o = document.getElementById("pieces-o");
        is_dragabble(input_o);
        if (!time) return;

        time.innerText = counter;

        counter--;

        if (counter < 0) {
          non_draggable(input_o);
          clearInterval(intervalId_o);
          resolve();
        }
      }, 1000);
    });
  },
};
let popup_timeout;
function popup_message(message) {

    clearTimeout(popup_timeout);
  const message_box = document.getElementById("popup");
  message_box.innerHTML = ""
  let text = document.createElement("h1");
 
  text.innerText = message;
  message_box.appendChild(text);
  

  popup.style.display = "block";
  popup_timeout=setTimeout(() => {
      stopgame();
    text.innerHTML='';
    popup.style.display = "none";
    reset();
    
  }, 3000);

}






function is_dragabble(container) {
  const pieces = container.querySelectorAll("img");
  pieces.forEach((piece) => {
    piece.setAttribute("draggable", "true");
  });
}
function non_draggable(container) {
  const pieces = container.querySelectorAll("img");
  pieces.forEach((piece) => {
    piece.setAttribute("draggable", "false");
  });
}

async function turns() {
    console.log('turns is working')
  await X_user.timer(); // Player X's turn
  await O_user.timer(); // Player O's turn
}
async function gameLoop() {
    console.log('gameloop is working')
  while (true) {
    await turns(); 
    if (game) {
        console.log('gameloop is stopped working')
        return;
      }
  }
}

//This is game starter
let remove_img_interval;
function remove_img(box) {
  console.log('remove-img is working')
  if (box.querySelector("img")) {
    remove_img_interval  = setInterval(
      (() => {
        if (remove) {
            clearInterval(remove_img_interval);
            console.log('remove-img is stopped')
            return;
          }
        const img = box.querySelector("img");
        if (img) box.removeChild(img);
      }),
      18000
    );
  }
}

// Select all boxes
document.querySelectorAll(".boxes .box").forEach((box) => {
  // Create a MutationObserver to watch for added nodes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Check if any of the added nodes are images
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === "IMG") {
            remove_img(box);
          }
        });
      }
    });
  });

  // Start observing the box for changes
  observer.observe(box, { childList: true });
});









  